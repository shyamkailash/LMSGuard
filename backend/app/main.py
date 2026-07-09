from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api import academic, admins, auth, dashboard, exams, faculty, health, platform, proctoring, reports, students, users
from app.core.config import settings
from app.core.exceptions import AppException, app_exception_handler, unhandled_exception_handler, validation_exception_handler
from app.core.logging import configure_logging
from app.database.base import Base, import_models
from app.database.session import engine
from app.middleware import AuthenticationContextMiddleware, RequestLoggingMiddleware


def create_app() -> FastAPI:
    configure_logging()
    import_models()

    if engine is not None:
        Base.metadata.create_all(bind=engine)

    app = FastAPI(title=settings.app_name, version=settings.version)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(AuthenticationContextMiddleware)
    app.add_middleware(RequestLoggingMiddleware)

    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    @app.get("/")
    def home() -> dict[str, str]:
        return {"message": "LMSGuard Backend Running"}

    for router in (
        health.router,
        auth.router,
        users.router,
        students.router,
        faculty.router,
        admins.router,
        academic.router,
        exams.router,
        dashboard.router,
        platform.router,
        reports.router,
        proctoring.router,
    ):
        app.include_router(router)
    return app


app = create_app()
