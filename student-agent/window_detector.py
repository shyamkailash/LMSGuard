"""
window_detector.py
Detects currently active window.

Windows:
    pywin32 + psutil

Linux:
    xdotool + psutil
"""

from __future__ import annotations

import os
import platform
import subprocess
from dataclasses import asdict, dataclass
from typing import Dict, Optional

import psutil


@dataclass
class ActiveWindow:
    title: str
    app: str
    process_name: str
    pid: int
    exe: Optional[str]

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)


APP_NAME_MAP = {
    "chrome.exe": "Chrome",
    "chrome": "Chrome",
    "google-chrome": "Chrome",
    "chromium": "Chrome",
    "firefox.exe": "Firefox",
    "firefox": "Firefox",
    "brave.exe": "Brave",
    "brave": "Brave",
    "code.exe": "VS Code",
    "code": "VS Code",
    "discord.exe": "Discord",
    "discord": "Discord",
    "telegram.exe": "Telegram",
    "telegram-desktop": "Telegram",
    "whatsapp.exe": "WhatsApp",
    "whatsapp": "WhatsApp",
    "calculatorapp.exe": "Calculator",
    "calc.exe": "Calculator",
    "gnome-calculator": "Calculator",
    "kcalc": "Calculator",
    "seb.exe": "SEB",
    "seb": "SEB",
}


def normalize_app_name(process_name: str, exe: Optional[str] = None) -> str:
    key = (process_name or "").lower()

    if key in APP_NAME_MAP:
        return APP_NAME_MAP[key]

    if exe:
        exe_name = os.path.basename(exe).lower()
        if exe_name in APP_NAME_MAP:
            return APP_NAME_MAP[exe_name]

    if process_name:
        return os.path.splitext(process_name)[0].replace("-", " ").title()

    return "Unknown"


def run_cmd(command: list[str]) -> str:
    return subprocess.check_output(
        command,
        stderr=subprocess.DEVNULL,
        text=True
    ).strip()


def get_linux_active_window() -> ActiveWindow:
    try:
        title = run_cmd(["xdotool", "getwindowfocus", "getwindowname"])
    except Exception:
        title = "Unknown"

    try:
        pid_text = run_cmd(["xdotool", "getwindowfocus", "getwindowpid"])
        pid = int(pid_text)
    except Exception:
        pid = -1

    process_name = "Unknown"
    exe = None

    if pid > 0:
        try:
            proc = psutil.Process(pid)
            process_name = proc.name()
            exe = proc.exe()
        except Exception:
            pass

    app = normalize_app_name(process_name, exe)

    return ActiveWindow(
        title=title,
        app=app,
        process_name=process_name,
        pid=pid,
        exe=exe,
    )


def get_windows_active_window() -> ActiveWindow:
    try:
        import win32gui
        import win32process
    except ImportError as exc:
        raise RuntimeError("pywin32 is required on Windows: pip install pywin32") from exc

    hwnd = win32gui.GetForegroundWindow()
    title = win32gui.GetWindowText(hwnd) or ""

    _, pid = win32process.GetWindowThreadProcessId(hwnd)

    process_name = "Unknown"
    exe = None

    try:
        proc = psutil.Process(pid)
        process_name = proc.name()
        exe = proc.exe()
    except Exception:
        pass

    app = normalize_app_name(process_name, exe)

    return ActiveWindow(
        title=title,
        app=app,
        process_name=process_name,
        pid=pid,
        exe=exe,
    )


def get_active_window() -> ActiveWindow:
    system = platform.system().lower()

    if system == "windows":
        return get_windows_active_window()

    if system == "linux":
        return get_linux_active_window()

    return ActiveWindow(
        title="Unsupported OS",
        app="Unknown",
        process_name="Unknown",
        pid=-1,
        exe=None,
    )


if __name__ == "__main__":
    print(get_active_window().to_dict())
