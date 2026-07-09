"""
LMSGuard — FastAPI application entry point.

Run:
    cd backend
    python -m uvicorn main:app --reload
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.auth import create_access_token, decode_token
from app.database import engine, get_db, SessionLocal

# ── Legacy raw-sqlite helpers (monitoring events / security controls) ──────────
from database import (
    get_dashboard_summary,
    get_live_alerts as _db_get_live_alerts,
    get_monitoring_events,
    init_db,
    save_live_alert,
    save_monitoring_event,
    seed_demo_data,
)
from security_controls import (
    get_all_security_controls,
    get_security_control,
    init_security_controls,
    update_security_control,
)
from live_monitoring_agent import LiveMonitoringAgent

# ── Bootstrap ─────────────────────────────────────────────────────────────────

# Create all SQLAlchemy ORM tables (users, departments, classes, exams …)
models.Base.metadata.create_all(bind=engine)

# Create legacy sqlite3 tables (monitoring_events, live_alerts,
# exam_security_controls) and seed demo monitoring data
init_db()
seed_demo_data()
init_security_controls()

# Seed ORM demo data (users, academic structure) if DB is empty
with SessionLocal() as _seed_db:
    crud.seed_if_empty(_seed_db)

# ── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="LMSGuard API",
    description="AI-Based Examination Monitoring System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory state ───────────────────────────────────────────────────────────
agent_events:      list[dict[str, Any]] = []
live_alerts_cache: list[dict[str, Any]] = []
live_monitoring_agent = LiveMonitoringAgent()

# ── Auth helpers ──────────────────────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user_optional(token: str = Depends(oauth2_scheme)) -> dict | None:
    """Returns decoded token payload or None (does NOT raise)."""
    if not token:
        return None
    return decode_token(token)


def require_auth(payload: dict | None = Depends(get_current_user_optional)) -> dict:
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def require_role(*roles: str):
    def _checker(payload: dict = Depends(require_auth)) -> dict:
        if payload.get("role") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {list(roles)}",
            )
        return payload
    return _checker


# ── Utilities ─────────────────────────────────────────────────────────────────

def _sanitize(event: dict[str, Any]) -> dict[str, Any]:
    safe = event.copy()
    if "image" in safe:
        safe["image"] = f"<base64 image hidden, size={len(event.get('image', ''))}>"
    return safe


# ── Health / Root ─────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {
        "message":  "Backend Connected Successfully",
        "service":  "LMSGuard API",
        "version":  "1.0.0",
        "database": "SQLite connected",
        "status":   "running",
    }


# ── Authentication ────────────────────────────────────────────────────────────

@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT.

    Body::

        { "identifier": "admin@lmsguard.edu", "password": "admin123", "role": "admin" }
    """
    user = crud.authenticate_user(db, payload.role, payload.identifier, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or role",
        )
    token = create_access_token({
        "sub":  str(user.id),
        "role": user.role,
        "name": user.full_name,
    })
    return schemas.TokenResponse(
        access_token = token,
        role         = user.role,
        full_name    = user.full_name,
        identifier   = user.identifier,
        user_id      = user.id,
    )


@app.post("/api/auth/logout")
def logout(_: dict = Depends(require_auth)):
    """
    Stateless logout — client drops the token.
    This endpoint is provided so the client can signal intent.
    """
    return {"message": "Logged out successfully"}


@app.get("/api/auth/me", response_model=schemas.UserOut)
def me(payload: dict = Depends(require_auth), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── Users / Admin ─────────────────────────────────────────────────────────────

@app.get("/api/admin/users", response_model=list[schemas.UserOut])
def list_users(
    role: str | None = None,
    _: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    if role:
        return crud.get_users_by_role(db, role)
    return crud.get_all_users(db)


@app.post("/api/admin/users", response_model=schemas.UserOut, status_code=201)
def create_user(
    data: schemas.UserCreate,
    _: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    existing = crud.get_user_by_identifier(db, data.identifier)
    if existing:
        raise HTTPException(status_code=409, detail="Identifier already registered")
    return crud.create_user(db, data)


# ── Dashboard ─────────────────────────────────────────────────────────────────

@app.get("/api/dashboard-summary")
def dashboard_summary(_: dict = Depends(require_auth)):
    return get_dashboard_summary()


# ── Students ─────────────────────────────────────────────────────────────────

@app.get("/api/students", response_model=list[schemas.StudentOut])
def list_students(
    _: dict = Depends(require_role("admin", "invigilator")),
    db: Session = Depends(get_db),
):
    return crud.get_all_students(db)


# ── Departments ───────────────────────────────────────────────────────────────

@app.get("/api/departments", response_model=list[schemas.DepartmentOut])
def list_departments(
    _: dict = Depends(require_role("admin", "invigilator")),
    db: Session = Depends(get_db),
):
    return crud.get_all_departments(db)


# ── Classes ───────────────────────────────────────────────────────────────────

@app.get("/api/classes", response_model=list[schemas.ClassOut])
def list_classes(
    _: dict = Depends(require_role("admin", "invigilator")),
    db: Session = Depends(get_db),
):
    return crud.get_all_classes(db)


# ── Exams ─────────────────────────────────────────────────────────────────────

@app.get("/api/exams", response_model=list[schemas.ExamOut])
def list_exams(
    _: dict = Depends(require_role("admin", "invigilator")),
    db: Session = Depends(get_db),
):
    return crud.get_all_exams(db)


# ── Monitoring events ─────────────────────────────────────────────────────────

@app.get("/api/agent-events")
def get_agent_events(_: dict = Depends(require_auth)):
    return get_monitoring_events(limit=50)


@app.get("/api/live-alerts")
def get_live_alerts(_: dict = Depends(require_auth)):
    return _db_get_live_alerts(limit=50)


@app.get("/api/latest-screenshot")
def get_latest_screenshot(_: dict = Depends(require_auth)):
    for event in reversed(agent_events):
        if event.get("type") == "SCREEN_CAPTURE":
            return _sanitize(event)
    return {"message": "No screenshot found"}


# ── Security Controls ─────────────────────────────────────────────────────────

@app.get("/api/admin/security-controls")
def admin_get_security_controls(_: dict = Depends(require_role("admin", "invigilator"))):
    return get_all_security_controls()


@app.post("/api/admin/security-controls")
def admin_update_security_control(
    data: schemas.SecurityControlUpdate,
    _: dict = Depends(require_role("admin", "invigilator")),
):
    return update_security_control(data.model_dump(exclude_none=True))


@app.get("/api/student/security-control/{student_id}")
def student_get_security_control(
    student_id: str,
    _: dict = Depends(require_auth),
):
    return get_security_control(student_id)


# ── Invigilators ─────────────────────────────────────────────────────────────

@app.get("/api/invigilators", response_model=list[schemas.UserOut])
def list_invigilators(
    _: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return crud.get_users_by_role(db, "invigilator")


# ── Reports ───────────────────────────────────────────────────────────────────

@app.get("/api/reports/summary")
def reports_summary(_: dict = Depends(require_role("admin", "invigilator"))):
    """Aggregate monitoring stats used by the Reports page."""
    summary = get_dashboard_summary()
    alerts  = _db_get_live_alerts(limit=1000)
    high    = sum(1 for a in alerts if a.get("risk") == "HIGH")
    return {
        **summary,
        "high_risk_violations": high,
        "medium_risk_violations": len(alerts) - high,
    }


# ── WebSocket — Student Agent ─────────────────────────────────────────────────

@app.websocket("/ws/student-agent")
async def student_agent_ws(websocket: WebSocket):
    await websocket.accept()
    print("[WS] Student agent connected")

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                event = json.loads(raw)
            except json.JSONDecodeError:
                print("[WS] Invalid JSON received")
                continue

            event["timestamp"]  = event.get("timestamp") or datetime.now().isoformat()
            event.setdefault("student_id", "student-001")

            # Fix event-type mismatch: agent sends IDLE_DETECTED; agent uses IDLE_STATUS
            if event.get("type") == "IDLE_DETECTED":
                event["type"] = "IDLE_STATUS"

            agent_events.append(event)

            event_id = save_monitoring_event(event)

            alert            = live_monitoring_agent.process_event(event)
            alert["event_id"] = event_id
            live_alerts_cache.append(alert)
            save_live_alert(alert)

            print("[WS] Event:", _sanitize(event).get("type"), "| student:", event.get("student_id"))

            await websocket.send_json({
                "status":   "received",
                "type":     event.get("type", "UNKNOWN"),
                "event_id": event_id,
            })

    except WebSocketDisconnect:
        print("[WS] Student agent disconnected")
