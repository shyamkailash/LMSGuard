from window_detector import get_active_window


BLACKLISTED_APPS = {
    "VS Code": ["vs code", "visual studio code", "vscode", "code", "antigravity"],
    "Discord": ["discord"],
    "Telegram": ["telegram"],
    "WhatsApp": ["whatsapp"],
    "Calculator": ["calculator", "kcalc", "gnome-calculator"],
}


def build_text(active):
    if active is None:
        return "", "", "", -1

    if isinstance(active, dict):
        title = active.get("title") or active.get("app") or ""
        app = active.get("app") or ""
        process_name = active.get("process_name") or active.get("process") or ""
        exe = active.get("exe") or ""
        pid = active.get("pid", -1)

        combined_text = f"{title} {app} {process_name} {exe}".lower()
        return combined_text, title, process_name, pid

    text = str(active)
    return text.lower(), text, "", -1


def check_app(active=None):
    """
    Supports both:
    check_app()
    check_app(active_window)
    """

    if active is None:
        active = get_active_window()

    combined_text, window_title, process_name, pid = build_text(active)

    for blocked_app, keywords in BLACKLISTED_APPS.items():
        for keyword in keywords:
            if keyword in combined_text:
                return {
                    "type": "UNAUTHORIZED_APP",
                    "app": blocked_app,
                    "window_title": window_title,
                    "process_name": process_name,
                    "pid": pid,
                }

    return None


def detect_unauthorized_app():
    return check_app()


class AppDetector:
    def detect_blacklisted_app(self):
        return check_app()


if __name__ == "__main__":
    event = check_app()

    if event:
        print(event)
    else:
        print("No unauthorized app detected")