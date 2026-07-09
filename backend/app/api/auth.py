from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.schemas.auth import FirebaseSessionRequest, LoginRequest, RegisterRequest, TokenResponse
from app.schemas.common import ApiResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return AuthService(db).register(payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return AuthService(db).login(payload)


@router.post("/firebase-session", response_model=TokenResponse)
def firebase_session(payload: FirebaseSessionRequest, db: Session = Depends(get_db)):
    return AuthService(db).firebase_session(payload)


@router.post("/logout", response_model=ApiResponse[None])
def logout(_: CurrentUser):
    return ApiResponse(message="Logged out successfully.")


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser):
    return current_user
