from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


SECURITY_PERMISSION_KEYS = [
    "camera",
    "microphone",
    "screen_sharing",
    "full_screen",
    "multiple_monitor_detection",
    "screen_recording",
    "screen_capture",
    "clipboard_copy",
    "clipboard_paste",
    "keyboard_shortcuts",
    "tab_switching",
    "browser_refresh",
    "developer_tools",
    "print_screen_key",
    "right_click",
    "task_manager_detection",
    "unauthorized_applications",
    "virtual_machine_detection",
    "vpn_detection",
    "remote_desktop_detection",
    "obs_detection",
    "anydesk_detection",
    "teamviewer_detection",
    "zoom_detection",
    "discord_detection",
    "external_display_detection",
    "eye_tracking",
    "head_pose_detection",
    "face_recognition",
    "face_verification",
    "multiple_face_detection",
    "phone_detection",
    "object_detection",
    "noise_detection",
    "speech_detection",
    "internet_disconnect_detection",
]

DEFAULT_SECURITY_PERMISSIONS = {key: True for key in SECURITY_PERMISSION_KEYS}
DEFAULT_SECURITY_PERMISSIONS.update(
    {
        "clipboard_copy": False,
        "clipboard_paste": False,
        "keyboard_shortcuts": False,
        "tab_switching": False,
        "browser_refresh": False,
        "developer_tools": False,
        "print_screen_key": False,
        "right_click": False,
    },
)


class ExamPasswordResponse(ORMModel):
    id: int
    exam_id: int
    start_password: str
    quit_password: str
    created_at: datetime
    updated_at: datetime


class SecurityPolicyUpdate(BaseModel):
    exam_id: int | None = None
    name: str = "Default examination security"
    permissions: dict[str, bool] = Field(default_factory=lambda: DEFAULT_SECURITY_PERMISSIONS.copy())


class SecurityPolicyResponse(ORMModel):
    id: int
    exam_id: int | None
    name: str
    permissions: dict[str, bool]
    updated_by_id: int | None
    created_at: datetime
    updated_at: datetime


class NotificationCreate(BaseModel):
    recipient_user_id: int | None = None
    title: str = Field(min_length=2, max_length=180)
    body: str = Field(min_length=2)
    category: str = "system"
    severity: str = "info"
    entity_type: str | None = None
    entity_id: int | None = None


class NotificationResponse(ORMModel):
    id: int
    recipient_user_id: int | None
    title: str
    body: str
    category: str
    severity: str
    entity_type: str | None
    entity_id: int | None
    read_at: datetime | None
    created_at: datetime


class StudentJoinRequest(BaseModel):
    exam_id: int
    start_password: str = Field(min_length=4, max_length=6)
    roll_number: str = ""
    department: str = ""
    camera_enabled: bool = False
    microphone_enabled: bool = False
    fullscreen_enabled: bool = False
    current_tab: str = "Exam"
    internet_speed_mbps: float = 0
    battery_level: int | None = None


class StudentLeaveRequest(BaseModel):
    quit_password: str = Field(min_length=4, max_length=6)


class StudentSessionUpdate(BaseModel):
    internet_speed_mbps: float | None = None
    camera_enabled: bool | None = None
    microphone_enabled: bool | None = None
    fullscreen_enabled: bool | None = None
    current_tab: str | None = None
    battery_level: int | None = None
    status: str | None = None


class StudentSessionResponse(ORMModel):
    id: int
    exam_id: int
    student_id: int
    student_name: str
    roll_number: str
    department: str
    exam_title: str
    risk_score: int
    internet_speed_mbps: float
    camera_enabled: bool
    microphone_enabled: bool
    fullscreen_enabled: bool
    current_tab: str
    battery_level: int | None
    status: str
    started_at: datetime
    last_seen_at: datetime


class RiskEventCreate(BaseModel):
    session_id: int
    event_type: str = Field(min_length=2, max_length=120)
    message: str = ""
    severity: str = "medium"
    browser: str = ""
    device: str = ""
    current_tab: str = ""
    screenshot_url: str | None = None
    camera_image_url: str | None = None


class RiskEventResponse(ORMModel):
    id: int
    session_id: int
    event_type: str
    severity: str
    delta: int
    risk_score: int
    message: str
    created_at: datetime


class EvidenceResponse(ORMModel):
    id: int
    session_id: int
    risk_event_id: int | None
    violation_type: str
    risk_score: int
    screenshot_url: str | None
    camera_image_url: str | None
    current_tab: str
    browser: str
    device: str
    ip_address: str | None
    notes: str
    created_at: datetime


class DashboardAnalyticsResponse(BaseModel):
    total_students: int
    online_students: int
    offline_students: int
    current_exams: int
    average_risk: float
    high_risk_students: int
    critical_risk_students: int
    unread_notifications: int
    system_health: int


class ReportExportResponse(BaseModel):
    format: str
    filename: str
    content_type: str
    data: str
