from app.repositories.academic_repository import CourseRepository, DepartmentRepository, SubjectRepository
from app.repositories.exam_repository import AttemptRepository, ExamRepository, QuestionRepository, ResultRepository, ViolationRepository
from app.repositories.user_repository import UserRepository

__all__ = [
    "AttemptRepository",
    "CourseRepository",
    "DepartmentRepository",
    "ExamRepository",
    "QuestionRepository",
    "ResultRepository",
    "SubjectRepository",
    "UserRepository",
    "ViolationRepository",
]
