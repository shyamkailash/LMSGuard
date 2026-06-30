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
