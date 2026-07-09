from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.models.user import UserRole
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/faculty", tags=["Faculty"])


@router.get("", response_model=list[UserResponse])
def list_faculty(_: CurrentUser, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return UserService(db).list_by_role(UserRole.FACULTY.value, skip, limit)
