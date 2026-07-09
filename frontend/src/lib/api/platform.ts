import { apiRequest } from "./client";

export type SecurityPermissions = Record<string, boolean>;

export type ExamPassword = {
  id: number;
  exam_id: number;
  start_password: string;
  quit_password: string;
  created_at: string;
  updated_at: string;
};

export type SecurityPolicy = {
  id: number;
  exam_id: number | null;
  name: string;
  permissions: SecurityPermissions;
  updated_by_id: number | null;
  created_at: string;
  updated_at: string;
};

export type PlatformNotification = {
  id: number;
  recipient_user_id: number | null;
  title: string;
  body: string;
  category: string;
  severity: string;
  entity_type: string | null;
  entity_id: number | null;
  read_at: string | null;
  created_at: string;
};

export type StudentSession = {
  id: number;
  exam_id: number;
  student_id: number;
  student_name: string;
  roll_number: string;
  department: string;
  exam_title: string;
  risk_score: number;
  internet_speed_mbps: number;
  camera_enabled: boolean;
  microphone_enabled: boolean;
  fullscreen_enabled: boolean;
  current_tab: string;
  battery_level: number | null;
  status: string;
  started_at: string;
  last_seen_at: string;
};

export type PlatformAnalytics = {
  total_students: number;
  online_students: number;
  offline_students: number;
  current_exams: number;
  average_risk: number;
  high_risk_students: number;
  critical_risk_students: number;
  unread_notifications: number;
  system_health: number;
};

export type RiskEventPayload = {
  session_id: number;
  event_type: string;
  message?: string;
  severity?: string;
  browser?: string;
  device?: string;
  current_tab?: string;
  screenshot_url?: string | null;
  camera_image_url?: string | null;
};

export const platformApi = {
  analytics: () => apiRequest<PlatformAnalytics>("/platform/analytics"),
  passwords: (examId: number) => apiRequest<ExamPassword>(`/platform/exams/${examId}/passwords`),
  regeneratePasswords: (examId: number) =>
    apiRequest<ExamPassword>(`/platform/exams/${examId}/passwords/regenerate`, { method: "POST" }),
  securityPolicy: (examId?: number) =>
    apiRequest<SecurityPolicy>(examId ? `/platform/exams/${examId}/security-policy` : "/platform/security-policy"),
  updateSecurityPolicy: (payload: { exam_id?: number | null; name: string; permissions: SecurityPermissions }) =>
    apiRequest<SecurityPolicy>("/platform/security-policy", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  notifications: (unreadOnly = false) =>
    apiRequest<PlatformNotification[]>(`/platform/notifications${unreadOnly ? "?unread_only=true" : ""}`),
  createNotification: (payload: {
    recipient_user_id?: number | null;
    title: string;
    body: string;
    category?: string;
    severity?: string;
    entity_type?: string | null;
    entity_id?: number | null;
  }) =>
    apiRequest<PlatformNotification>("/platform/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  markNotificationRead: (id: number) =>
    apiRequest<PlatformNotification>(`/platform/notifications/${id}/read`, { method: "POST" }),
  sessions: (examId?: number) =>
    apiRequest<StudentSession[]>(`/platform/student-sessions${examId ? `?exam_id=${examId}` : ""}`),
  joinExam: (payload: {
    exam_id: number;
    start_password: string;
    roll_number?: string;
    department?: string;
    camera_enabled?: boolean;
    microphone_enabled?: boolean;
    fullscreen_enabled?: boolean;
    current_tab?: string;
    internet_speed_mbps?: number;
    battery_level?: number | null;
  }) =>
    apiRequest<StudentSession>("/platform/student-sessions/join", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  leaveExam: (sessionId: number, quitPassword: string) =>
    apiRequest<StudentSession>(`/platform/student-sessions/${sessionId}/leave`, {
      method: "POST",
      body: JSON.stringify({ quit_password: quitPassword }),
    }),
  updateSession: (sessionId: number, payload: Partial<StudentSession>) =>
    apiRequest<StudentSession>(`/platform/student-sessions/${sessionId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  recordRiskEvent: (payload: RiskEventPayload) =>
    apiRequest(`/platform/risk-events`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  exportReport: (format: "csv" | "pdf" | "excel") =>
    apiRequest<{ format: string; filename: string; content_type: string; data: string }>(
      `/platform/reports/export?format=${format}`,
    ),
};
