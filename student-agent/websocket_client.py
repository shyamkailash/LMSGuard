import json
import os
import time
import websocket


class WebSocketClient:
    def __init__(self, url=None, reconnect_delay=3):
        self.url = url or os.getenv(
            "AGENT_WS_URL",
            "ws://127.0.0.1:8000/ws/student-agent"
        )
        self.reconnect_delay = reconnect_delay
        self.ws = None

    def connect(self):
        while True:
            try:
                self.ws = websocket.create_connection(self.url, timeout=10)
                print("[WS] Connected")
                return True
            except Exception as e:
                print(f"[WS] Connection failed: {e}. Retrying in {self.reconnect_delay}s")
                time.sleep(self.reconnect_delay)

    def send(self, data):
        if self.ws is None:
            self.connect()

        try:
            self.ws.send(json.dumps(data))
            return True

        except (
            BrokenPipeError,
            ConnectionResetError,
            websocket.WebSocketConnectionClosedException,
            websocket.WebSocketException,
            OSError,
        ) as e:
            print(f"[WS] Send failed: {e}")
            print("[WS] Reconnecting...")

            try:
                if self.ws:
                    self.ws.close()
            except Exception:
                pass

            self.ws = None
            self.connect()

            try:
                self.ws.send(json.dumps(data))
                return True
            except Exception as retry_error:
                print(f"[WS] Retry send failed: {retry_error}")
                return False

    def close(self):
        try:
            if self.ws:
                self.ws.close()
        except Exception:
            pass

# Alias for main.py compatibility
AgentWebSocketClient = WebSocketClient
