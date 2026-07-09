from fastapi import APIRouter

from . import academic, admins, auth, dashboard, exams, faculty, health, proctoring, reports, students, users

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(students.router)
api_router.include_router(faculty.router)
api_router.include_router(admins.router)
api_router.include_router(academic.router)
api_router.include_router(exams.router)
api_router.include_router(dashboard.router)
api_router.include_router(reports.router)
api_router.include_router(proctoring.router)

__all__ = ["api_router"]
