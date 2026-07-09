from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole
from app.schemas.common import ORMModel


class UserBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    role: UserRole = UserRole.STUDENT
    department_id: int | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    role: UserRole | None = None
    department_id: int | None = None
    password: str | None = Field(default=None, min_length=6, max_length=128)


class UserResponse(ORMModel):
    id: int
    name: str
    email: EmailStr
    role: str
    department_id: int | None = None
    created_at: datetime


class RoleResponse(ORMModel):
    id: int
    name: str
