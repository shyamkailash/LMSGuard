from typing import List

from fastapi import FastAPI, Query
from pydantic import BaseModel

from app.agents.lms_agent import LMSGuardAgent
from app.database import init_db, save_risk_log, get_risk_logs


app = FastAPI(title="LMSGuard Backend")

init_db()

lms_agent = LMSGuardAgent()


class AgentAnalyzeRequest(BaseModel):
    student_id: str
    events: List[str]


@app.get("/")
def home():
    return {"message": "LMSGuard Backend Running"}


@app.post("/api/agent/analyze")
def analyze_agent_events(request: AgentAnalyzeRequest):
    result = lms_agent.analyze_events(
        student_id=request.student_id,
        events=request.events
    )

    log_id = save_risk_log(
        student_id=request.student_id,
        events=request.events,
        result=result
    )

    result["log_id"] = log_id

    return result


@app.get("/api/agent/logs")
def get_agent_logs(limit: int = Query(default=50, ge=1, le=100)):
    logs = get_risk_logs(limit=limit)
    return {"logs": logs}