import json
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware

try:
    from .security_controls import (
        init_security_controls,
        get_all_security_controls,
        get_security_control,
        update_security_control,
    )
    from .auth_users import (
        init_user_table,
        create_user,
        create_student_user,
        authenticate_user,
        get_all_users,
        get_users_by_role,
        get_students,
        reset_student_password,
        set_user_active_status,
    )
    from .database import (
        get_dashboard_summary,
        get_live_alerts as get_live_alerts_from_db,
        get_monitoring_events,
        init_db,
        save_live_alert,
        save_monitoring_event,
        seed_demo_data,
    )
    from .live_monitoring_agent import LiveMonitoringAgent
except ImportError:
    from security_controls import (
        init_security_controls,
        get_all_security_controls,
        get_security_control,
        update_security_control,
    )
    from auth_users import (
        init_user_table,
        create_user,
        create_student_user,
        authenticate_user,
        get_all_users,
        get_users_by_role,
        get_students,
        reset_student_password,
        set_user_active_status,
    )
    from database import (
        get_dashboard_summary,
        get_live_alerts as get_live_alerts_from_db,
        get_monitoring_events,
        init_db,
        save_live_alert,
        save_monitoring_event,
        seed_demo_data,
    )
    from live_monitoring_agent import LiveMonitoringAgent


app = FastAPI()

init_db()
seed_demo_data()
init_security_controls()
init_user_table()   # Create users table if not exists
agent_events = []
live_monitoring_agent = LiveMonitoringAgent()
live_alerts = []

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


def sanitize_event(event: dict) -> dict:
    safe_event = event.copy()

    if "image" in safe_event:
        safe_event["image"] = f"<base64 image hidden, size={len(event.get('image', ''))}>"

    return safe_event


@app.get("/")
def home():
    return {
        "message": "Backend Connected Successfully",
        "database": "SQLite connected",
    }


@app.get("/api/dashboard-summary")
def dashboard_summary():
    return get_dashboard_summary()


@app.get("/api/agent-events")
def get_agent_events():
    return get_monitoring_events(limit=50)

@app.get("/api/admin/security-controls")
def admin_security_controls():
    return get_all_security_controls()


@app.post("/api/admin/security-controls")
async def update_admin_security_control(payload: dict):
    return update_security_control(payload)


@app.get("/api/student/security-control/{student_id}")
def student_security_control(student_id: str):
    return get_security_control(student_id)


# ── Auth endpoints ──────────────────────────────────────────────────────────

@app.post("/api/auth/register", status_code=201)
async def register_user(payload: dict):
    """Create a new user account.

    Expects JSON:
        role, full_name, identifier, password
        (optional) email, roll_number, department, class_name
    """
    try:
        user = create_user(payload)
        return {"success": True, "user": user}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/auth/login")
async def login_user(payload: dict):
    """Authenticate a user.

    Expects JSON: role, identifier, password
    Returns user data (no password_hash) on success, 401 on failure.
    """
    role       = payload.get("role", "")
    identifier = payload.get("identifier", "")
    password   = payload.get("password", "")

    user = authenticate_user(role, identifier, password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    return {"success": True, "user": user}


@app.get("/api/admin/users")
def list_all_users():
    """Return all registered users (no password_hash)."""
    return {"users": get_all_users()}


@app.get("/api/admin/users/{role}")
def list_users_by_role(role: str):
    """Return users filtered by role (no password_hash)."""
    return {"role": role, "users": get_users_by_role(role)}


# ── Student management endpoints (admin/teacher only) ──────────────────────

@app.post("/api/users/students/create", status_code=201)
async def api_create_student(payload: dict):
    """Create a student account.  Only admin/teacher may call this.

    Expects JSON: full_name, roll_number, password,
        (optional) department, class_name,
        created_by, created_by_role
    """
    created_by_role = (payload.get("created_by_role") or "").strip().lower()
    created_by      = payload.get("created_by") or ""

    try:
        student = create_student_user(payload, created_by_role, created_by)
        return {
            "success": True,
            "message": "Student account created successfully",
            "student": student,
        }
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/users/students")
def api_list_students():
    """Return all student users (no password_hash)."""
    return {"students": get_students()}


@app.post("/api/users/students/reset-password")
async def api_reset_student_password(payload: dict):
    """Reset a student's password.  Only admin/teacher may call this."""
    updated_by_role = (payload.get("updated_by_role") or "").strip().lower()
    if updated_by_role == "student":
        raise HTTPException(status_code=403, detail="Students cannot reset other student passwords.")

    roll     = (payload.get("roll_number") or "").strip()
    new_pass = payload.get("new_password") or ""
    if not roll or not new_pass:
        raise HTTPException(status_code=400, detail="roll_number and new_password are required.")

    ok = reset_student_password(roll, new_pass)
    if not ok:
        raise HTTPException(status_code=404, detail=f"Student with roll number '{roll}' not found.")
    return {"success": True, "message": f"Password reset for {roll}."}


@app.post("/api/users/students/status")
async def api_set_student_status(payload: dict):
    """Activate or deactivate a student.  Only admin/teacher may call this."""
    updated_by_role = (payload.get("updated_by_role") or "").strip().lower()
    if updated_by_role == "student":
        raise HTTPException(status_code=403, detail="Students cannot change account status.")

    roll      = (payload.get("roll_number") or "").strip()
    is_active = payload.get("is_active")
    if not roll or is_active is None:
        raise HTTPException(status_code=400, detail="roll_number and is_active are required.")

    ok = set_user_active_status(roll, bool(is_active))
    if not ok:
        raise HTTPException(status_code=404, detail=f"Student with roll number '{roll}' not found.")
    status_label = "activated" if is_active else "deactivated"
    return {"success": True, "message": f"Student {roll} {status_label}."}


@app.get("/api/latest-screenshot")
def get_latest_screenshot():
    for event in reversed(agent_events):
        if event.get("type") == "SCREEN_CAPTURE":
            return event

    return {"message": "No screenshot found"}


@app.get("/api/live-alerts")
def get_live_alerts():
    return get_live_alerts_from_db(limit=50)


@app.websocket("/ws/student-agent")
async def student_agent_ws(websocket: WebSocket):
    await websocket.accept()
    print("[BACKEND] Student agent connected")

    try:
        while True:
            data = await websocket.receive_text()

            try:
                event = json.loads(data)
            except json.JSONDecodeError:
                print("[BACKEND] Invalid JSON:", data)
                continue

            event["timestamp"] = datetime.now().isoformat()

            if "student_id" not in event:
                event["student_id"] = "student-001"

            agent_events.append(event)

            event_id = save_monitoring_event(event)

            alert = live_monitoring_agent.process_event(event)
            alert["event_id"] = event_id

            live_alerts.append(alert)
            save_live_alert(alert)

            print("[BACKEND] Agent event received:", sanitize_event(event))

            await websocket.send_json(
                {
                    "status": "received",
                    "type": event.get("type", "UNKNOWN"),
                    "event_id": event_id,
                }
            )

    except WebSocketDisconnect:
        print("[BACKEND] Student agent disconnected")
