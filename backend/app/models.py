"""
LMSGuard — SQLAlchemy ORM models.

All tables are defined here so `Base.metadata.create_all` only needs to be
called once, from `main.py`.
"""
from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey,
    Integer, String, Text, func,
)
from sqlalchemy.orm import relationship

from app.database import Base


# ── Users ─────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer,  primary_key=True, index=True)
    full_name       = Column(String(120), nullable=False)
    identifier      = Column(String(120), unique=True, nullable=False)
    email           = Column(String(180), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role            = Column(String(20),  nullable=False)  # admin | invigilator | student
    department      = Column(String(100), nullable=True)
    class_name      = Column(String(100), nullable=True)
    roll_number     = Column(String(50),  nullable=True)
    is_active       = Column(Boolean, default=True, nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ── Academic structure ────────────────────────────────────────────────────────

class Department(Base):
    __tablename__ = "departments"

    id      = Column(Integer, primary_key=True, index=True)
    name    = Column(String(120), unique=True, nullable=False)
    code    = Column(String(20),  unique=True, nullablpyhton=False)
    hod     = Column(String(120), nullable=True)

    classes  = relationship("SchoolClass", back_populates="department_rel", cascade="all, delete-orphan")
    students = relationship("Student",     back_populates="department_rel")


class SchoolClass(Base):
    __tablename__ = "classes"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(80),  nullable=False)
    dept_id       = Column(Integer, ForeignKey("departments.id"), nullable=True)
    year          = Column(String(20),  nullable=True)
    section       = Column(String(10),  nullable=True)
    strength      = Column(Integer, default=0)

    department_rel = relationship("Department", back_populates="classes")
    students       = relationship("Student",    back_populates="class_rel")


class Student(Base):
    __tablename__ = "students"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(120), nullable=False)
    register_no = Column(String(50),  unique=True, nullable=False)
    department  = Column(String(100), nullable=True)
    year        = Column(String(20),  nullable=True)
    dept_id     = Column(Integer, ForeignKey("departments.id"), nullable=True)
    class_id    = Column(Integer, ForeignKey("classes.id"),     nullable=True)
    user_id     = Column(Integer, ForeignKey("users.id"),       nullable=True)

    department_rel = relationship("Department", back_populates="students")
    class_rel      = relationship("SchoolClass", back_populates="students")


class Exam(Base):
    __tablename__ = "exams"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(200), nullable=False)
    subject    = Column(String(200), nullable=True)
    code       = Column(String(30),  nullable=True)
    class_name = Column(String(80),  nullable=True)
    date       = Column(String(20),  nullable=True)
    start_time = Column(String(20),  nullable=True)
    end_time   = Column(String(20),  nullable=True)
    duration   = Column(Integer,     default=60)
    status     = Column(String(20),  default="scheduled")


# ── Monitoring ────────────────────────────────────────────────────────────────

class MonitoringEvent(Base):
    __tablename__ = "monitoring_events"

    id         = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(60),  nullable=False)
    student_id = Column(String(60),  nullable=False)
    timestamp  = Column(String(40),  nullable=False)
    payload    = Column(Text,        nullable=False)


class LiveAlert(Base):
    __tablename__ = "live_alerts"

    id         = Column(Integer, primary_key=True, index=True)
    event_id   = Column(Integer, ForeignKey("monitoring_events.id"), nullable=True)
    student_id = Column(String(60),  nullable=False)
    alert_type = Column(String(60),  nullable=False)
    risk       = Column(String(20),  nullable=False)
    message    = Column(Text,        nullable=False)
    timestamp  = Column(String(40),  nullable=False)
    payload    = Column(Text,        nullable=False)


class ExamSecurityControl(Base):
    __tablename__ = "exam_security_controls"

    id                       = Column(Integer, primary_key=True, index=True)
    student_id               = Column(String(60), unique=True, nullable=False)
    monitoring_enabled       = Column(Boolean, default=True)
    exam_locked              = Column(Boolean, default=False)
    screen_capture_enabled   = Column(Boolean, default=True)
    unauthorized_app_blocking= Column(Boolean, default=True)
    clipboard_blocked        = Column(Boolean, default=True)
    tab_switch_blocked       = Column(Boolean, default=True)
    warning_message          = Column(Text,    default="You are under active exam monitoring.")
    updated_at               = Column(String(40), nullable=True)
