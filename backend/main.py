from typing import List

from fastapi import FastAPI
from pydantic import BaseModel

from app.agents.lms_agent import LMSGuardAgent


app = FastAPI()

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
    return result