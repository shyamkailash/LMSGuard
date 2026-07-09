from datetime import datetime

from pydantic import BaseModel


class ReportSummary(BaseModel):
    id: int
    title: str
    generated_at: datetime
    status: str
    summary: str
