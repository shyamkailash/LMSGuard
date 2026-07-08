"""
LMSGuard exam access controls.

Stores invigilator-generated start passwords and student exam session state in
SQLite so the student exam page can block access until the correct password is
entered.
"""

from __future__ import annotations

import secrets
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

try:
    from .database import save_live_alert
except ImportError:
    from database import save_live_alert


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "lmsguard.db"
DEFAULT_EXPIRY_MINUTES = 30
ALLOWED_GENERATORS = {"admin", "teacher", "invigilator"}
SESSION_STATUSES = {"WAITING", "IN_EXAM", "COMPLETED", "BLOCKED"}


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_exam_access_tables() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS exam_start_passwords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exam_id TEXT NOT NULL,
                class_id TEXT,
                start_password TEXT NOT NULL,
                created_by TEXT NOT NULL,
                created_by_role TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                expires_at TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS student_exam_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                exam_id TEXT NOT NULL,
                status TEXT NOT NULL,
                started_at TEXT,
                completed_at TEXT,
                start_password_verified INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def _now() -> datetime:
    return datetime.utcnow()


def _now_iso() -> str:
    return _now().isoformat()


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def _generate_password() -> str:
    return f"EXAM-{secrets.randbelow(1_000_000):06d}"


def _row_to_password_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "exam_id": row["exam_id"],
        "class_id": row["class_id"],
        "start_password": row["start_password"],
        "created_by": row["created_by"],
        "created_by_role": row["created_by_role"],
        "is_active": bool(row["is_active"]),
        "expires_at": row["expires_at"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def _row_to_session_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "student_id": row["student_id"],
        "exam_id": row["exam_id"],
        "status": row["status"],
        "started_at": row["started_at"],
        "completed_at": row["completed_at"],
        "start_password_verified": bool(row["start_password_verified"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def _deactivate_passwords(exam_id: str) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            UPDATE exam_start_passwords
            SET is_active = 0, updated_at = ?
            WHERE exam_id = ? AND is_active = 1
            """,
            (_now_iso(), exam_id),
        )
        conn.commit()


def generate_start_password(
    exam_id: str,
    class_id: str | None,
    created_by: str,
    created_by_role: str,
    expiry_minutes: int | None = DEFAULT_EXPIRY_MINUTES,
) -> dict[str, Any]:
    exam_id = (exam_id or "").strip()
    created_by = (created_by or "").strip()
    created_by_role = (created_by_role or "").strip().lower()

    if not exam_id:
        raise ValueError("exam_id is required.")
    if not created_by:
        raise ValueError("created_by is required.")
    if created_by_role not in ALLOWED_GENERATORS:
        raise PermissionError("Only admin, teacher, or invigilator can generate start passwords.")

    try:
        minutes = int(expiry_minutes) if expiry_minutes is not None else DEFAULT_EXPIRY_MINUTES
    except (TypeError, ValueError):
        minutes = DEFAULT_EXPIRY_MINUTES
    if minutes <= 0:
        minutes = DEFAULT_EXPIRY_MINUTES

    now = _now()
    expires_at = (now + timedelta(minutes=minutes)).isoformat()
    start_password = _generate_password()

    _deactivate_passwords(exam_id)

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO exam_start_passwords (
                exam_id,
                class_id,
                start_password,
                created_by,
                created_by_role,
                is_active,
                expires_at,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
            """,
            (
                exam_id,
                class_id or None,
                start_password,
                created_by,
                created_by_role,
                expires_at,
                now.isoformat(),
                now.isoformat(),
            ),
        )
        conn.commit()
        password_id = int(cursor.lastrowid)

    return {
        "id": password_id,
        "exam_id": exam_id,
        "class_id": class_id,
        "start_password": start_password,
        "created_by": created_by,
        "created_by_role": created_by_role,
        "is_active": True,
        "expires_at": expires_at,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    }


def _fetch_active_row(exam_id: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT *
            FROM exam_start_passwords
            WHERE exam_id = ? AND is_active = 1
            ORDER BY id DESC
            LIMIT 1
            """,
            ((exam_id or "").strip(),),
        ).fetchone()
    return row


def get_active_start_password(exam_id: str) -> dict[str, Any] | None:
    init_exam_access_tables()
    row = _fetch_active_row(exam_id)
    if not row:
        return None

    expires_at = _parse_dt(row["expires_at"])
    if expires_at and expires_at <= _now():
        with get_connection() as conn:
            conn.execute(
                """
                UPDATE exam_start_passwords
                SET is_active = 0, updated_at = ?
                WHERE id = ?
                """,
                (_now_iso(), row["id"]),
            )
            conn.commit()
        return None

    return _row_to_password_dict(row)


def _get_session_row(student_id: str, exam_id: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT *
            FROM student_exam_sessions
            WHERE student_id = ? AND exam_id = ?
            ORDER BY id DESC
            LIMIT 1
            """,
            ((student_id or "").strip(), (exam_id or "").strip()),
        ).fetchone()


def _write_session(
    student_id: str,
    exam_id: str,
    status: str,
    *,
    started_at: str | None = None,
    completed_at: str | None = None,
    start_password_verified: bool = False,
) -> dict[str, Any]:
    init_exam_access_tables()

    if status not in SESSION_STATUSES:
        raise ValueError(f"Invalid session status '{status}'.")

    student_id = (student_id or "").strip()
    exam_id = (exam_id or "").strip()
    if not student_id:
        raise ValueError("student_id is required.")
    if not exam_id:
        raise ValueError("exam_id is required.")

    now = _now_iso()
    existing = _get_session_row(student_id, exam_id)

    payload = {
        "student_id": student_id,
        "exam_id": exam_id,
        "status": status,
        "started_at": started_at,
        "completed_at": completed_at,
        "start_password_verified": 1 if start_password_verified else 0,
        "created_at": now,
        "updated_at": now,
    }

    with get_connection() as conn:
        if existing:
            conn.execute(
                """
                UPDATE student_exam_sessions
                SET status = ?,
                    started_at = ?,
                    completed_at = ?,
                    start_password_verified = ?,
                    updated_at = ?
                WHERE id = ?
                """,
                (
                    payload["status"],
                    payload["started_at"],
                    payload["completed_at"],
                    payload["start_password_verified"],
                    payload["updated_at"],
                    int(existing["id"]),
                ),
            )
            conn.commit()
            row = conn.execute(
                "SELECT * FROM student_exam_sessions WHERE id = ?",
                (int(existing["id"]),),
            ).fetchone()
            return _row_to_session_dict(row)

        cursor = conn.execute(
            """
            INSERT INTO student_exam_sessions (
                student_id,
                exam_id,
                status,
                started_at,
                completed_at,
                start_password_verified,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["student_id"],
                payload["exam_id"],
                payload["status"],
                payload["started_at"],
                payload["completed_at"],
                payload["start_password_verified"],
                payload["created_at"],
                payload["updated_at"],
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM student_exam_sessions WHERE id = ?",
            (int(cursor.lastrowid),),
        ).fetchone()
        return _row_to_session_dict(row)


def _log_blocked_attempt(student_id: str, exam_id: str, reason: str) -> None:
    try:
        save_live_alert(
            {
                "student_id": student_id or "student-001",
                "exam_id": exam_id,
                "type": "START_PASSWORD_BLOCKED",
                "risk": "HIGH",
                "message": reason,
                "timestamp": _now_iso(),
            }
        )
    except Exception:
        pass


def verify_start_password(student_id: str, exam_id: str, password: str) -> dict[str, Any]:
    init_exam_access_tables()

    student_id = (student_id or "").strip()
    exam_id = (exam_id or "").strip()
    password = (password or "").strip()

    if not student_id:
        raise ValueError("student_id is required.")
    if not exam_id:
        raise ValueError("exam_id is required.")
    if not password:
        raise ValueError("password is required.")

    active_password = get_active_start_password(exam_id)
    if not active_password:
        _write_session(student_id, exam_id, "BLOCKED", start_password_verified=False)
        _log_blocked_attempt(student_id, exam_id, "Invalid or expired start password")
        return {
            "success": False,
            "status": "BLOCKED",
            "message": "Invalid or expired start password",
        }

    expires_at = _parse_dt(active_password.get("expires_at"))
    if expires_at and expires_at <= _now():
        _write_session(student_id, exam_id, "BLOCKED", start_password_verified=False)
        _log_blocked_attempt(student_id, exam_id, "Start password expired")
        return {
            "success": False,
            "status": "BLOCKED",
            "message": "Invalid or expired start password",
        }

    if password != active_password["start_password"]:
        _write_session(student_id, exam_id, "BLOCKED", start_password_verified=False)
        _log_blocked_attempt(student_id, exam_id, "Incorrect start password entered")
        return {
            "success": False,
            "status": "BLOCKED",
            "message": "Invalid or expired start password",
        }

    session = _write_session(
        student_id,
        exam_id,
        "IN_EXAM",
        started_at=_now_iso(),
        completed_at=None,
        start_password_verified=True,
    )
    return {
        "success": True,
        "status": "IN_EXAM",
        "message": "Exam started successfully",
        "session": session,
    }


def get_student_exam_status(student_id: str, exam_id: str) -> dict[str, Any]:
    init_exam_access_tables()
    row = _get_session_row(student_id, exam_id)
    if not row:
        return {
            "student_id": (student_id or "").strip(),
            "exam_id": (exam_id or "").strip(),
            "status": "WAITING",
            "start_password_verified": False,
        }

    return _row_to_session_dict(row)
