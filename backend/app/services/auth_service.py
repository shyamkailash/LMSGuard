import logging

from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import FirebaseSessionRequest, LoginRequest, RegisterRequest, TokenResponse

logger = logging.getLogger("lmsguard.auth")


class AuthService:
    def __init__(self, db: Session):
        self.users = UserRepository(db)

    def register(self, payload: RegisterRequest) -> User:
        if self.users.get_by_email(payload.email):
            raise AppException("User with this email already exists.", status.HTTP_409_CONFLICT)

        user = self.users.create(
            {
                "name": payload.name,
                "email": payload.email.lower(),
                "password": hash_password(payload.password),
                "role": payload.role.value,
                "department_id": payload.department_id,
            },
        )
        logger.info("registered user_id=%s role=%s", user.id, user.role)
        return user

    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self.users.get_by_email(payload.email)
        if user is None or not verify_password(payload.password, user.password):
            logger.warning("failed login attempt email=%s", payload.email)
            raise AppException("Invalid email or password.", status.HTTP_401_UNAUTHORIZED)

        token = create_access_token(str(user.id), {"role": user.role})
        logger.info("successful login user_id=%s", user.id)
        return TokenResponse(access_token=token, user=user)

    def firebase_session(self, payload: FirebaseSessionRequest) -> TokenResponse:
        email = payload.email.lower()
        firebase_password = f"firebase:{payload.uid}:lmsguard-backend-session"
        user = self.users.get_by_email(email)

        if user is None:
            user = self.users.create(
                {
                    "name": payload.name or email.split("@")[0] or "LMSGuard User",
                    "email": email,
                    "password": hash_password(firebase_password),
                    "role": payload.role.value,
                    "department_id": None,
                },
            )
            logger.info("registered firebase user_id=%s role=%s", user.id, user.role)
        else:
            user = self.users.update(
                user,
                {
                    "name": payload.name or user.name,
                    "password": hash_password(firebase_password),
                    "role": user.role or payload.role.value,
                },
            )

        token = create_access_token(str(user.id), {"role": user.role})
        logger.info("successful firebase session user_id=%s", user.id)
        return TokenResponse(access_token=token, user=user)
