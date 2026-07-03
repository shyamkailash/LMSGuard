import json
from datetime import datetime
from live_monitoring_agent import LiveMonitoringAgent
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

agent_events = []
live_monitoring_agent = LiveMonitoringAgent()
live_alerts = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Next.js frontend
        "http://localhost:5173",   # Vite frontend
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
    return {"message": "Backend Connected Successfully"}


@app.get("/api/agent-events")
def get_agent_events():
    return [sanitize_event(event) for event in agent_events[-50:]]


@app.get("/api/latest-screenshot")
def get_latest_screenshot():
    for event in reversed(agent_events):
        if event.get("type") == "SCREEN_CAPTURE":
            return event

    return {"message": "No screenshot found"}
@app.get("/api/live-alerts")
def get_live_alerts():
    return live_alerts[-50:]

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
            alert = live_monitoring_agent.process_event(event)
            live_alerts.append(alert)

            print("[BACKEND] Agent event received:", sanitize_event(event))

            await websocket.send_json({
                "status": "received",
                "type": event.get("type", "UNKNOWN")
            })

    except WebSocketDisconnect:
        print("[BACKEND] Student agent disconnected")
