from fastapi import APIRouter

from app.core.config import settings
from app.database.session import is_database_connected

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict[str, object]:
    return {
        "success": True,
        "status": "healthy",
        "backend": "running",
        "database": "connected" if is_database_connected() else "disconnected",
        "version": settings.version,
    }
