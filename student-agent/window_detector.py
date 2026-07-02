import platform
import subprocess
import psutil


APP_NAME_MAP = {
    "firefox": "Firefox",
    "firefox-bin": "Firefox",
    "chrome": "Chrome",
    "google-chrome": "Chrome",
    "chromium": "Chromium",
    "brave": "Brave",
    "code": "VS Code",
    "discord": "Discord",
    "telegram-desktop": "Telegram",
    "whatsapp": "WhatsApp",
    "kcalc": "Calculator",
    "gnome-calculator": "Calculator",
}


def run_cmd(command):
    try:
        return subprocess.check_output(
            command,
            stderr=subprocess.DEVNULL,
            text=True
        ).strip()
    except Exception:
        return ""


def normalize_app_name(process_name):
    process_name = (process_name or "").lower()
    return APP_NAME_MAP.get(
        process_name,
        process_name.title() if process_name else "Unknown"
    )


def get_linux_active_window():
    title = run_cmd(["xdotool", "getactivewindow", "getwindowname"])

    pid_text = run_cmd(["xdotool", "getactivewindow", "getwindowpid"])
    pid = int(pid_text) if pid_text.isdigit() else -1

    process_name = "Unknown"
    exe = ""

    if pid > 0:
        try:
            process = psutil.Process(pid)
            process_name = process.name()
            exe = process.exe()
        except Exception:
            pass

    return {
        "title": title,
        "app": normalize_app_name(process_name),
        "process_name": process_name,
        "pid": pid,
        "exe": exe,
    }


def get_active_window():
    system = platform.system().lower()

    if system == "linux":
        return get_linux_active_window()

    return {
        "title": "Unsupported OS",
        "app": "Unknown",
        "process_name": "Unknown",
        "pid": -1,
        "exe": "",
    }


if __name__ == "__main__":
    print(get_active_window())