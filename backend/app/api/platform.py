import json

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.models.platform import ExamSecurityPolicy
from app.schemas.platform import (
    DashboardAnalyticsResponse,
    EvidenceResponse,
    ExamPasswordResponse,
    NotificationCreate,
    NotificationResponse,
    ReportExportResponse,
    RiskEventCreate,
    RiskEventResponse,
    SecurityPolicyResponse,
    SecurityPolicyUpdate,
    StudentJoinRequest,
    StudentLeaveRequest,
    StudentSessionResponse,
    StudentSessionUpdate,
)
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform", tags=["Platform"])


def serialize_policy(item: ExamSecurityPolicy) -> SecurityPolicyResponse:
    return SecurityPolicyResponse(
        id=item.id,
        exam_id=item.exam_id,
        name=item.name,
        permissions=json.loads(item.permissions_json),
        updated_by_id=item.updated_by_id,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


@router.get("/analytics", response_model=DashboardAnalyticsResponse)
def analytics(current_user: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).analytics(current_user)


@router.get("/exams/{exam_id}/passwords", response_model=ExamPasswordResponse)
def get_exam_passwords(exam_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).get_or_create_passwords(exam_id)


@router.post("/exams/{exam_id}/passwords/regenerate", response_model=ExamPasswordResponse)
def regenerate_exam_passwords(exam_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).regenerate_passwords(exam_id)


@router.get("/security-policy", response_model=SecurityPolicyResponse)
def get_global_security_policy(_: CurrentUser, db: Session = Depends(get_db)):
    return serialize_policy(PlatformService(db).get_policy(None))


@router.get("/exams/{exam_id}/security-policy", response_model=SecurityPolicyResponse)
def get_exam_security_policy(exam_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return serialize_policy(PlatformService(db).get_policy(exam_id))


@router.put("/security-policy", response_model=SecurityPolicyResponse)
def update_security_policy(payload: SecurityPolicyUpdate, current_user: CurrentUser, db: Session = Depends(get_db)):
    item = PlatformService(db).upsert_policy(current_user, payload.exam_id, payload.name, payload.permissions)
    return serialize_policy(item)


@router.get("/notifications", response_model=list[NotificationResponse])
def list_notifications(current_user: CurrentUser, unread_only: bool = False, db: Session = Depends(get_db)):
    return PlatformService(db).list_notifications(current_user, unread_only)


@router.post("/notifications", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(payload: NotificationCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).create_notification(payload)


@router.post("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: int, current_user: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).mark_notification_read(current_user, notification_id)


@router.post("/student-sessions/join", response_model=StudentSessionResponse, status_code=status.HTTP_201_CREATED)
def join_exam(payload: StudentJoinRequest, current_user: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).join_exam(current_user, payload)


@router.post("/student-sessions/{session_id}/leave", response_model=StudentSessionResponse)
def leave_exam(session_id: int, payload: StudentLeaveRequest, current_user: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).leave_exam(current_user, session_id, payload.quit_password)


@router.patch("/student-sessions/{session_id}", response_model=StudentSessionResponse)
def update_student_session(session_id: int, payload: StudentSessionUpdate, _: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).update_session(session_id, payload)


@router.get("/student-sessions", response_model=list[StudentSessionResponse])
def list_student_sessions(_: CurrentUser, exam_id: int | None = None, db: Session = Depends(get_db)):
    return PlatformService(db).list_sessions(exam_id)


@router.post("/risk-events", response_model=RiskEventResponse, status_code=status.HTTP_201_CREATED)
def create_risk_event(payload: RiskEventCreate, request: Request, current_user: CurrentUser, db: Session = Depends(get_db)):
    return PlatformService(db).record_risk_event(current_user, payload, request.client.host if request.client else None)


@router.get("/evidence", response_model=list[EvidenceResponse])
def list_evidence(_: CurrentUser, session_id: int | None = None, db: Session = Depends(get_db)):
    return PlatformService(db).list_evidence(session_id)


@router.get("/reports/export", response_model=ReportExportResponse)
def export_report(_: CurrentUser, format: str = "csv", db: Session = Depends(get_db)):
    return PlatformService(db).export_report(format)
