from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class UserRole(StrEnum):
    ADMIN = "Admin"
    FACULTY = "Faculty"
    INVIGILATOR = "Invigilator"
    STUDENT = "Student"


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    users: Mapped[list["User"]] = relationship(back_populates="role_record")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), index=True, nullable=False, default=UserRole.STUDENT.value)
    role_id: Mapped[int | None] = mapped_column(ForeignKey("roles.id"), nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    role_record: Mapped[Role | None] = relationship(back_populates="users")
    department: Mapped["Department | None"] = relationship(back_populates="users")
    taught_courses: Mapped[list["Course"]] = relationship(back_populates="faculty")
    exam_attempts: Mapped[list["ExamAttempt"]] = relationship(back_populates="student")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="user")
