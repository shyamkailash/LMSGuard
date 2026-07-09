from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserResponse])
def list_users(_: CurrentUser, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return UserService(db).list_users(skip, limit)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return UserService(db).get_user(user_id)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return UserService(db).create_user(payload)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdate, _: CurrentUser, db: Session = Depends(get_db)):
    return UserService(db).update_user(user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    UserService(db).delete_user(user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
