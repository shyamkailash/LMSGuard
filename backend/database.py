import json
import sqlite3
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "lmsguard.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS monitoring_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                student_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS live_alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                student_id TEXT NOT NULL,
                alert_type TEXT NOT NULL,
                risk TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                payload TEXT NOT NULL
            )
            """
        )


def _table_count(conn: sqlite3.Connection, table_name: str) -> int:
    cursor = conn.execute(f"SELECT COUNT(*) AS count FROM {table_name}")
    row = cursor.fetchone()
    return int(row["count"]) if row else 0


def seed_demo_data() -> None:
    with get_connection() as conn:
        if _table_count(conn, "monitoring_events") > 0:
            return

        demo_event = {
            "type": "ACTIVE_WINDOW",
            "student_id": "student-001",
            "window_title": "LMSGuard Dashboard",
            "process_name": "browser",
            "timestamp": "2026-01-01T00:00:00",
        }
        demo_alert = {
            "student_id": "student-001",
            "type": "ACTIVE_WINDOW",
            "risk": "LOW",
            "message": "Demo event seeded",
            "timestamp": "2026-01-01T00:00:00",
            "evidence_screenshot": None,
            "evidence_video": None,
        }

        cursor = conn.execute(
            """
            INSERT INTO monitoring_events (event_type, student_id, timestamp, payload)
            VALUES (?, ?, ?, ?)
            """,
            (
                demo_event["type"],
                demo_event["student_id"],
                demo_event["timestamp"],
                json.dumps(demo_event),
            ),
        )
        event_id = int(cursor.lastrowid)

        demo_alert["event_id"] = event_id
        conn.execute(
            """
            INSERT INTO live_alerts (event_id, student_id, alert_type, risk, message, timestamp, payload)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                demo_alert["event_id"],
                demo_alert["student_id"],
                demo_alert["type"],
                demo_alert["risk"],
                demo_alert["message"],
                demo_alert["timestamp"],
                json.dumps(demo_alert),
            ),
        )
        conn.commit()


def _normalize_event(event: dict[str, Any]) -> dict[str, Any]:
    normalized = event.copy()
    normalized.setdefault("timestamp", "")
    normalized.setdefault("student_id", "student-001")
    normalized.setdefault("type", "UNKNOWN")
    return normalized


def save_monitoring_event(event: dict[str, Any]) -> int:
    normalized = _normalize_event(event)

    image_base64 = normalized.pop("image", None)
    image_size = len(image_base64) if image_base64 else 0

    if image_size > 0:
        normalized["image"] = f"<base64 image hidden, size={image_size}>"
        normalized["image_size"] = image_size

    payload = json.dumps(normalized)

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO monitoring_events (event_type, student_id, timestamp, payload)
            VALUES (?, ?, ?, ?)
            """,
            (
                normalized["type"],
                normalized["student_id"],
                normalized["timestamp"],
                payload,
            ),
        )
        conn.commit()
        return int(cursor.lastrowid)
def _sanitize_event(event: dict[str, Any]) -> dict[str, Any]:
    safe_event = event.copy()

    if "image" in safe_event:
        image_size = safe_event.get("image_size")

        if image_size:
            safe_event["image"] = f"<base64 image hidden, size={image_size}>"
        else:
            safe_event["image"] = f"<base64 image hidden, size={len(str(event.get('image', '')))}>"

    return safe_event

def get_monitoring_events(limit: int = 50) -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, payload
            FROM monitoring_events
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    events: list[dict[str, Any]] = []
    for row in reversed(rows):
        payload = json.loads(row["payload"])
        payload["event_id"] = row["id"]
        events.append(_sanitize_event(payload))

    return events


def get_dashboard_summary() -> dict[str, Any]:
    with get_connection() as conn:
        total_events = _table_count(conn, "monitoring_events")
        total_alerts = _table_count(conn, "live_alerts")
        high_risk_alerts = conn.execute(
            "SELECT COUNT(*) AS count FROM live_alerts WHERE risk = ?",
            ("HIGH",),
        ).fetchone()["count"]
        latest_event = conn.execute(
            """
            SELECT payload
            FROM monitoring_events
            ORDER BY id DESC
            LIMIT 1
            """
        ).fetchone()

    latest_payload = json.loads(latest_event["payload"]) if latest_event else None

    return {
        "database": "SQLite connected",
        "total_events": total_events,
        "total_live_alerts": total_alerts,
        "high_risk_alerts": int(high_risk_alerts),
        "latest_event": _sanitize_event(latest_payload) if latest_payload else None,
    }


def save_live_alert(alert: dict[str, Any]) -> int:
    payload = json.dumps(alert)

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO live_alerts (event_id, student_id, alert_type, risk, message, timestamp, payload)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                alert.get("event_id"),
                alert.get("student_id", "student-001"),
                alert.get("type", "UNKNOWN"),
                alert.get("risk", "NORMAL"),
                alert.get("message", ""),
                alert.get("timestamp", ""),
                payload,
            ),
        )
        conn.commit()
        return int(cursor.lastrowid)


def get_live_alerts(limit: int = 50) -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, payload
            FROM live_alerts
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    alerts: list[dict[str, Any]] = []
    for row in reversed(rows):
        payload = json.loads(row["payload"])
        payload["alert_id"] = row["id"]
        alerts.append(payload)

    return alerts
