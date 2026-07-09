from sqlalchemy.orm import Session

from app.models.exam import ExamStatus
from app.models.user import UserRole
from app.repositories.exam_repository import AttemptRepository, ExamRepository, ViolationRepository
from app.repositories.user_repository import UserRepository
from app.schemas.dashboard import AdminDashboardResponse, FacultyDashboardResponse, StudentDashboardResponse


class DashboardService:
    def __init__(self, db: Session):
        self.users = UserRepository(db)
        self.exams = ExamRepository(db)
        self.attempts = AttemptRepository(db)
        self.violations = ViolationRepository(db)

    def admin(self) -> AdminDashboardResponse:
        exams = self.exams.list(limit=10_000)
        return AdminDashboardResponse(
            total_students=self.users.count_by_role(UserRole.STUDENT.value),
            total_faculty=self.users.count_by_role(UserRole.FACULTY.value),
            total_exams=len(exams),
            active_exams=len([exam for exam in exams if exam.status == ExamStatus.ACTIVE.value]),
            violations_today=len(self.violations.list_today()),
        )

    def faculty(self, faculty_id: int) -> FacultyDashboardResponse:
        exams = [exam for exam in self.exams.list(limit=10_000) if exam.created_by_id == faculty_id]
        return FacultyDashboardResponse(my_exams=len(exams), students=self.users.count_by_role(UserRole.STUDENT.value), reports=len(exams))

    def student(self, student_id: int) -> StudentDashboardResponse:
        attempts = [attempt for attempt in self.attempts.list(limit=10_000) if attempt.student_id == student_id]
        completed = [attempt for attempt in attempts if attempt.submitted_at is not None]
        scores = [attempt.score for attempt in completed if attempt.score is not None]
        average_score = sum(scores) / len(scores) if scores else 0
        return StudentDashboardResponse(upcoming_exams=0, completed_exams=len(completed), average_score=average_score)
