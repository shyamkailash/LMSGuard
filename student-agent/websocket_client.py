
import websocket
import json
import os


class AgentWebSocketClient:

    def __init__(self):
        self.url = os.getenv(
            "AGENT_WS_URL",
            "ws://127.0.0.1:8000/ws/student-agent"
        )

        self.ws = None


    def connect(self):
        self.ws = websocket.create_connection(self.url)
        print("[WS] Connected")


    def send(self, data):
        if self.ws:
            self.ws.send(json.dumps(data))
