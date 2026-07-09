from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser
from app.database.session import get_db
from app.repositories.exam_repository import AttemptRepository, ExamRepository, QuestionRepository, ResultRepository, ViolationRepository
from app.schemas.exam import (
    AttemptCreate,
    AttemptResponse,
    ExamCreate,
    ExamResponse,
    ExamUpdate,
    QuestionCreate,
    QuestionResponse,
    ResultCreate,
    ResultResponse,
    ViolationCreate,
    ViolationResponse,
)
from app.services.crud_service import CrudService

router = APIRouter(tags=["Exams"])


@router.get("/exams", response_model=list[ExamResponse])
def list_exams(_: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(ExamRepository(db)).list()


@router.get("/exams/{exam_id}", response_model=ExamResponse)
def get_exam(exam_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(ExamRepository(db)).get(exam_id)


@router.post("/exams", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam(payload: ExamCreate, current_user: CurrentUser, db: Session = Depends(get_db)):
    data = payload.model_dump()
    data["status"] = data["status"].value
    data["created_by_id"] = current_user.id
    return ExamRepository(db).create(data)


@router.put("/exams/{exam_id}", response_model=ExamResponse)
def update_exam(exam_id: int, payload: ExamUpdate, _: CurrentUser, db: Session = Depends(get_db)):
    data = payload.model_dump(exclude_unset=True)
    if "status" in data and data["status"] is not None:
        data["status"] = data["status"].value
    exam_service = CrudService(ExamRepository(db))
    return exam_service.repository.update(exam_service.get(exam_id), data)


@router.delete("/exams/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(exam_id: int, _: CurrentUser, db: Session = Depends(get_db)):
    CrudService(ExamRepository(db)).delete(exam_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(payload: QuestionCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(QuestionRepository(db)).create(payload)


@router.post("/exam-attempts", response_model=AttemptResponse, status_code=status.HTTP_201_CREATED)
def create_attempt(payload: AttemptCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(AttemptRepository(db)).create(payload)


@router.post("/results", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(payload: ResultCreate, _: CurrentUser, db: Session = Depends(get_db)):
    data = payload.model_dump()
    data["percentage"] = (data["obtained_marks"] / data["total_marks"] * 100) if data["total_marks"] else 0
    return ResultRepository(db).create(data)


@router.get("/results", response_model=list[ResultResponse])
def list_results(_: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(ResultRepository(db)).list()


@router.post("/violations", response_model=ViolationResponse, status_code=status.HTTP_201_CREATED)
def create_violation(payload: ViolationCreate, _: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(ViolationRepository(db)).create(payload)


@router.get("/violations", response_model=list[ViolationResponse])
def list_violations(_: CurrentUser, db: Session = Depends(get_db)):
    return CrudService(ViolationRepository(db)).list()
