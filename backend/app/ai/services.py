from app.ai.base import AIService


class FaceDetectionService(AIService):
    name = "face_detection"


class FaceRecognitionService(AIService):
    name = "face_recognition"


class EyeTrackingService(AIService):
    name = "eye_tracking"


class HeadPoseService(AIService):
    name = "head_pose"


class PhoneDetectionService(AIService):
    name = "phone_detection"


class MultiplePersonDetectionService(AIService):
    name = "multiple_person_detection"


class TabSwitchingService(AIService):
    name = "tab_switching"


class AudioMonitoringService(AIService):
    name = "audio_monitoring"
