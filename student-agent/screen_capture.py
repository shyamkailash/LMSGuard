"""
screen_capture.py
Captures the student screen, compresses it as JPEG, and sends it to backend.

Flow:
    Student Screen -> compress image -> send backend
"""

from __future__ import annotations

import io
import time
from dataclasses import dataclass
from typing import Dict, Optional, Tuple

# pyrefly: ignore [missing-import]
import mss
from PIL import Image

from websocket_client import AgentWebSocketClient


@dataclass
class ScreenCaptureConfig:
    monitor_index: int = 1
    jpeg_quality: int = 45
    max_width: int = 1280
    interval_seconds: float = 5.0


class ScreenCapture:
    def __init__(self, config: Optional[ScreenCaptureConfig] = None) -> None:
        self.config = config or ScreenCaptureConfig()

    def capture_compressed(self) -> Tuple[bytes, Dict[str, object]]:
        """Capture the screen and return compressed JPEG bytes + metadata."""
        with mss.mss() as sct:
            monitors = sct.monitors
            if self.config.monitor_index >= len(monitors):
                monitor = monitors[1] if len(monitors) > 1 else monitors[0]
            else:
                monitor = monitors[self.config.monitor_index]

            shot = sct.grab(monitor)
            image = Image.frombytes("RGB", shot.size, shot.bgra, "raw", "BGRX")

            original_width, original_height = image.size
            if self.config.max_width and original_width > self.config.max_width:
                ratio = self.config.max_width / float(original_width)
                new_size = (self.config.max_width, int(original_height * ratio))
                image = image.resize(new_size)

            buffer = io.BytesIO()
            image.save(
                buffer,
                format="JPEG",
                quality=self.config.jpeg_quality,
                optimize=True,
            )

            meta = {
                "original_width": original_width,
                "original_height": original_height,
                "sent_width": image.size[0],
                "sent_height": image.size[1],
                "quality": self.config.jpeg_quality,
                "monitor_index": self.config.monitor_index,
                "compressed_size_bytes": buffer.tell(),
            }
            return buffer.getvalue(), meta

    def run(self, ws_client: AgentWebSocketClient) -> None:
        """Continuously capture and send screen images."""
        while True:
            try:
                image_bytes, meta = self.capture_compressed()
                ws_client.send_screen(image_bytes, meta=meta)
                print(f"[SCREEN] Sent {meta['compressed_size_bytes']} bytes")
            except Exception as exc:
                print(f"[SCREEN] Capture/send error: {exc}")
            time.sleep(self.config.interval_seconds)


if __name__ == "__main__":
    client = AgentWebSocketClient()
    capture = ScreenCapture()
    capture.run(client)
