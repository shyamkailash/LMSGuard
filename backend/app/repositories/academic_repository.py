from sqlalchemy.orm import Session

from app.models.academic import Course, Department, Subject
from app.repositories.base import BaseRepository


class DepartmentRepository(BaseRepository[Department]):
    def __init__(self, db: Session):
        super().__init__(db, Department)


class CourseRepository(BaseRepository[Course]):
    def __init__(self, db: Session):
        super().__init__(db, Course)


class SubjectRepository(BaseRepository[Subject]):
    def __init__(self, db: Session):
        super().__init__(db, Subject)
