from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

ModelT = TypeVar("ModelT")


class BaseRepository(Generic[ModelT]):
    def __init__(self, db: Session, model: type[ModelT]):
        self.db = db
        self.model = model

    def list(self, skip: int = 0, limit: int = 100) -> list[ModelT]:
        return list(self.db.scalars(select(self.model).offset(skip).limit(limit)).all())

    def get(self, item_id: int) -> ModelT | None:
        return self.db.get(self.model, item_id)

    def create(self, data: dict[str, Any]) -> ModelT:
        item = self.model(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item: ModelT, data: dict[str, Any]) -> ModelT:
        for key, value in data.items():
            setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: ModelT) -> None:
        self.db.delete(item)
        self.db.commit()
