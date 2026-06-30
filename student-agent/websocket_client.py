"""
websocket_client.py
Handles communication from the student monitoring agent to the backend.

Install dependency:
    pip install websocket-client
"""

from __future__ import annotations

import base64
import json
import os
import time
from typing import Any, Dict, Optional

# pyrefly: ignore [missing-import]
import websocket    


class AgentWebSocketClient:
    """Small reconnecting WebSocket client for the student agent."""

    def __init__(
        self,
        backend_url: Optional[str] = None,
        student_id: Optional[str] = None,
        token: Optional[str] = None,
        reconnect_delay: float = 3.0,
    ) -> None:
        self.backend_url = backend_url or os.getenv(
            "AGENT_WS_URL", "ws://127.0.0.1:8000/ws/student-agent"
        )
        self.student_id = student_id or os.getenv("STUDENT_ID", "student-001")
        self.token = token or os.getenv("AGENT_TOKEN")
        self.reconnect_delay = reconnect_delay
        self.ws: Optional[websocket.WebSocket] = None

    def connect(self) -> None:
        """Open a websocket connection. Reuses the connection if already open."""
        if self.ws and self.ws.connected:
            return

        headers = []
        if self.token:
            headers.append(f"Authorization: Bearer {self.token}")

        self.ws = websocket.create_connection(
            self.backend_url,
            header=headers,
            timeout=10,
        )

    def close(self) -> None:
        if self.ws:
            self.ws.close()
            self.ws = None

    def _ensure_connected(self) -> None:
        while True:
            try:
                self.connect()
                return
            except Exception as exc:
                print(f"[WS] Connection failed: {exc}. Retrying in {self.reconnect_delay}s")
                time.sleep(self.reconnect_delay)

    def _base_payload(self, event_type: str) -> Dict[str, Any]:
        return {
            "type": event_type,
            "student_id": self.student_id,
            "timestamp": int(time.time()),
        }

    def send_json(self, payload: Dict[str, Any]) -> bool:
        """Send any JSON payload to backend with reconnect on failure."""
        try:
            self._ensure_connected()
            assert self.ws is not None
            self.ws.send(json.dumps(payload))
            return True
        except Exception as exc:
            print(f"[WS] Send failed: {exc}")
            self.close()
            return False

    def send_event(self, event_type: str, data: Optional[Dict[str, Any]] = None) -> bool:
        payload = self._base_payload(event_type)
        if data:
            payload.update(data)
        return self.send_json(payload)

    def send_screen(self, image_bytes: bytes, meta: Optional[Dict[str, Any]] = None) -> bool:
        """Send compressed screen image as base64 JSON."""
        payload = self._base_payload("SCREEN_CAPTURE")
        payload.update(
            {
                "image_format": "jpeg",
                "image_base64": base64.b64encode(image_bytes).decode("utf-8"),
            }
        )
        if meta:
            payload["meta"] = meta
        return self.send_json(payload)
