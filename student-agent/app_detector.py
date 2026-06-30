"""
app_detector.py
Checks active application against a blacklist and sends unauthorized-app alerts.
"""

from __future__ import annotations

import time
from typing import Callable, Dict, Iterable, Optional, Set

from window_detector import ActiveWindow, get_active_window


DEFAULT_BLACKLIST = {
    "VS Code",
    "Discord",
    "Telegram",
    "WhatsApp",
    "Calculator",
}


class AppDetector:
    def __init__(
        self,
        blacklist: Optional[Iterable[str]] = None,
        alert_cooldown_seconds: int = 15,
    ) -> None:
        self.blacklist: Set[str] = {app.lower() for app in (blacklist or DEFAULT_BLACKLIST)}
        self.alert_cooldown_seconds = alert_cooldown_seconds
        self._last_alert_time: Dict[str, float] = {}

    def is_unauthorized(self, window: ActiveWindow) -> bool:
        app = (window.app or "").lower()
        process = (window.process_name or "").lower().replace(".exe", "")
        title = (window.title or "").lower()

        for blocked in self.blacklist:
            blocked_key = blocked.lower()
            if blocked_key == app:
                return True
            if blocked_key in process:
                return True
            if blocked_key in title:
                return True
        return False

    def build_alert_payload(self, window: ActiveWindow) -> Dict[str, object]:
        # Required payload example:
        # {"type": "UNAUTHORIZED_APP", "app": "VS Code"}
        return {
            "type": "UNAUTHORIZED_APP",
            "app": window.app,
            "window_title": window.title,
            "process_name": window.process_name,
            "pid": window.pid,
        }

    def should_alert_now(self, app: str) -> bool:
        now = time.time()
        last = self._last_alert_time.get(app.lower(), 0)
        if now - last >= self.alert_cooldown_seconds:
            self._last_alert_time[app.lower()] = now
            return True
        return False

    def check_once(self) -> Optional[Dict[str, object]]:
        window = get_active_window()
        if self.is_unauthorized(window) and self.should_alert_now(window.app):
            return self.build_alert_payload(window)
        return None

    def monitor(
        self,
        on_alert: Callable[[Dict[str, object]], None],
        interval_seconds: float = 2.0,
    ) -> None:
        """Continuously monitor active window and call on_alert when blacklisted app opens."""
        while True:
            try:
                alert = self.check_once()
                if alert:
                    on_alert(alert)
            except Exception as exc:
                print(f"[APP_DETECTOR] Error: {exc}")
            time.sleep(interval_seconds)


if __name__ == "__main__":
    detector = AppDetector()
    while True:
        payload = detector.check_once()
        if payload:
            print(payload)
        time.sleep(2)
