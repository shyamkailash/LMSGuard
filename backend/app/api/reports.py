from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.dependencies import CurrentUser
from app.schemas.report import ReportSummary

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("", response_model=list[ReportSummary])
def list_reports(_: CurrentUser):
    return [
        ReportSummary(
            id=1,
            title="Academic Integrity Overview",
            generated_at=datetime.now(timezone.utc),
            status="ready",
            summary="Report generation pipeline is ready for database-backed exports.",
        ),
    ]
