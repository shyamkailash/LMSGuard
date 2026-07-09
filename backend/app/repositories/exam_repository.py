from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.exam import Exam, ExamAttempt, ExamStatus, Question, Result, Violation
from app.repositories.base import BaseRepository


class ExamRepository(BaseRepository[Exam]):
    def __init__(self, db: Session):
        super().__init__(db, Exam)

    def list_active(self) -> list[Exam]:
        return list(self.db.scalars(select(Exam).where(Exam.status == ExamStatus.ACTIVE.value)).all())


class QuestionRepository(BaseRepository[Question]):
    def __init__(self, db: Session):
        super().__init__(db, Question)


class AttemptRepository(BaseRepository[ExamAttempt]):
    def __init__(self, db: Session):
        super().__init__(db, ExamAttempt)


class ResultRepository(BaseRepository[Result]):
    def __init__(self, db: Session):
        super().__init__(db, Result)


class ViolationRepository(BaseRepository[Violation]):
    def __init__(self, db: Session):
        super().__init__(db, Violation)

    def list_today(self) -> list[Violation]:
        start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        return list(self.db.scalars(select(Violation).where(Violation.occurred_at >= start)).all())
