from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.repositories.academic_repository import CourseRepository, DepartmentRepository, SubjectRepository
from app.schemas.academic import (
    CourseCreate,
    CourseResponse,
    CourseUpdate,
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
    SubjectCreate,
    SubjectResponse,
    SubjectUpdate,
)
from app.services.crud_service import CrudService

router = APIRouter(tags=["Academic"])


@router.get("/departments", response_model=list[DepartmentResponse])
def list_departments(_: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(DepartmentRepository(db)).list()


@router.get("/departments/{item_id}", response_model=DepartmentResponse)
def get_department(item_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(DepartmentRepository(db)).get(item_id)


@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(payload: DepartmentCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(DepartmentRepository(db)).create(payload)


@router.put("/departments/{item_id}", response_model=DepartmentResponse)
def update_department(item_id: int, payload: DepartmentUpdate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(DepartmentRepository(db)).update(item_id, payload)


@router.delete("/departments/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(item_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    CrudService(DepartmentRepository(db)).delete(item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/courses", response_model=list[CourseResponse])
def list_courses(_: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(CourseRepository(db)).list()


@router.get("/courses/{item_id}", response_model=CourseResponse)
def get_course(item_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(CourseRepository(db)).get(item_id)


@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(CourseRepository(db)).create(payload)


@router.put("/courses/{item_id}", response_model=CourseResponse)
def update_course(item_id: int, payload: CourseUpdate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(CourseRepository(db)).update(item_id, payload)


@router.delete("/courses/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(item_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    CrudService(CourseRepository(db)).delete(item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/subjects", response_model=list[SubjectResponse])
def list_subjects(_: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(SubjectRepository(db)).list()


@router.get("/subjects/{item_id}", response_model=SubjectResponse)
def get_subject(item_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(SubjectRepository(db)).get(item_id)


@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(payload: SubjectCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(SubjectRepository(db)).create(payload)


@router.put("/subjects/{item_id}", response_model=SubjectResponse)
def update_subject(item_id: int, payload: SubjectUpdate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(SubjectRepository(db)).update(item_id, payload)


@router.delete("/subjects/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(item_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    CrudService(SubjectRepository(db)).delete(item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
