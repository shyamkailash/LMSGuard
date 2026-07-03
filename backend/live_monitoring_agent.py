import os
import json
import base64
from datetime import datetime
from pathlib import Path


class LiveMonitoringAgent:
    def __init__(self):
        self.base_dir = Path(__file__).resolve().parent
        self.screenshot_dir = self.base_dir / "evidence" / "screenshots"
        self.video_dir = self.base_dir / "evidence" / "videos"
        self.log_file = self.base_dir / "logs" / "monitoring_logs.json"

        self.screenshot_dir.mkdir(parents=True, exist_ok=True)
        self.video_dir.mkdir(parents=True, exist_ok=True)
        self.log_file.parent.mkdir(parents=True, exist_ok=True)

        self.high_risk_events = {
            "UNAUTHORIZED_APP",
            "IDLE_STATUS",
            "TAB_SWITCH",
            "COPY_PASTE",
            "PHONE_DETECTED",
            "MULTIPLE_FACE",
            "NO_FACE",
        }

    def is_high_risk(self, event):
        event_type = event.get("type", "")
        risk = event.get("risk", "").upper()

        if event_type in self.high_risk_events:
            return True

        if risk == "HIGH":
            return True

        return False

    def get_timestamp(self):
        return datetime.now().strftime("%Y%m%d_%H%M%S")

    def save_screenshot(self, student_id, image_base64):
        if not image_base64:
            return None

        timestamp = self.get_timestamp()
        filename = f"{student_id}_{timestamp}.jpg"
        file_path = self.screenshot_dir / filename

        try:
            image_bytes = base64.b64decode(image_base64)
            with open(file_path, "wb") as file:
                file.write(image_bytes)

            return str(file_path)

        except Exception as error:
            print("[LIVE_AGENT] Screenshot save failed:", error)
            return None

    def write_log(self, event):
        logs = []

        if self.log_file.exists():
            try:
                with open(self.log_file, "r") as file:
                    logs = json.load(file)
            except Exception:
                logs = []

        logs.append(event)

        with open(self.log_file, "w") as file:
            json.dump(logs, file, indent=4)

    def process_event(self, event):
        student_id = event.get("student_id", "unknown-student")
        event_type = event.get("type", "UNKNOWN")

        alert = {
            "student_id": student_id,
            "type": event_type,
            "risk": "NORMAL",
            "message": "Normal activity",
            "timestamp": datetime.now().isoformat(),
            "evidence_screenshot": None,
            "evidence_video": None,
        }

        if self.is_high_risk(event):
            alert["risk"] = "HIGH"
            alert["message"] = f"High risk activity detected: {event_type}"

            if "image" in event:
                screenshot_path = self.save_screenshot(student_id, event.get("image"))
                alert["evidence_screenshot"] = screenshot_path

            print("[LIVE_AGENT] HIGH RISK:", alert["message"])

        else:
            alert["risk"] = "LOW"
            alert["message"] = f"Activity received: {event_type}"

        log_event = event.copy()

        if "image" in log_event:
            log_event["image"] = "<base64 hidden>"

        log_event["live_monitoring_result"] = alert

        self.write_log(log_event)

        return alert
