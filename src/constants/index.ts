/* ═══════════════════════════════════════════════════════════
   LMSGuard V2 — App Constants
   ═══════════════════════════════════════════════════════════ */

export const APP_NAME = "LMSGuard";
export const APP_VERSION = "2.0";
export const APP_TAGLINE = "AI Powered Examination Monitoring Platform";

export const INSTITUTION = {
  name: "Sri Shakthi Institute of Engineering & Technology",
  shortName: "SSIET",
  city: "Coimbatore, Tamil Nadu",
  email: "admin@ssiet.ac.in",
  phone: "+91 98765 43210",
  website: "www.ssiet.ac.in",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_DEPARTMENTS: "/admin/departments",
  ADMIN_CLASSES: "/admin/classes",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_INVIGILATORS: "/admin/invigilators",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_MONITORING: "/admin/monitoring",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_VIOLATIONS: "/admin/violations",
  ADMIN_SETTINGS: "/admin/settings",
  INVIGILATOR_DASHBOARD: "/dashboard",
  INVIGILATOR_MONITORING: "/monitoring",
  INVIGILATOR_REPORTS: "/reports",
  INVIGILATOR_SETTINGS: "/settings",
  STUDENT_LOGIN: "/student/login",
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_EXAM: "/student/exam",
} as const;

export const RISK_THRESHOLDS = {
  SAFE_MAX: 30,
  WARNING_MAX: 65,
  CRITICAL_MIN: 66,
} as const;

export const VIOLATION_COLORS = {
  low:      { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF", border: "rgba(107,114,128,0.25)" },
  medium:   { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D", border: "rgba(245,158,11,0.25)"  },
  high:     { bg: "rgba(249,115,22,0.12)",  text: "#FB923C", border: "rgba(249,115,22,0.25)"  },
  critical: { bg: "rgba(239,68,68,0.12)",   text: "#F87171", border: "rgba(239,68,68,0.25)"   },
} as const;

export const VIOLATION_LABELS: Record<string, string> = {
  tab_switch:      "Tab Switch",
  app_switch:      "App Switch",
  browser_switch:  "Browser Switch",
  clipboard:       "Clipboard Activity",
  multiple_faces:  "Multiple Faces",
  no_face:         "No Face Detected",
  screen_capture:  "Screen Capture",
  audio_detected:  "Audio Detected",
  idle:            "Idle Detected",
  unknown_app:     "Unknown App",
  fullscreen_exit: "Fullscreen Exit",
  network_drop:    "Network Drop",
  "App Switch":        "App Switch",
  "Browser Switch":    "Browser Switch",
  "Application Switch":"Application Switch",
  "Multiple Faces":    "Multiple Faces",
  "Copy/Paste":        "Clipboard Activity",
  "Screen Capture":    "Screen Capture",
  "Idle Detected":     "Idle Detected",
  "Unknown App":       "Unknown App",
  "Audio Detected":    "Audio Detected",
};

export const NETWORK_STATUS_COLORS = {
  stable:       { color: "#4ADE80", bg: "rgba(34,197,94,0.12)",  label: "Stable"       },
  weak:         { color: "#FCD34D", bg: "rgba(245,158,11,0.12)", label: "Weak"         },
  disconnected: { color: "#F87171", bg: "rgba(239,68,68,0.12)",  label: "Disconnected" },
} as const;

export const EXAM_STATUS_LABELS = {
  upcoming:  "Upcoming",
  active:    "Active",
  paused:    "Paused",
  ended:     "Ended",
  scheduled: "Scheduled",
  completed: "Completed",
} as const;

export const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PER_PAGE = 20;

export const ANIMATION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
  slideRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.07 } },
  },
  staggerFast: {
    visible: { transition: { staggerChildren: 0.04 } },
  },
} as const;

export const CHART_COLORS = {
  primary:  "#2563EB",
  success:  "#22C55E",
  warning:  "#F59E0B",
  danger:   "#EF4444",
  purple:   "#8B5CF6",
  cyan:     "#06B6D4",
  orange:   "#F97316",
  pink:     "#EC4899",
  grid:     "#1F2937",
  axis:     "#4B5563",
  tooltip:  "#111827",
} as const;
