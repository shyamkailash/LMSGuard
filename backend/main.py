import json
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

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
