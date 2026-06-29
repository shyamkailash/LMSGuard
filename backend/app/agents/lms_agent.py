from typing import Dict, List


class LMSGuardAgent:
    """
    LMSGuard Agent:
    Analyzes exam monitoring events and generates risk level + action.
    """

    def __init__(self):
        self.agent_name = "LMSGuard Proctor Agent"

        self.risk_scores = {
            "tab_switch": 25,
            "fullscreen_exit": 30,
            "face_not_detected": 35,
            "multiple_faces": 50,
            "mobile_detected": 60,
            "copy_paste": 20,
            "right_click": 15,
            "voice_detected": 40,
            "looking_away": 20,
        }

    def analyze_events(self, student_id: str, events: List[str]) -> Dict:
        total_score = 0
        detected_events = []

        for event in events:
            event = event.lower().strip()

            if event in self.risk_scores:
                total_score += self.risk_scores[event]
                detected_events.append(
                    {
                        "event": event,
                        "score": self.risk_scores[event],
                    }
                )

        risk_level = self._get_risk_level(total_score)
        action = self._get_action(risk_level)

        return {
            "agent": self.agent_name,
            "student_id": student_id,
            "detected_events": detected_events,
            "total_risk_score": total_score,
            "risk_level": risk_level,
            "recommended_action": action,
        }

    def _get_risk_level(self, score: int) -> str:
        if score >= 80:
            return "HIGH"
        elif score >= 40:
            return "MEDIUM"
        elif score > 0:
            return "LOW"
        return "SAFE"

    def _get_action(self, risk_level: str) -> str:
        if risk_level == "HIGH":
            return "Block exam or alert admin immediately"
        elif risk_level == "MEDIUM":
            return "Send warning and notify proctor"
        elif risk_level == "LOW":
            return "Log event and continue monitoring"
        return "No action needed"
