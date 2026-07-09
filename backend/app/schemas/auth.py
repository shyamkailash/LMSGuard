from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole
from app.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    role: UserRole = UserRole.STUDENT
    department_id: int | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class FirebaseSessionRequest(BaseModel):
    uid: str = Field(min_length=6, max_length=128)
    email: EmailStr
    name: str | None = Field(default=None, max_length=150)
    role: UserRole = UserRole.STUDENT


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
