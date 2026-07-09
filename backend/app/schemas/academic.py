from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    code: str = Field(min_length=2, max_length=30)


class DepartmentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    code: str | None = Field(default=None, min_length=2, max_length=30)


class DepartmentResponse(ORMModel):
    id: int
    name: str
    code: str
    created_at: datetime


class CourseCreate(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    code: str = Field(min_length=2, max_length=40)
    department_id: int
    faculty_id: int | None = None


class CourseUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=180)
    code: str | None = Field(default=None, min_length=2, max_length=40)
    department_id: int | None = None
    faculty_id: int | None = None


class CourseResponse(ORMModel):
    id: int
    name: str
    code: str
    department_id: int
    faculty_id: int | None
    created_at: datetime


class SubjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    code: str = Field(min_length=2, max_length=40)
    description: str | None = None
    department_id: int
    course_id: int | None = None


class SubjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=180)
    code: str | None = Field(default=None, min_length=2, max_length=40)
    description: str | None = None
    department_id: int | None = None
    course_id: int | None = None


class SubjectResponse(ORMModel):
    id: int
    name: str
    code: str
    description: str | None
    department_id: int
    course_id: int | None
    created_at: datetime
