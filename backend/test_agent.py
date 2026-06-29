from app.agents.lms_agent import LMSGuardAgent

agent = LMSGuardAgent()

result = agent.analyze_events(
    student_id="STU001",
    events=["tab_switch", "face_not_detected", "mobile_detected"]
)

print(result)
