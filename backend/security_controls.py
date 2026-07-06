import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "lmsguard.db"


DEFAULT_CONTROL = {
    "monitoring_enabled": True,
    "exam_locked": False,
    "screen_capture_enabled": True,
    "unauthorized_app_blocking": True,
    "clipboard_blocked": True,
    "tab_switch_blocked": True,
    "warning_message": "You are under active exam monitoring.",
}


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_security_controls():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS exam_security_controls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL UNIQUE,
                monitoring_enabled INTEGER NOT NULL DEFAULT 1,
                exam_locked INTEGER NOT NULL DEFAULT 0,
                screen_capture_enabled INTEGER NOT NULL DEFAULT 1,
                unauthorized_app_blocking INTEGER NOT NULL DEFAULT 1,
                clipboard_blocked INTEGER NOT NULL DEFAULT 1,
                tab_switch_blocked INTEGER NOT NULL DEFAULT 1,
                warning_message TEXT DEFAULT '',
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "student_id": row["student_id"],
        "monitoring_enabled": bool(row["monitoring_enabled"]),
        "exam_locked": bool(row["exam_locked"]),
        "screen_capture_enabled": bool(row["screen_capture_enabled"]),
        "unauthorized_app_blocking": bool(row["unauthorized_app_blocking"]),
        "clipboard_blocked": bool(row["clipboard_blocked"]),
        "tab_switch_blocked": bool(row["tab_switch_blocked"]),
        "warning_message": row["warning_message"],
        "updated_at": row["updated_at"],
    }


def _get_real_student_ids() -> list[str]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT DISTINCT student_id
            FROM monitoring_events
            WHERE student_id IS NOT NULL AND student_id != ''
            ORDER BY student_id
            """
        ).fetchall()

    student_ids = [row["student_id"] for row in rows]
    return student_ids or ["student-001"]


def get_security_control(student_id: str) -> dict[str, Any]:
    init_security_controls()

    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT * FROM exam_security_controls
            WHERE student_id = ?
            """,
            (student_id,),
        ).fetchone()

    if row:
        return _row_to_dict(row)

    return {
        "student_id": student_id,
        **DEFAULT_CONTROL,
        "updated_at": datetime.now().isoformat(),
    }


def get_all_security_controls() -> list[dict[str, Any]]:
    init_security_controls()

    student_ids = _get_real_student_ids()
    return [get_security_control(student_id) for student_id in student_ids]


def update_security_control(data: dict[str, Any]) -> dict[str, Any]:
    init_security_controls()

    student_id = data.get("student_id", "student-001")
    current = get_security_control(student_id)

    updated = {
        "student_id": student_id,
        "monitoring_enabled": bool(data.get("monitoring_enabled", current["monitoring_enabled"])),
        "exam_locked": bool(data.get("exam_locked", current["exam_locked"])),
        "screen_capture_enabled": bool(data.get("screen_capture_enabled", current["screen_capture_enabled"])),
        "unauthorized_app_blocking": bool(data.get("unauthorized_app_blocking", current["unauthorized_app_blocking"])),
        "clipboard_blocked": bool(data.get("clipboard_blocked", current["clipboard_blocked"])),
        "tab_switch_blocked": bool(data.get("tab_switch_blocked", current["tab_switch_blocked"])),
        "warning_message": data.get("warning_message", current["warning_message"]),
        "updated_at": datetime.now().isoformat(),
    }

    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO exam_security_controls (
                student_id,
                monitoring_enabled,
                exam_locked,
                screen_capture_enabled,
                unauthorized_app_blocking,
                clipboard_blocked,
                tab_switch_blocked,
                warning_message,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(student_id) DO UPDATE SET
                monitoring_enabled = excluded.monitoring_enabled,
                exam_locked = excluded.exam_locked,
                screen_capture_enabled = excluded.screen_capture_enabled,
                unauthorized_app_blocking = excluded.unauthorized_app_blocking,
                clipboard_blocked = excluded.clipboard_blocked,
                tab_switch_blocked = excluded.tab_switch_blocked,
                warning_message = excluded.warning_message,
                updated_at = excluded.updated_at
            """,
            (
                updated["student_id"],
                int(updated["monitoring_enabled"]),
                int(updated["exam_locked"]),
                int(updated["screen_capture_enabled"]),
                int(updated["unauthorized_app_blocking"]),
                int(updated["clipboard_blocked"]),
                int(updated["tab_switch_blocked"]),
                updated["warning_message"],
                updated["updated_at"],
            ),
        )
        conn.commit()

    return updated
