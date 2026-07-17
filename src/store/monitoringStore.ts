"use client";
import { create } from "zustand";
import type { MonitoringStudent, ViolationRecord, NetworkIssue, AIAlert } from "@/types";

interface MonitoringState {
  students: MonitoringStudent[];
  violations: ViolationRecord[];
  networkIssues: NetworkIssue[];
  alerts: AIAlert[];
  sessionStatus: "waiting" | "active" | "paused" | "ended";
  selectedClass: string | null;
  selectedExam: string | null;
  connectionMode: "live" | "demo";
  elapsedSeconds: number;

  setStudents: (students: MonitoringStudent[]) => void;
  updateStudentRisk: (studentId: string, risk: number, currentWindow?: string) => void;
  addViolation: (violation: ViolationRecord) => void;
  setViolations: (violations: ViolationRecord[]) => void;
  addNetworkIssue: (issue: NetworkIssue) => void;
  addAlert: (alert: AIAlert) => void;
  acknowledgeAlert: (alertId: string) => void;
  setSessionStatus: (status: MonitoringState["sessionStatus"]) => void;
  setSelectedClass: (cls: string | null) => void;
  setSelectedExam: (exam: string | null) => void;
  setConnectionMode: (mode: "live" | "demo") => void;
  setElapsedSeconds: (s: number) => void;
  reset: () => void;
}

const initial = {
  students: [],
  violations: [],
  networkIssues: [],
  alerts: [],
  sessionStatus: "waiting" as const,
  selectedClass: null,
  selectedExam: null,
  connectionMode: "demo" as const,
  elapsedSeconds: 0,
};

export const useMonitoringStore = create<MonitoringState>()((set) => ({
  ...initial,

  setStudents: (students) => set({ students }),

  updateStudentRisk: (studentId, risk, currentWindow) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              risk,
              currentWindow: currentWindow ?? s.currentWindow,
              status: risk >= 66 ? "violation" : risk >= 31 ? "warning" : "safe",
            }
          : s
      ),
    })),

  addViolation: (violation) =>
    set((state) => ({
      violations: [violation, ...state.violations].slice(0, 200),
    })),

  setViolations: (violations) => set({ violations }),

  addNetworkIssue: (issue) =>
    set((state) => ({
      networkIssues: [issue, ...state.networkIssues].slice(0, 50),
    })),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 100),
    })),

  acknowledgeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    })),

  setSessionStatus: (sessionStatus) => set({ sessionStatus }),
  setSelectedClass: (selectedClass) => set({ selectedClass }),
  setSelectedExam: (selectedExam) => set({ selectedExam }),
  setConnectionMode: (connectionMode) => set({ connectionMode }),
  setElapsedSeconds: (elapsedSeconds) => set({ elapsedSeconds }),
  reset: () => set(initial),
}));
