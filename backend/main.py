from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json

app = FastAPI()

agent_events = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "LMSGuard Backend Running"}


@app.get("/api/agent-events")
def get_agent_events():
    safe_events = []

    for event in agent_events[-50:]:
        safe_event = event.copy()

        if "image" in safe_event:
            safe_event["image"] = f"<base64 image hidden, size={len(event.get('image', ''))}>"

        safe_events.append(safe_event)

    return safe_events

@app.get("/api/latest-screenshot")
def get_latest_screenshot():
    for event in reversed(agent_events):
        if event.get("type") == "SCREEN_CAPTURE":
            return event

    return {"message": "No screenshot found"}

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

            safe_event = event.copy()

            if "image" in safe_event:
                safe_event["image"] = f"<base64 image hidden, size={len(event.get('image', ''))}>"

            print("[BACKEND] Agent event received:", safe_event)

            await websocket.send_json({
                "status": "received",
                "type": event.get("type", "UNKNOWN")
            })

    except WebSocketDisconnect:
        print("[BACKEND] Student agent disconnected")