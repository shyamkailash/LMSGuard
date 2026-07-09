from pydantic import BaseModel


class MonitoringSignal(BaseModel):
    name: str
    status: str
    confidence: float | None = None
    message: str
