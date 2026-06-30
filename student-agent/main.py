"""
main.py
Runs the full student monitoring agent.

Start:
    python main.py

Environment variables:
    AGENT_WS_URL=ws://127.0.0.1:8000/ws/student-agent
    STUDENT_ID=student-001
    AGENT_TOKEN=optional-token
"""

from __future__ import annotations

import threading
import time

from app_detector import AppDetector
from idle_detector import monitor_idle
from screen_capture import ScreenCapture, ScreenCaptureConfig
from websocket_client import AgentWebSocketClient
from window_detector import get_active_window


def run_active_window_sender(ws_client: AgentWebSocketClient, interval_seconds: float = 5.0) -> None:
    last_app = None
    while True:
        try:
            window = get_active_window()
            if window.app != last_app:
                ws_client.send_event("ACTIVE_WINDOW", window.to_dict())
                last_app = window.app
        except Exception as exc:
            print(f"[ACTIVE_WINDOW] Error: {exc}")
        time.sleep(interval_seconds)


def main() -> None:
    ws_client = AgentWebSocketClient()

    app_detector = AppDetector(
        blacklist=["VS Code", "Discord", "Telegram", "WhatsApp", "Calculator"],
        alert_cooldown_seconds=15,
    )

    screen_capture = ScreenCapture(
        ScreenCaptureConfig(
            monitor_index=1,
            jpeg_quality=45,
            max_width=1280,
            interval_seconds=5.0,
        )
    )

    threads = [
        threading.Thread(target=screen_capture.run, args=(ws_client,), daemon=True),
        threading.Thread(
            target=app_detector.monitor,
            args=(lambda payload: ws_client.send_json(payload),),
            daemon=True,
        ),
        threading.Thread(
            target=monitor_idle,
            args=(lambda status: ws_client.send_event("IDLE_STATUS", status),),
            daemon=True,
        ),
        threading.Thread(
            target=run_active_window_sender,
            args=(ws_client,),
            daemon=True,
        ),
    ]

    for thread in threads:
        thread.start()

    print("[AGENT] Student monitoring agent started")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[AGENT] Stopping...")
        ws_client.close()


if __name__ == "__main__":
    main()
