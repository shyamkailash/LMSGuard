from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.schemas.dashboard import AdminDashboardResponse, FacultyDashboardResponse, StudentDashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin", response_model=AdminDashboardResponse)
def admin_dashboard(_: CurrentUser, db: Session = Depends(get_db)):
    return DashboardService(db).admin()


@router.get("/faculty", response_model=FacultyDashboardResponse)
def faculty_dashboard(current_user: CurrentUser, db: Session = Depends(get_db)):
    return DashboardService(db).faculty(current_user.id)


@router.get("/student", response_model=StudentDashboardResponse)
def student_dashboard(current_user: CurrentUser, db: Session = Depends(get_db)):
    return DashboardService(db).student(current_user.id)
