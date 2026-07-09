"""
LMSGuard — SQLAlchemy database configuration.

Uses an absolute path so the DB file is always created next to this package,
regardless of the working directory uvicorn is launched from.
"""
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Absolute path — prevents the CWD mismatch that caused two separate DB files.
_DB_PATH = Path(__file__).resolve().parent.parent / "lmsguard.db"
DATABASE_URL = f"sqlite:///{_DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
