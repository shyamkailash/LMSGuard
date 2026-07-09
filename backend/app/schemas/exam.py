from datetime import datetime

from pydantic import BaseModel, Field

from app.models.exam import AttemptStatus, ExamStatus
from app.schemas.common import ORMModel


class ExamCreate(BaseModel):
    title: str = Field(min_length=2, max_length=220)
    description: str | None = None
    course_id: int | None = None
    subject_id: int | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    duration_minutes: int = Field(default=60, ge=1)
    status: ExamStatus = ExamStatus.DRAFT


class ExamUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=220)
    description: str | None = None
    course_id: int | None = None
    subject_id: int | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    duration_minutes: int | None = Field(default=None, ge=1)
    status: ExamStatus | None = None


class ExamResponse(ORMModel):
    id: int
    title: str
    description: str | None
    course_id: int | None
    subject_id: int | None
    created_by_id: int | None
    starts_at: datetime | None
    ends_at: datetime | None
    duration_minutes: int
    status: str
    created_at: datetime


class QuestionCreate(BaseModel):
    exam_id: int
    prompt: str = Field(min_length=2)
    question_type: str = "multiple_choice"
    options_json: str | None = None
    correct_answer: str | None = None
    marks: float = Field(default=1.0, ge=0)


class QuestionResponse(ORMModel):
    id: int
    exam_id: int
    prompt: str
    question_type: str
    options_json: str | None
    marks: float


class AttemptCreate(BaseModel):
    exam_id: int
    student_id: int


class AttemptResponse(ORMModel):
    id: int
    exam_id: int
    student_id: int
    status: str
    started_at: datetime | None
    submitted_at: datetime | None
    score: float | None


class ResultCreate(BaseModel):
    attempt_id: int
    total_marks: float = Field(ge=0)
    obtained_marks: float = Field(ge=0)
    grade: str | None = None


class ResultResponse(ORMModel):
    id: int
    attempt_id: int
    total_marks: float
    obtained_marks: float
    percentage: float
    grade: str | None
    published_at: datetime | None


class ViolationCreate(BaseModel):
    attempt_id: int
    violation_type: str = Field(min_length=2, max_length=120)
    severity: str = "medium"
    confidence: float = Field(default=0, ge=0, le=100)
    evidence_url: str | None = None
    notes: str | None = None


class ViolationResponse(ORMModel):
    id: int
    attempt_id: int
    violation_type: str
    severity: str
    confidence: float
    evidence_url: str | None
    notes: str | None
    occurred_at: datetime
