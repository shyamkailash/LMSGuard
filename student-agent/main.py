"""
LMSGuard — Student Agent

Monitors the student's machine during an exam and sends events to the backend
over a plain WebSocket connection.

Run:
    cd student-agent
    python main.py

Environment variable (optional):
    AGENT_WS_URL=ws://127.0.0.1:8000/ws/student-agent
    STUDENT_ID=student-001
    CAPTURE_INTERVAL=5          # seconds between screen captures
    IDLE_THRESHOLD=60           # seconds before idle is reported
"""
import base64
import json
import os
import signal
import sys
import time

from app_detector import check_app
from idle_detector import get_idle_time, is_idle
from screen_capture import capture_screen
from websocket_client import AgentWebSocketClient
from window_detector import get_active_window

# ── Config ────────────────────────────────────────────────────────────────────
STUDENT_ID       = os.getenv("STUDENT_ID", "student-001")
CAPTURE_INTERVAL = int(os.getenv("CAPTURE_INTERVAL", "5"))
IDLE_THRESHOLD   = int(os.getenv("IDLE_THRESHOLD", "60"))

# ── WebSocket client ──────────────────────────────────────────────────────────
client = AgentWebSocketClient()

# ── Graceful shutdown ─────────────────────────────────────────────────────────
_running = True


def _shutdown(signum, frame):
    global _running
    print("\n[AGENT] Shutting down…")
    _running = False
    try:
        client.close()
    except Exception:
        pass
    sys.exit(0)


signal.signal(signal.SIGINT,  _shutdown)
signal.signal(signal.SIGTERM, _shutdown)


def send(event: dict) -> None:
    """Attach student_id and send JSON event to backend."""
    event["student_id"] = STUDENT_ID
    payload = json.dumps(event)
    ok = client.send(payload)
    if not ok:
        print("[AGENT] Failed to send event:", event.get("type"))


# ── Main loop ─────────────────────────────────────────────────────────────────

def main() -> None:
    print(f"[AGENT] Starting — student_id={STUDENT_ID}, interval={CAPTURE_INTERVAL}s")
    client.connect()

    while _running:
        # 1. Active window / unauthorized-app detection
        window    = get_active_window()
        app_event = check_app(window)
        if app_event:
            print(f"[AGENT] Unauthorized app: {app_event.get('app')}")
            send(app_event)

        # 2. Idle detection
        if is_idle(IDLE_THRESHOLD):
            idle_event = {
                "type":      "IDLE_DETECTED",
                "idle_time": get_idle_time(),
            }
            print(f"[AGENT] Idle detected ({idle_event['idle_time']}s)")
            send(idle_event)

        # 3. Screen capture
        try:
            image_bytes = capture_screen()
            capture_event = {
                "type":  "SCREEN_CAPTURE",
                "image": base64.b64encode(image_bytes).decode("utf-8"),
            }
            send(capture_event)
            print("[AGENT] Screen frame sent")
        except Exception as e:
            print(f"[AGENT] Screen capture error: {e}")

        time.sleep(CAPTURE_INTERVAL)


if __name__ == "__main__":
    main()
