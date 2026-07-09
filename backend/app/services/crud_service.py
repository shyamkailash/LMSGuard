from fastapi import status

from app.core.exceptions import AppException
from app.repositories.base import BaseRepository


class CrudService:
    def __init__(self, repository: BaseRepository):
        self.repository = repository

    def list(self, skip: int = 0, limit: int = 100):
        return self.repository.list(skip, limit)

    def get(self, item_id: int):
        item = self.repository.get(item_id)
        if item is None:
            raise AppException("Resource not found.", status.HTTP_404_NOT_FOUND)
        return item

    def create(self, payload):
        return self.repository.create(payload.model_dump())

    def update(self, item_id: int, payload):
        item = self.get(item_id)
        return self.repository.update(item, payload.model_dump(exclude_unset=True))

    def delete(self, item_id: int) -> None:
        self.repository.delete(self.get(item_id))
