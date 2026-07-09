from fastapi import APIRouter

from app.core.dependencies import CurrentUser
from app.schemas.proctoring import MonitoringSignal

router = APIRouter(prefix="/proctoring", tags=["AI Proctoring"])


@router.get("/signals", response_model=list[MonitoringSignal])
def monitoring_signals(_: CurrentUser):
    return [
        MonitoringSignal(name="face_detection", status="placeholder", message="Face detection service is injectable but not implemented."),
        MonitoringSignal(name="eye_tracking", status="placeholder", message="Eye tracking service is injectable but not implemented."),
        MonitoringSignal(name="tab_switching", status="placeholder", message="Tab switching telemetry endpoint is reserved."),
    ]
