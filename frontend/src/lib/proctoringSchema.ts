import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type FirestoreError,
  type Timestamp,
} from "firebase/firestore";

import { firestore } from "@/firebase/firestore";
import type { UserRole } from "@/services/authService";

export const collections = {
  users: "users",
  roles: "roles",
  departments: "departments",
  subjects: "subjects",
  questionBanks: "questionBanks",
  questions: "questions",
  exams: "exams",
  examAssignments: "examAssignments",
  studentExams: "studentExams",
  answers: "answers",
  violations: "violations",
  notifications: "notifications",
  reports: "reports",
  attendance: "attendance",
  securitySettings: "securitySettings",
  liveSessions: "liveSessions",
  startPasswords: "startPasswords",
  quitPasswords: "quitPasswords",
  auditLogs: "auditLogs",
} as const;

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentID?: string;
  disabled?: boolean;
  createdAt: Timestamp | Date | null;
};

export type QuestionType = "MCQ" | "TRUE_FALSE" | "ONE_WORD" | "SHORT_ANSWER" | "ESSAY" | "IMAGE" | "CODE";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type ExamStatus = "Draft" | "Scheduled" | "Waiting" | "Running" | "Completed" | "Suspended";
export type AiRiskBand = "Safe" | "Watch" | "Warning" | "Critical";

export type Question = {
  id: string;
  questionBankId: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer?: string | string[];
  marks: number;
  difficulty: DifficultyLevel;
  tags: string[];
  subject: string;
  topic: string;
  imageUrl?: string;
  createdAt: Timestamp | Date | null;
};

export type Exam = {
  id: string;
  title: string;
  subjectIds: string[];
  questionBankIds: string[];
  invigilatorIds: string[];
  studentIds: string[];
  startsAt: Timestamp | Date | null;
  durationMinutes: number;
  maximumMarks: number;
  passingMarks: number;
  status: ExamStatus;
  randomization: {
    enabled: boolean;
    randomizeQuestionOrder: boolean;
    randomizeOptionOrder: boolean;
    questionCount?: number;
  };
  createdAt: Timestamp | Date | null;
};

export type LiveSession = {
  id: string;
  examId: string;
  studentUid: string;
  studentID: string;
  studentName: string;
  department: string;
  status: "Present" | "Joined" | "Disconnected" | "Completed" | "Absent";
  cameraOn: boolean;
  microphoneOn: boolean;
  fullscreenOn: boolean;
  internetOnline: boolean;
  questionNumber: number;
  remainingSeconds: number;
  aiRiskScore: number;
  aiRiskBand: AiRiskBand;
  warnings: number;
  violations: number;
  submissionStatus: "NotStarted" | "InProgress" | "WaitingQuitApproval" | "Submitted";
  screenshotUrl?: string;
  updatedAt: Timestamp | Date | null;
};

export type ViolationReason =
  | "Camera Off"
  | "Microphone Off"
  | "Face Missing"
  | "Multiple Faces"
  | "Phone Detected"
  | "Book Detected"
  | "Talking"
  | "Tab Switching"
  | "Window Switching"
  | "Fullscreen Exit"
  | "Copy Attempt"
  | "Paste Attempt"
  | "Developer Tools"
  | "Keyboard Shortcuts"
  | "Internet Disconnect"
  | "Screen Recording";

export type Violation = {
  id: string;
  examId: string;
  studentUid: string;
  studentID: string;
  timestamp: Timestamp | Date | null;
  reason: ViolationReason;
  confidenceScore: number;
  screenshotUrl?: string;
};

export type SecuritySettings = {
  enableCamera: boolean;
  enableMicrophone: boolean;
  requireFullscreen: boolean;
  preventTabSwitching: boolean;
  disableRightClick: boolean;
  disableCopy: boolean;
  disablePaste: boolean;
  disableKeyboardShortcuts: boolean;
  disablePrint: boolean;
  detectDeveloperTools: boolean;
  disableRefresh: boolean;
  blockBrowserBackButton: boolean;
  preventMultipleWindows: boolean;
  detectMultipleMonitors: boolean;
  detectScreenRecording: boolean;
  clipboardMonitoring: boolean;
  faceDetection: boolean;
  multipleFaceDetection: boolean;
  phoneDetection: boolean;
  bookDetection: boolean;
  objectDetection: boolean;
  eyeTracking: boolean;
  headPoseTracking: boolean;
  mouthMovementDetection: boolean;
  backgroundNoiseDetection: boolean;
  internetConnectionMonitoring: boolean;
  autoScreenshotCapture: boolean;
  screenshotIntervalSeconds: number;
  autoSaveAnswers: boolean;
  serverSideTimer: boolean;
  sessionRecording: boolean;
  liveScreenMonitoring: boolean;
  lockBrowser: boolean;
  suspendExam: boolean;
  resumeExam: boolean;
  autoSubmitOnTimeEnd: boolean;
  violationCounter: boolean;
  aiRiskScore: boolean;
  maximumAllowedWarnings: number;
  instantNotificationToInvigilator: boolean;
  updatedAt?: Timestamp | Date | null;
  updatedBy?: string;
};

export const defaultSecuritySettings: SecuritySettings = {
  enableCamera: true,
  enableMicrophone: true,
  requireFullscreen: true,
  preventTabSwitching: true,
  disableRightClick: true,
  disableCopy: true,
  disablePaste: true,
  disableKeyboardShortcuts: true,
  disablePrint: true,
  detectDeveloperTools: true,
  disableRefresh: true,
  blockBrowserBackButton: true,
  preventMultipleWindows: true,
  detectMultipleMonitors: true,
  detectScreenRecording: true,
  clipboardMonitoring: true,
  faceDetection: true,
  multipleFaceDetection: true,
  phoneDetection: true,
  bookDetection: true,
  objectDetection: true,
  eyeTracking: true,
  headPoseTracking: true,
  mouthMovementDetection: true,
  backgroundNoiseDetection: true,
  internetConnectionMonitoring: true,
  autoScreenshotCapture: true,
  screenshotIntervalSeconds: 30,
  autoSaveAnswers: true,
  serverSideTimer: true,
  sessionRecording: true,
  liveScreenMonitoring: true,
  lockBrowser: true,
  suspendExam: false,
  resumeExam: true,
  autoSubmitOnTimeEnd: true,
  violationCounter: true,
  aiRiskScore: true,
  maximumAllowedWarnings: 3,
  instantNotificationToInvigilator: true,
};

function getDb() {
  if (!firestore) {
    throw new Error("Firestore is not configured.");
  }

  return firestore;
}

export function securitySettingsId(examId?: string | number | null) {
  return examId ? `exam_${examId}` : "global";
}

export function subscribeSecuritySettings(
  examId: string | number | null | undefined,
  onChange: (settings: SecuritySettings) => void,
  onError?: (error: FirestoreError) => void,
) {
  const ref = doc(getDb(), collections.securitySettings, securitySettingsId(examId));

  return onSnapshot(
    ref,
    (snapshot) => {
      onChange({
        ...defaultSecuritySettings,
        ...(snapshot.exists() ? snapshot.data() : {}),
      } as SecuritySettings);
    },
    onError,
  );
}

export async function updateSecuritySettings(
  examId: string | number | null | undefined,
  settings: Partial<SecuritySettings>,
  updatedBy?: string,
) {
  await setDoc(
    doc(getDb(), collections.securitySettings, securitySettingsId(examId)),
    {
      ...settings,
      updatedBy: updatedBy ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function subscribeLiveSessions(
  onChange: (sessions: LiveSession[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  return onSnapshot(
    collection(getDb(), collections.liveSessions),
    (snapshot) => {
      onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as LiveSession));
    },
    onError,
  );
}
