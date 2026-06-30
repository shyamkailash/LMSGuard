from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "LMSGuard Backend Running"}
@app.websocket("/ws/student-agent")
async def student_agent(websocket: WebSocket):

    await websocket.accept()

    print("Student agent connected")

    try:
        while True:

            data = await websocket.receive_json()

            print("Received:")
            print(data)


            await websocket.send_json({
                "status":"received"
            })


    except WebSocketDisconnect:

        print("Student agent disconnected")

from fastapi import WebSocket, WebSocketDisconnect
import json

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

            print("[BACKEND] Agent event received:", event)

            await websocket.send_json({
                "status": "received",
                "type": event.get("type", "UNKNOWN")
            })

    except WebSocketDisconnect:
        print("[BACKEND] Student agent disconnected")
