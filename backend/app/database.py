import json
import sqlite3
from datetime import datetime
from pathlib import Path


DB_PATH = Path(__file__).resolve().parents[1] / "risk_logs.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS risk_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            events TEXT NOT NULL,
            detected_events TEXT NOT NULL,
            total_risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            recommended_action TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def save_risk_log(student_id: str, events: list, result: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO risk_logs (
            student_id,
            events,
            detected_events,
            total_risk_score,
            risk_level,
            recommended_action,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        student_id,
        json.dumps(events),
        json.dumps(result["detected_events"]),
        result["total_risk_score"],
        result["risk_level"],
        result["recommended_action"],
        datetime.now().isoformat()
    ))

    conn.commit()
    log_id = cursor.lastrowid
    conn.close()

    return log_id


def get_risk_logs(limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, student_id, events, detected_events, total_risk_score,
               risk_level, recommended_action, created_at
        FROM risk_logs
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()
    conn.close()

    logs = []

    for row in rows:
        logs.append({
            "id": row[0],
            "student_id": row[1],
            "events": json.loads(row[2]),
            "detected_events": json.loads(row[3]),
            "total_risk_score": row[4],
            "risk_level": row[5],
            "recommended_action": row[6],
            "created_at": row[7],
        })

    return logs