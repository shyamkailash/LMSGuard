from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ExamPassword(Base):
    __tablename__ = "exam_passwords"
    __table_args__ = (
        UniqueConstraint("exam_id", name="uq_exam_passwords_exam_id"),
        UniqueConstraint("start_password", name="uq_exam_passwords_start_password"),
        UniqueConstraint("quit_password", name="uq_exam_passwords_quit_password"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    exam_id: Mapped[int] = mapped_column(ForeignKey("exams.id"), nullable=False, index=True)
    start_password: Mapped[str] = mapped_column(String(6), nullable=False)
    quit_password: Mapped[str] = mapped_column(String(6), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ExamSecurityPolicy(Base):
    __tablename__ = "exam_security_policies"
    __table_args__ = (UniqueConstraint("exam_id", name="uq_exam_security_policies_exam_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    exam_id: Mapped[int | None] = mapped_column(ForeignKey("exams.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(160), default="Default examination security")
    permissions_json: Mapped[str] = mapped_column(Text, nullable=False)
    updated_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    recipient_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(80), default="system", index=True)
    severity: Mapped[str] = mapped_column(String(30), default="info", index=True)
    entity_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    entity_id: Mapped[int | None] = mapped_column(nullable=True)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class StudentSession(Base):
    __tablename__ = "student_sessions"
    __table_args__ = (UniqueConstraint("exam_id", "student_id", name="uq_student_sessions_exam_student"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    exam_id: Mapped[int] = mapped_column(ForeignKey("exams.id"), nullable=False, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    student_name: Mapped[str] = mapped_column(String(160), nullable=False)
    roll_number: Mapped[str] = mapped_column(String(80), default="")
    department: Mapped[str] = mapped_column(String(120), default="")
    exam_title: Mapped[str] = mapped_column(String(220), nullable=False)
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    internet_speed_mbps: Mapped[float] = mapped_column(Float, default=0.0)
    camera_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    microphone_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    fullscreen_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    current_tab: Mapped[str] = mapped_column(String(220), default="Exam")
    battery_level: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="online", index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class RiskEvent(Base):
    __tablename__ = "risk_events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("student_sessions.id"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(30), default="medium")
    delta: Mapped[int] = mapped_column(Integer, default=0)
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("student_sessions.id"), nullable=False, index=True)
    risk_event_id: Mapped[int | None] = mapped_column(ForeignKey("risk_events.id"), nullable=True)
    violation_type: Mapped[str] = mapped_column(String(120), nullable=False)
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    screenshot_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    camera_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    current_tab: Mapped[str] = mapped_column(String(220), default="")
    browser: Mapped[str] = mapped_column(String(120), default="")
    device: Mapped[str] = mapped_column(String(180), default="")
    ip_address: Mapped[str | None] = mapped_column(String(80), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class PlatformActivityLog(Base):
    __tablename__ = "platform_activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    role: Mapped[str] = mapped_column(String(60), default="")
    action: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    entity_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    entity_id: Mapped[int | None] = mapped_column(nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(80), nullable=True)
    device: Mapped[str] = mapped_column(String(180), default="")
    browser: Mapped[str] = mapped_column(String(120), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
