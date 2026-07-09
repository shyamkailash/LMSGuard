import csv
import io
import json
import secrets
import string
from datetime import datetime, timezone

from fastapi import status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.models.exam import Exam
from app.models.platform import Evidence, ExamPassword, ExamSecurityPolicy, Notification, PlatformActivityLog, RiskEvent, StudentSession
from app.models.user import User
from app.schemas.platform import DEFAULT_SECURITY_PERMISSIONS, DashboardAnalyticsResponse, NotificationCreate, ReportExportResponse

PASSWORD_ALPHABET = string.ascii_uppercase + string.digits

RISK_DELTAS = {
    "tab_switch": 12,
    "face_missing": 18,
    "phone_detected": 22,
    "multiple_faces": 24,
    "looking_away": 10,
    "mic_disabled": 8,
    "camera_disabled": 14,
    "fullscreen_exit": 15,
    "unauthorized_software": 25,
    "copy_paste": 10,
    "keyboard_shortcut": 8,
    "devtools_opened": 20,
    "internet_disconnect": 12,
}


def risk_level(score: int) -> str:
    if score <= 20:
        return "low"
    if score <= 50:
        return "medium"
    if score <= 80:
        return "high"
    return "critical"


class PlatformService:
    def __init__(self, db: Session):
        self.db = db

    def _commit_refresh(self, item):
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def _generate_password(self, prefix: str = "") -> str:
        length = 6 - len(prefix)
        return f"{prefix}{''.join(secrets.choice(PASSWORD_ALPHABET) for _ in range(length))}"

    def _unique_password(self, column_name: str, prefix: str = "") -> str:
        for _ in range(64):
            password = self._generate_password(prefix)
            column = getattr(ExamPassword, column_name)
            if self.db.scalar(select(ExamPassword).where(column == password)) is None:
                return password
        raise AppException("Could not generate a unique exam password.", status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_or_create_passwords(self, exam_id: int) -> ExamPassword:
        existing = self.db.scalar(select(ExamPassword).where(ExamPassword.exam_id == exam_id))
        if existing:
            return existing

        if self.db.get(Exam, exam_id) is None:
            raise AppException("Exam not found.", status.HTTP_404_NOT_FOUND)

        item = ExamPassword(
            exam_id=exam_id,
            start_password=self._unique_password("start_password"),
            quit_password=self._unique_password("quit_password", "QT"),
        )
        return self._commit_refresh(item)

    def regenerate_passwords(self, exam_id: int) -> ExamPassword:
        item = self.get_or_create_passwords(exam_id)
        item.start_password = self._unique_password("start_password")
        item.quit_password = self._unique_password("quit_password", "QT")
        item.updated_at = datetime.now(timezone.utc)
        return self._commit_refresh(item)

    def get_policy(self, exam_id: int | None = None) -> ExamSecurityPolicy:
        query = select(ExamSecurityPolicy).where(ExamSecurityPolicy.exam_id == exam_id)
        existing = self.db.scalar(query)
        if existing:
            return existing

        item = ExamSecurityPolicy(
            exam_id=exam_id,
            name="Default examination security",
            permissions_json=json.dumps(DEFAULT_SECURITY_PERMISSIONS),
        )
        return self._commit_refresh(item)

    def upsert_policy(self, user: User, exam_id: int | None, name: str, permissions: dict[str, bool]) -> ExamSecurityPolicy:
        normalized = DEFAULT_SECURITY_PERMISSIONS.copy()
        normalized.update({key: bool(value) for key, value in permissions.items() if key in normalized})
        item = self.get_policy(exam_id)
        item.name = name
        item.permissions_json = json.dumps(normalized)
        item.updated_by_id = user.id
        item.updated_at = datetime.now(timezone.utc)
        self.log(user, "permission_changed", f"Updated security policy {item.name}", "security_policy", item.id)
        return self._commit_refresh(item)

    def create_notification(self, payload: NotificationCreate) -> Notification:
        item = Notification(**payload.model_dump())
        return self._commit_refresh(item)

    def list_notifications(self, user: User, unread_only: bool = False) -> list[Notification]:
        query = select(Notification).where(
            (Notification.recipient_user_id.is_(None)) | (Notification.recipient_user_id == user.id),
        )
        if unread_only:
            query = query.where(Notification.read_at.is_(None))
        query = query.order_by(Notification.created_at.desc()).limit(100)
        return list(self.db.scalars(query).all())

    def mark_notification_read(self, user: User, notification_id: int) -> Notification:
        item = self.db.get(Notification, notification_id)
        if item is None or (item.recipient_user_id not in (None, user.id)):
            raise AppException("Notification not found.", status.HTTP_404_NOT_FOUND)
        item.read_at = datetime.now(timezone.utc)
        return self._commit_refresh(item)

    def join_exam(self, user: User, payload) -> StudentSession:
        password = self.get_or_create_passwords(payload.exam_id)
        if payload.start_password.upper() != password.start_password:
            raise AppException("Invalid exam start password.", status.HTTP_403_FORBIDDEN)

        exam = self.db.get(Exam, payload.exam_id)
        if exam is None:
            raise AppException("Exam not found.", status.HTTP_404_NOT_FOUND)

        existing = self.db.scalar(
            select(StudentSession).where(
                StudentSession.exam_id == payload.exam_id,
                StudentSession.student_id == user.id,
            ),
        )
        item = existing or StudentSession(
            exam_id=payload.exam_id,
            student_id=user.id,
            student_name=user.name,
            exam_title=exam.title,
        )
        item.roll_number = payload.roll_number
        item.department = payload.department
        item.internet_speed_mbps = payload.internet_speed_mbps
        item.camera_enabled = payload.camera_enabled
        item.microphone_enabled = payload.microphone_enabled
        item.fullscreen_enabled = payload.fullscreen_enabled
        item.current_tab = payload.current_tab
        item.battery_level = payload.battery_level
        item.status = "online"
        item.last_seen_at = datetime.now(timezone.utc)
        self.log(user, "exam_start", f"{user.name} joined {exam.title}", "exam", exam.id)
        self.create_notification(
            NotificationCreate(
                title="Student joined exam",
                body=f"{user.name} joined {exam.title}.",
                category="exam",
                severity="info",
                entity_type="student_session",
            ),
        )
        return self._commit_refresh(item)

    def leave_exam(self, user: User, session_id: int, quit_password: str) -> StudentSession:
        item = self.db.get(StudentSession, session_id)
        if item is None or item.student_id != user.id:
            raise AppException("Student session not found.", status.HTTP_404_NOT_FOUND)
        password = self.get_or_create_passwords(item.exam_id)
        if quit_password.upper() != password.quit_password:
            raise AppException("Invalid quit password.", status.HTTP_403_FORBIDDEN)
        item.status = "submitted"
        item.last_seen_at = datetime.now(timezone.utc)
        self.log(user, "exam_finish", f"{user.name} submitted {item.exam_title}", "student_session", item.id)
        return self._commit_refresh(item)

    def update_session(self, session_id: int, payload) -> StudentSession:
        item = self.db.get(StudentSession, session_id)
        if item is None:
            raise AppException("Student session not found.", status.HTTP_404_NOT_FOUND)
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(item, key, value)
        item.last_seen_at = datetime.now(timezone.utc)
        return self._commit_refresh(item)

    def list_sessions(self, exam_id: int | None = None) -> list[StudentSession]:
        query = select(StudentSession).order_by(StudentSession.risk_score.desc(), StudentSession.last_seen_at.desc())
        if exam_id is not None:
            query = query.where(StudentSession.exam_id == exam_id)
        return list(self.db.scalars(query.limit(200)).all())

    def record_risk_event(self, user: User, payload, ip_address: str | None = None) -> RiskEvent:
        session = self.db.get(StudentSession, payload.session_id)
        if session is None:
            raise AppException("Student session not found.", status.HTTP_404_NOT_FOUND)

        delta = RISK_DELTAS.get(payload.event_type, 6)
        session.risk_score = min(100, max(0, session.risk_score + delta))
        session.last_seen_at = datetime.now(timezone.utc)
        if payload.current_tab:
            session.current_tab = payload.current_tab

        event = RiskEvent(
            session_id=session.id,
            event_type=payload.event_type,
            severity=risk_level(session.risk_score),
            delta=delta,
            risk_score=session.risk_score,
            message=payload.message or payload.event_type.replace("_", " ").title(),
        )
        self.db.add(session)
        self.db.add(event)
        self.db.flush()

        evidence = Evidence(
            session_id=session.id,
            risk_event_id=event.id,
            violation_type=payload.event_type,
            risk_score=session.risk_score,
            screenshot_url=payload.screenshot_url,
            camera_image_url=payload.camera_image_url,
            current_tab=payload.current_tab or session.current_tab,
            browser=payload.browser,
            device=payload.device,
            ip_address=ip_address,
            notes=event.message,
        )
        self.db.add(evidence)

        if session.risk_score >= 51:
            title = "Critical risk detected" if session.risk_score >= 81 else "High risk detected"
            self.db.add(
                Notification(
                    title=title,
                    body=f"{session.student_name} reached {session.risk_score}% risk in {session.exam_title}.",
                    category="risk",
                    severity=event.severity,
                    entity_type="student_session",
                    entity_id=session.id,
                ),
            )

        self.log(user, "risk_increased", f"{session.student_name}: {event.message}", "student_session", session.id)
        self.db.commit()
        self.db.refresh(event)
        return event

    def list_evidence(self, session_id: int | None = None) -> list[Evidence]:
        query = select(Evidence).order_by(Evidence.created_at.desc())
        if session_id is not None:
            query = query.where(Evidence.session_id == session_id)
        return list(self.db.scalars(query.limit(200)).all())

    def analytics(self, user: User) -> DashboardAnalyticsResponse:
        total = self.db.scalar(select(func.count(StudentSession.id))) or 0
        online = self.db.scalar(select(func.count(StudentSession.id)).where(StudentSession.status == "online")) or 0
        current_exams = self.db.scalar(select(func.count(func.distinct(StudentSession.exam_id)))) or 0
        average_risk = self.db.scalar(select(func.avg(StudentSession.risk_score))) or 0
        high = self.db.scalar(select(func.count(StudentSession.id)).where(StudentSession.risk_score.between(51, 80))) or 0
        critical = self.db.scalar(select(func.count(StudentSession.id)).where(StudentSession.risk_score >= 81)) or 0
        unread = self.db.scalar(
            select(func.count(Notification.id)).where(
                Notification.read_at.is_(None),
                (Notification.recipient_user_id.is_(None)) | (Notification.recipient_user_id == user.id),
            ),
        ) or 0
        return DashboardAnalyticsResponse(
            total_students=total,
            online_students=online,
            offline_students=max(total - online, 0),
            current_exams=current_exams,
            average_risk=round(float(average_risk), 2),
            high_risk_students=high,
            critical_risk_students=critical,
            unread_notifications=unread,
            system_health=98 if critical == 0 else 82,
        )

    def export_report(self, format_name: str) -> ReportExportResponse:
        sessions = self.list_sessions()
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Student", "Roll Number", "Department", "Exam", "Risk Score", "Status", "Last Seen"])
        for item in sessions:
            writer.writerow([item.student_name, item.roll_number, item.department, item.exam_title, item.risk_score, item.status, item.last_seen_at.isoformat()])
        normalized = format_name.lower()
        extension = "csv" if normalized not in {"pdf", "excel"} else ("xlsx" if normalized == "excel" else "pdf")
        return ReportExportResponse(
            format=normalized,
            filename=f"lmsguard-report.{extension}",
            content_type="text/csv",
            data=output.getvalue(),
        )

    def log(self, user: User | None, action: str, message: str, entity_type: str | None = None, entity_id: int | None = None) -> None:
        self.db.add(
            PlatformActivityLog(
                user_id=user.id if user else None,
                role=user.role if user else "",
                action=action,
                message=message,
                entity_type=entity_type,
                entity_id=entity_id,
            ),
        )
