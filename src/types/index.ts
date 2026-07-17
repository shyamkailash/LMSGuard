/* ═══════════════════════════════════════════════════════════
   LMSGuard V2 — Complete Type System
   ═══════════════════════════════════════════════════════════ */

// ── Primitive Enums ──────────────────────────────────────────────────────────

export type Role = "admin" | "invigilator" | "student";

export type NetworkStatus = "stable" | "weak" | "disconnected";

export type RiskLevel = "safe" | "warning" | "critical";

export type Severity = "low" | "medium" | "high" | "critical";

export type ExamStatus = "upcoming" | "active" | "paused" | "ended" | "scheduled" | "completed";

export type StudentStatus = "waiting" | "approved" | "rejected" | "active" | "flagged" | "safe" | "warning" | "violation";

export type SessionStatus = "waiting" | "active" | "paused" | "ended";

export type ViolationType =
  | "tab_switch"
  | "app_switch"
  | "browser_switch"
  | "clipboard"
  | "multiple_faces"
  | "no_face"
  | "screen_capture"
  | "audio_detected"
  | "idle"
  | "unknown_app"
  | "fullscreen_exit"
  | "network_drop";

// ── User / Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Super Admin" | "Dept Admin";
  department?: string;
  phone?: string;
  joinedAt?: string;
  lastLogin?: string;
}

// ── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  email?: string;
  phone?: string;
  students: number;
  classes: number;
  invigilators?: number;
  established?: string;
  building?: string;
  status: "active" | "inactive";
}

// ── Class / Section ──────────────────────────────────────────────────────────

export interface SchoolClass {
  id: string;
  name: string;
  dept: string;
  deptCode: string;
  year: string;
  section: string;
  strength: number;
  invigilatorId?: string;
  roomNo?: string;
}

export interface AvailableClass {
  id: string;
  label: string;
  dept: string;
  year: string;
  section: string;
  strength: number;
  roomNo?: string;
}

// ── Student ──────────────────────────────────────────────────────────────────

export interface AdminStudent {
  id: string;
  name: string;
  regno: string;
  email: string;
  dept: string;
  class: string;
  status: "active" | "flagged" | "inactive";
  risk: number;
  phone?: string;
  dob?: string;
  address?: string;
  photo?: string;
  joinedAt?: string;
  totalViolations?: number;
  lastExam?: string;
}

export interface StudentViolation {
  id?: string;
  time: string;
  type: string;
  detail?: string;
  severity: Severity;
  timestamp?: number;
}

export interface MonitoringStudent {
  id: string;
  name: string;
  regno: string;
  dept: string;
  class?: string;
  avatar: string;
  risk: number;
  status: "safe" | "warning" | "violation";
  exam?: string;
  networkStatus: NetworkStatus;
  violations: StudentViolation[];
  currentWindow?: string;
  isOnline?: boolean;
  connectedAt?: string;
  examDuration?: number;
  permissionStatus?: "waiting" | "approved" | "rejected";
  photo?: string;
  isIdle?: boolean;
  clipboardActive?: boolean;
  runningApps?: string[];
  tabCount?: number;
}

// ── Invigilator ──────────────────────────────────────────────────────────────

export interface InvigilatorProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  phone?: string;
  status?: "active" | "inactive";
}

export interface AdminInvigilator {
  id: string;
  name: string;
  email: string;
  dept: string;
  status: "active" | "inactive";
  permissions: string[];
  exams: string[];
  phone?: string;
  joinedAt?: string;
  totalExams?: number;
  avatar?: string;
}

// ── Exam ─────────────────────────────────────────────────────────────────────

export interface AdminExam {
  id: string;
  title: string;
  name?: string;
  subject: string;
  code: string;
  date: string;
  dept: string;
  classes: string[];
  duration: number;
  questions: number;
  totalMarks?: number;
  passingMarks?: number;
  status: ExamStatus;
  startTime?: string;
  endTime?: string;
  passcode?: string;
  invigilator?: string;
  description?: string;
}

export interface AvailableExam {
  id: string;
  title: string;
  subject: string;
  code: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  eligibleClasses: string[];
  status?: ExamStatus;
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

// ── Assessment (Student Portal) ──────────────────────────────────────────────

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  code: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  startTime: string;
  endTime: string;
  date: string;
  status: "available" | "upcoming" | "completed" | "missed";
  instructions: string[];
  score?: number;
  grade?: string;
}

// ── Monitoring Session ────────────────────────────────────────────────────────

export interface MonitoringSession {
  id: string;
  invigilator: string;
  invigilatorId?: string;
  class: string;
  exam: string;
  examId?: string;
  students: number;
  violations: number;
  status: SessionStatus;
  startTime: string;
  endTime?: string;
  room?: string;
  dept?: string;
  avgRisk?: number;
}

// ── Violation ────────────────────────────────────────────────────────────────

export interface ViolationRecord {
  id: string;
  studentId: string;
  studentName: string;
  regno: string;
  type: string;
  detail?: string;
  severity: Severity;
  time: string;
  timestamp: number;
  assignedClass?: string;
  exam?: string;
  risk?: number;
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

// ── AI Alert ──────────────────────────────────────────────────────────────────

export interface AIAlert {
  id: string;
  studentId: string;
  studentName: string;
  regno: string;
  class: string;
  exam: string;
  type: string;
  severity: Severity;
  confidence: number;
  message: string;
  timestamp: number;
  time: string;
  acknowledged: boolean;
  riskBefore: number;
  riskAfter: number;
  screenshot?: string;
  suggestion?: string;
}

// ── Network Issue ─────────────────────────────────────────────────────────────

export interface NetworkIssue {
  id: string;
  studentId: string;
  studentName: string;
  regno: string;
  classLabel: string;
  examTitle: string;
  issue: string;
  networkStatus: NetworkStatus;
  disconnectedAt: string;
  durationMin: number;
  resolved: boolean;
  resolution?: string;
  extraMinutes?: number;
  timestamp: number;
  assignedClass?: string;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface SystemStats {
  totalStudents: number;
  totalInvigilators: number;
  activeExams: number;
  totalViolations: number;
  aiAccuracy: string;
  serverUptime: string;
  totalDepartments?: number;
  totalClasses?: number;
  onlineStudents?: number;
  criticalAlerts?: number;
}

export interface StatCardData {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  icon: string;
  color: "primary" | "success" | "warning" | "danger" | "purple" | "cyan";
  description?: string;
}

// ── Chart Data ────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
  label?: string;
}

export interface RiskDistribution {
  range: string;
  count: number;
  percentage: number;
}

// ── Timeline ──────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  time: string;
  timestamp: number;
  type: "violation" | "info" | "warning" | "success" | "system";
  title: string;
  description: string;
  student?: string;
  regno?: string;
  severity?: Severity;
  icon?: string;
}

// ── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: "violation" | "info" | "warning" | "success";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
  studentId?: string;
  examId?: string;
}

// ── WebSocket Events ──────────────────────────────────────────────────────────

export interface WSStudentStatusEvent {
  students: MonitoringStudent[];
  assignedClass: string;
}

export interface WSViolationEvent extends ViolationRecord {
  exam?: string;
  risk: number;
}

export interface WSScreenUpdateEvent {
  studentId: string;
  risk: number;
  currentWindow?: string;
  assignedClass?: string;
  networkStatus?: NetworkStatus;
}

export interface WSNetworkIssueEvent extends NetworkIssue {}

export interface WSNetworkUpdateEvent {
  studentId: string;
  networkStatus: NetworkStatus;
  assignedClass?: string;
}

export type WSEventMap = {
  connection:          { mode: "live" | "demo" };
  student_status:      WSStudentStatusEvent;
  violation_detected:  WSViolationEvent;
  screen_update:       WSScreenUpdateEvent;
  violations_list:     { violations: ViolationRecord[]; assignedClass: string };
  network_issue:       WSNetworkIssueEvent;
  network_update:      WSNetworkUpdateEvent;
};

// ── Table / Pagination ────────────────────────────────────────────────────────

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

// ── Filter / Search ───────────────────────────────────────────────────────────

export interface FilterState {
  search: string;
  status?: string;
  dept?: string;
  class?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// ── Navigation ────────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
  children?: NavItem[];
  section?: string;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface ExamReport {
  id: string;
  examId: string;
  examTitle: string;
  date: string;
  dept: string;
  class: string;
  totalStudents: number;
  appeared: number;
  passed: number;
  failed: number;
  violations: number;
  avgRisk: number;
  maxRisk: number;
  duration: string;
  generatedAt: string;
  status: "ready" | "generating" | "failed";
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface SystemSettings {
  institution: {
    name: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  monitoring: {
    screenshotInterval: number;
    riskThresholdWarn: number;
    riskThresholdCrit: number;
    maxTabSwitches: number;
    idleTimeout: number;
    autoTerminate: boolean;
    aiDetection: boolean;
    faceVerification: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    violationAlerts: boolean;
    networkAlerts: boolean;
    sessionAlerts: boolean;
  };
  security: {
    sessionTimeout: number;
    twoFactor: boolean;
    ipRestriction: boolean;
    allowedIPs: string[];
  };
}

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department?: string;
  phone?: string;
  bio?: string;
  joinedAt: string;
  lastLogin: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
}
