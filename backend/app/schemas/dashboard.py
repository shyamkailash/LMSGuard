from pydantic import BaseModel


class AdminDashboardResponse(BaseModel):
    total_students: int
    total_faculty: int
    total_exams: int
    active_exams: int
    violations_today: int


class FacultyDashboardResponse(BaseModel):
    my_exams: int
    students: int
    reports: int


class StudentDashboardResponse(BaseModel):
    upcoming_exams: int
    completed_exams: int
    average_score: float
