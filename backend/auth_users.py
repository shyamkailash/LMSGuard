"""
LMSGuard — User Authentication Module
Handles user creation, authentication, and retrieval.
Passwords are hashed using hashlib.pbkdf2_hmac (stdlib — no extra deps).
"""

import hashlib
import hmac
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "lmsguard.db"

VALID_ROLES = {"student", "teacher", "admin"}

# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------

def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_user_table() -> None:
    """Create the users table if it does not already exist.

    Also migrates older schemas that lack created_by / created_by_role.
    """
    with _get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                role            TEXT    NOT NULL,
                full_name       TEXT    NOT NULL,
                identifier      TEXT    NOT NULL UNIQUE,
                email           TEXT,
                roll_number     TEXT,
                department      TEXT,
                class_name      TEXT,
                password_hash   TEXT    NOT NULL,
                is_active       INTEGER NOT NULL DEFAULT 1,
                created_by      TEXT,
                created_by_role TEXT,
                created_at      TEXT    NOT NULL,
                updated_at      TEXT    NOT NULL
            )
            """
        )

        # Safe migration: add columns if they don't exist yet (pre-existing DB)
        existing_cols = {
            row[1] for row in conn.execute("PRAGMA table_info(users)").fetchall()
        }
        if "created_by" not in existing_cols:
            conn.execute("ALTER TABLE users ADD COLUMN created_by TEXT")
        if "created_by_role" not in existing_cols:
            conn.execute("ALTER TABLE users ADD COLUMN created_by_role TEXT")

        conn.commit()


# ---------------------------------------------------------------------------
# Password helpers
# ---------------------------------------------------------------------------

def _hash_password(plain: str) -> str:
    """Return a salt-prefixed PBKDF2-HMAC-SHA256 hash of *plain*.

    Format stored:  ``<16-byte-hex-salt>:<64-byte-hex-digest>``
    """
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", plain.encode("utf-8"), salt, 260_000)
    return f"{salt.hex()}:{dk.hex()}"


def _verify_password(plain: str, stored_hash: str) -> bool:
    """Verify *plain* against a stored hash produced by :func:`_hash_password`."""
    try:
        salt_hex, dk_hex = stored_hash.split(":", 1)
        salt      = bytes.fromhex(salt_hex)
        dk_stored = bytes.fromhex(dk_hex)
        candidate = hashlib.pbkdf2_hmac("sha256", plain.encode("utf-8"), salt, 260_000)
        # constant-time comparison (hmac.compare_digest is the correct stdlib location)
        return hmac.compare_digest(candidate, dk_stored)
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Row builder (never returns password_hash)
# ---------------------------------------------------------------------------

_USER_COLS = (
    "id", "role", "full_name", "identifier", "email",
    "roll_number", "department", "class_name",
    "is_active", "created_by", "created_by_role",
    "created_at", "updated_at",
)

_USER_SELECT = ", ".join(_USER_COLS)


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {col: row[col] for col in _USER_COLS}


# ---------------------------------------------------------------------------
# Public functions
# ---------------------------------------------------------------------------

def create_user(data: dict[str, Any]) -> dict[str, Any]:
    """Insert a new user (any role).

    Required keys in *data*:
        role, full_name, identifier, password

    Optional keys:
        email, roll_number, department, class_name,
        created_by, created_by_role

    Returns the created user row (without password_hash).

    Raises:
        ValueError — on invalid role, empty fields, or duplicate identifier.
    """
    role        = (data.get("role") or "").strip().lower()
    full_name   = (data.get("full_name") or "").strip()
    identifier  = (data.get("identifier") or "").strip()
    password    = data.get("password") or ""

    if role not in VALID_ROLES:
        raise ValueError(f"Invalid role '{role}'. Must be one of: {sorted(VALID_ROLES)}.")
    if not full_name:
        raise ValueError("full_name is required.")
    if not identifier:
        raise ValueError("identifier is required.")
    if not password:
        raise ValueError("password is required.")

    password_hash = _hash_password(password)
    now = datetime.utcnow().isoformat()

    try:
        with _get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO users
                    (role, full_name, identifier, email, roll_number,
                     department, class_name, password_hash, is_active,
                     created_by, created_by_role,
                     created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
                """,
                (
                    role,
                    full_name,
                    identifier,
                    data.get("email") or None,
                    data.get("roll_number") or None,
                    data.get("department") or None,
                    data.get("class_name") or None,
                    password_hash,
                    data.get("created_by") or None,
                    data.get("created_by_role") or None,
                    now,
                    now,
                ),
            )
            conn.commit()
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise ValueError(f"Identifier '{identifier}' is already registered.")

    return {
        "id":              user_id,
        "role":            role,
        "full_name":       full_name,
        "identifier":      identifier,
        "email":           data.get("email") or None,
        "roll_number":     data.get("roll_number") or None,
        "department":      data.get("department") or None,
        "class_name":      data.get("class_name") or None,
        "is_active":       1,
        "created_by":      data.get("created_by") or None,
        "created_by_role": data.get("created_by_role") or None,
        "created_at":      now,
        "updated_at":      now,
    }


def create_student_user(
    data: dict[str, Any],
    created_by_role: str,
    created_by: str,
) -> dict[str, Any]:
    """Create a student account.  Only admin/teacher may call this.

    Required keys in *data*:
        full_name, roll_number, password

    Optional keys:
        department, class_name

    Raises:
        PermissionError — if created_by_role is student.
        ValueError      — on missing fields or duplicate roll_number.
    """
    if (created_by_role or "").strip().lower() == "student":
        raise PermissionError("Students cannot create student accounts.")

    roll = (data.get("roll_number") or "").strip()
    if not roll:
        raise ValueError("roll_number is required.")

    return create_user({
        "role":            "student",
        "full_name":       data.get("full_name"),
        "identifier":      roll,
        "roll_number":     roll,
        "department":      data.get("department"),
        "class_name":      data.get("class_name"),
        "password":        data.get("password"),
        "created_by":      created_by,
        "created_by_role": created_by_role,
    })


def authenticate_user(role: str, identifier: str, password: str) -> dict[str, Any] | None:
    """Authenticate a user.

    Returns the user row (without password_hash) on success, or ``None`` on
    failure (wrong credentials / inactive account).
    """
    role       = (role or "").strip().lower()
    identifier = (identifier or "").strip()

    if role not in VALID_ROLES or not identifier or not password:
        return None

    with _get_connection() as conn:
        row = conn.execute(
            f"SELECT {_USER_SELECT}, password_hash FROM users "
            "WHERE role = ? AND identifier = ? AND is_active = 1",
            (role, identifier),
        ).fetchone()

    if row is None:
        return None

    if not _verify_password(password, row["password_hash"]):
        return None

    return _row_to_dict(row)


def get_all_users() -> list[dict[str, Any]]:
    """Return all users without password_hash."""
    with _get_connection() as conn:
        rows = conn.execute(
            f"SELECT {_USER_SELECT} FROM users ORDER BY id ASC"
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def get_users_by_role(role: str) -> list[dict[str, Any]]:
    """Return users filtered by role without password_hash."""
    role = (role or "").strip().lower()
    with _get_connection() as conn:
        rows = conn.execute(
            f"SELECT {_USER_SELECT} FROM users WHERE role = ? ORDER BY id ASC",
            (role,),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def get_students() -> list[dict[str, Any]]:
    """Return only student users without password_hash."""
    return get_users_by_role("student")


def reset_student_password(roll_number: str, new_password: str) -> bool:
    """Reset the password for a student identified by *roll_number*.

    Returns True on success, False if the student was not found.
    """
    roll_number = (roll_number or "").strip()
    if not roll_number or not new_password:
        return False

    new_hash = _hash_password(new_password)
    now = datetime.utcnow().isoformat()

    with _get_connection() as conn:
        cursor = conn.execute(
            "UPDATE users SET password_hash = ?, updated_at = ? "
            "WHERE role = 'student' AND identifier = ?",
            (new_hash, now, roll_number),
        )
        conn.commit()
        return cursor.rowcount > 0


def set_user_active_status(identifier: str, is_active: bool) -> bool:
    """Activate or deactivate a user by *identifier*.

    Returns True on success, False if the user was not found.
    """
    identifier = (identifier or "").strip()
    if not identifier:
        return False

    now = datetime.utcnow().isoformat()
    with _get_connection() as conn:
        cursor = conn.execute(
            "UPDATE users SET is_active = ?, updated_at = ? WHERE identifier = ?",
            (1 if is_active else 0, now, identifier),
        )
        conn.commit()
        return cursor.rowcount > 0
