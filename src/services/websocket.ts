/**
 * LMSGuard AI — WebSocket / Mock Service (TypeScript)
 */
import type { MonitoringStudent, ViolationRecord, NetworkIssue, WSEventMap } from "@/types";

const LIVE_EVENT_POOL = [
  { type:"Browser Switch",      detail:"Chrome tab changed",        severity:"medium"   as const },
  { type:"Application Switch",  detail:"VS Code opened",            severity:"critical" as const },
  { type:"Idle Detected",       detail:"No activity for 5 mins",    severity:"warning"  as const },
  { type:"Multiple Faces",      detail:"Secondary person detected", severity:"critical" as const },
  { type:"Copy/Paste",          detail:"Clipboard activity",        severity:"medium"   as const },
  { type:"Unknown App",         detail:"Terminal opened",           severity:"critical" as const },
  { type:"Screen Capture",      detail:"Screenshot attempt",        severity:"critical" as const },
  { type:"Audio Detected",      detail:"Microphone activity",       severity:"warning"  as const },
];

const NETWORK_POOL = [
  { issue:"Internet Connection Lost", networkStatus:"disconnected" as const },
  { issue:"Weak Network Signal",      networkStatus:"weak"         as const },
  { issue:"Internet Connection Lost", networkStatus:"disconnected" as const },
];

let mockTimer:    ReturnType<typeof setInterval> | null = null;
let networkTimer: ReturnType<typeof setInterval> | null = null;
let isConnected   = false;
let activeClass   = "CSE-3A";

type Listener<K extends keyof WSEventMap> = (data: WSEventMap[K]) => void;
const listeners: Partial<{ [K in keyof WSEventMap]: Listener<K>[] }> = {};

function emit<K extends keyof WSEventMap>(event: K, data: WSEventMap[K]): void {
  const cbs = listeners[event] as Listener<K>[] | undefined;
  cbs?.forEach(cb => { try { cb(data); } catch {} });
}

function ts(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

function stopMock(): void {
  if (mockTimer)    { clearInterval(mockTimer);    mockTimer    = null; }
  if (networkTimer) { clearInterval(networkTimer); networkTimer = null; }
}

function startMock(assignedClass: string): void {
  stopMock();
  activeClass = assignedClass;
  if (typeof window === "undefined") return;

  import("@/data/invigilatorData").then(({ CLASS_STUDENTS, CLASS_VIOLATIONS }) => {
    const students   = (CLASS_STUDENTS   as Record<string, MonitoringStudent[]>)[activeClass]   || [];
    const violations = (CLASS_VIOLATIONS as Record<string, ViolationRecord[]>)[activeClass]     || [];

    setTimeout(() => {
      emit("student_status",  { students, assignedClass: activeClass });
      emit("violations_list", { violations, assignedClass: activeClass });
      emit("connection",      { mode: "demo" });
    }, 500);

    mockTimer = setInterval(() => {
      if (!students.length) return;
      const s = students[Math.floor(Math.random() * students.length)];
      const v = LIVE_EVENT_POOL[Math.floor(Math.random() * LIVE_EVENT_POOL.length)];
      const risk = Math.min(100, (s.risk || 10) + Math.floor(Math.random() * 22));

      emit("violation_detected", {
        id:            `V${Date.now()}`,
        studentId:     s.id,
        studentName:   s.name,
        regno:         s.regno,
        exam:          s.exam,
        assignedClass: activeClass,
        type:          v.type,
        detail:        v.detail,
        severity:      v.severity,
        risk,
        time:          ts(),
        timestamp:     Date.now(),
      });
      emit("screen_update", {
        studentId:     s.id,
        risk,
        currentWindow: v.detail,
        assignedClass: activeClass,
        networkStatus: Math.random() > 0.9 ? "weak" : "stable",
      });
    }, 18000 + Math.random() * 10000);

    networkTimer = setInterval(() => {
      if (!students.length) return;
      const s = students[Math.floor(Math.random() * students.length)];
      const n = NETWORK_POOL[Math.floor(Math.random() * NETWORK_POOL.length)];

      let classLabel = activeClass;
      let examTitle  = "Active Exam";
      try {
        const clsRaw  = sessionStorage.getItem("invSelectedClass");
        const examRaw = sessionStorage.getItem("invSelectedExam");
        if (clsRaw)  classLabel = JSON.parse(clsRaw).label  ?? classLabel;
        if (examRaw) examTitle  = JSON.parse(examRaw).title ?? examTitle;
      } catch {}

      const issue: NetworkIssue = {
        id:            `NI${Date.now()}`,
        studentId:     s.id,
        studentName:   s.name,
        regno:         s.regno,
        classLabel,
        examTitle,
        issue:         n.issue,
        networkStatus: n.networkStatus,
        disconnectedAt:ts(),
        durationMin:   Math.floor(Math.random() * 8) + 1,
        resolved:      false,
        timestamp:     Date.now(),
        assignedClass: activeClass,
      };

      emit("network_issue",  issue);
      emit("network_update", { studentId:s.id, networkStatus:n.networkStatus, assignedClass:activeClass });
    }, 30000 + Math.random() * 20000);
  });
}

export function connectSocket(assignedClass = "CSE-3A", url = "http://localhost:4000"): void {
  activeClass = assignedClass;
  if (typeof window === "undefined") return;

  const fallback = setTimeout(() => { if (!isConnected) startMock(assignedClass); }, 3000);

  import("socket.io-client")
    .then(({ io }) => {
      const s = io(url, { timeout:3000, reconnectionAttempts:2 });
      s.on("connect", () => {
        isConnected = true; clearTimeout(fallback); stopMock();
        s.emit("join_class", { assignedClass });
        emit("connection", { mode:"live" });
      });
      s.on("connect_error", () => { if (!isConnected) startMock(assignedClass); });
      s.on("disconnect",    () => { isConnected = false; startMock(assignedClass); });
      (["student_status","violation_detected","screen_update","violations_list","network_issue","network_update"] as const)
        .forEach(ev => s.on(ev, (data: any) => emit(ev as any, data)));
    })
    .catch(() => startMock(assignedClass));
}

export function disconnectSocket(): void { stopMock(); isConnected = false; }

export function onEvent<K extends keyof WSEventMap>(event: K, cb: Listener<K>): () => void {
  if (!listeners[event]) (listeners as any)[event] = [];
  (listeners[event] as Listener<K>[]).push(cb);
  return () => {
    (listeners as any)[event] = ((listeners[event] as Listener<K>[]) || []).filter(f => f !== cb);
  };
}

export function getMode(): "live" | "demo" { return isConnected ? "live" : "demo"; }

export const MOCK_STUDENTS:   MonitoringStudent[] = [];
export const MOCK_VIOLATIONS: ViolationRecord[]   = [];
