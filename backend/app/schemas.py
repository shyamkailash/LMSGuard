"""
LMSGuard — Pydantic request/response schemas.
"""
from typing import Any, List, Optional
from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    identifier: str          # email or roll_number
    password:   str
    role:       str          # admin | invigilator | student


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    role:         str
    full_name:    str
    identifier:   str
    user_id:      int


# ── User ─────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id:          int
    full_name:   str
    identifier:  str
    email:       Optional[str]
    role:        str
    department:  Optional[str]
    class_name:  Optional[str]
    roll_number: Optional[str]
    is_active:   bool

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    full_name:   str
    identifier:  str
    email:       Optional[str] = None
    password:    str
    role:        str
    department:  Optional[str] = None
    class_name:  Optional[str] = None
    roll_number: Optional[str] = None


# ── Department ────────────────────────────────────────────────────────────────

class DepartmentOut(BaseModel):
    id:   int
    name: str
    code: str
    hod:  Optional[str]

    class Config:
        from_attributes = True


# ── Class ─────────────────────────────────────────────────────────────────────

class ClassOut(BaseModel):
    id:       int
    name:     str
    year:     Optional[str]
    section:  Optional[str]
    strength: int

    class Config:
        from_attributes = True


# ── Student ───────────────────────────────────────────────────────────────────

class StudentOut(BaseModel):
    id:          int
    name:        str
    register_no: str
    department:  Optional[str]
    year:        Optional[str]

    class Config:
        from_attributes = True


# ── Exam ─────────────────────────────────────────────────────────────────────

class ExamOut(BaseModel):
    id:         int
    title:      str
    subject:    Optional[str]
    code:       Optional[str]
    class_name: Optional[str]
    date:       Optional[str]
    start_time: Optional[str]
    end_time:   Optional[str]
    duration:   int
    status:     str

    class Config:
        from_attributes = True


# ── Security Controls ─────────────────────────────────────────────────────────

class SecurityControlUpdate(BaseModel):
    student_id:                str
    monitoring_enabled:        Optional[bool] = None
    exam_locked:               Optional[bool] = None
    screen_capture_enabled:    Optional[bool] = None
    unauthorized_app_blocking: Optional[bool] = None
    clipboard_blocked:         Optional[bool] = None
    tab_switch_blocked:        Optional[bool] = None
    warning_message:           Optional[str]  = None


# ── Generic ───────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    detail:  Optional[Any] = None
