from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session):
        self.users = UserRepository(db)

    def list_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        return self.users.list(skip, limit)

    def list_by_role(self, role: str, skip: int = 0, limit: int = 100) -> list[User]:
        return self.users.list_by_role(role, skip, limit)

    def get_user(self, user_id: int) -> User:
        user = self.users.get(user_id)
        if user is None:
            raise AppException("User not found.", status.HTTP_404_NOT_FOUND)
        return user

    def create_user(self, payload: UserCreate) -> User:
        if self.users.get_by_email(payload.email):
            raise AppException("User with this email already exists.", status.HTTP_409_CONFLICT)
        data = payload.model_dump()
        data["email"] = data["email"].lower()
        data["role"] = data["role"].value
        data["password"] = hash_password(data["password"])
        return self.users.create(data)

    def update_user(self, user_id: int, payload: UserUpdate) -> User:
        user = self.get_user(user_id)
        data = payload.model_dump(exclude_unset=True)
        if "role" in data and data["role"] is not None:
            data["role"] = data["role"].value
        if "password" in data and data["password"]:
            data["password"] = hash_password(data["password"])
        if "email" in data and data["email"]:
            data["email"] = data["email"].lower()
        return self.users.update(user, data)

    def delete_user(self, user_id: int) -> None:
        self.users.delete(self.get_user(user_id))
