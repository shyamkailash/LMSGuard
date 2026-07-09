from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(db, User)

    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email.lower()))

    def list_by_role(self, role: str, skip: int = 0, limit: int = 100) -> list[User]:
        return list(
            self.db.scalars(
                select(User).where(User.role == role).offset(skip).limit(limit),
            ).all(),
        )

    def count_by_role(self, role: str) -> int:
        return len(self.list_by_role(role, limit=10_000))
