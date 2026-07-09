from datetime import datetime, timezone

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, error: str | None = None):
        self.message = message
        self.status_code = status_code
        self.error = error or message


def error_payload(message: str, error: str | None = None) -> dict[str, object]:
    return {
        "success": False,
        "message": message,
        "error": error or message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload(exc.message, exc.error),
    )


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_payload("Request validation failed.", str(exc)),
    )


async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_payload("Internal server error.", exc.__class__.__name__),
    )
