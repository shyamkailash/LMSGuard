"""
idle_detector.py
Detects if the student has been idle for a configured number of seconds.
"""

from __future__ import annotations

import ctypes
import platform
import time
from dataclasses import asdict, dataclass
from typing import Dict


@dataclass
class IdleStatus:
    idle_seconds: int
    is_idle: bool
    threshold_seconds: int

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)


class LASTINPUTINFO(ctypes.Structure):
    _fields_ = [("cbSize", ctypes.c_uint), ("dwTime", ctypes.c_uint)]


def get_idle_seconds() -> int:
    """Return idle seconds since last keyboard/mouse input on Windows."""
    if platform.system().lower() != "windows":
        # Safe fallback for development on Linux/macOS.
        return 0

    lii = LASTINPUTINFO()
    lii.cbSize = ctypes.sizeof(LASTINPUTINFO)

    if not ctypes.windll.user32.GetLastInputInfo(ctypes.byref(lii)):
        return 0

    millis = ctypes.windll.kernel32.GetTickCount() - lii.dwTime
    return int(millis / 1000)


def get_idle_status(threshold_seconds: int = 60) -> IdleStatus:
    idle = get_idle_seconds()
    return IdleStatus(
        idle_seconds=idle,
        is_idle=idle >= threshold_seconds,
        threshold_seconds=threshold_seconds,
    )


def monitor_idle(on_status, interval_seconds: float = 10.0, threshold_seconds: int = 60) -> None:
    last_state = None
    while True:
        try:
            status = get_idle_status(threshold_seconds)
            # Send only when state changes, or when still idle after each interval.
            if status.is_idle != last_state or status.is_idle:
                on_status(status.to_dict())
                last_state = status.is_idle
        except Exception as exc:
            print(f"[IDLE_DETECTOR] Error: {exc}")
        time.sleep(interval_seconds)


if __name__ == "__main__":
    print(get_idle_status(threshold_seconds=60).to_dict())
