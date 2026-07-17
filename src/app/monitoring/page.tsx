"use client";
import { useState, useMemo, useEffect } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { StudentCard } from "@/components/features/monitoring/StudentCard";
import { AreaChart } from "@/components/features/charts";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_MONITORING_STUDENTS } from "@/mock/students";
import { MOCK_VIOLATIONS, MOCK_AI_ALERTS, MOCK_TIMELINE } from "@/mock/violations";
import { CHART_COLORS } from "@/constants";
import { getRiskInfo } from "@/hooks/useRisk";
import { useClock } from "@/hooks/useClock";
import type { MonitoringStudent } from "@/types";
import {
  Activity, AlertTriangle, Users, Play, Pause,
  Square, LayoutGrid, List, RefreshCw, Download,
  Clock, Shield, Zap, Volume2, XCircle, CheckCheck,
  ChevronDown, Wifi, WifiOff,
} from "lucide-react";

const RISK_OVER_TIME = [
  { name: "10:00", value: 18 }, { name: "10:10", value: 22 },
  { name: "10:20", value: 35 }, { name: "10:30", value: 48 },
  { name: "10:40", value: 62 }, { name: "10:50", value: 55 },
  { name: "11:00", value: 44 },
];

type SessionState = "waiting" | "active" | "paused" | "ended";

/* ── Session Control Bar ── */
function SessionControlBar({
  sessionState, setSessionState, elapsed,
  onlineCount, violationCount,
}: {
  sessionState: SessionState;
  setSessionState: (s: SessionState) => void;
  elapsed: number;
  onlineCount: number;
  violationCount: number;
}) {
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const fmt = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

  return (
    <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-surface border border-white/6 shadow-md">
      <div className="flex items-center gap-5">
        {/* Live badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
          sessionState === "active" ? "bg-success/10 border-success/25" :
          sessionState === "paused" ? "bg-warning/10 border-warning/25" :
          "bg-surface-2 border-white/6"
        }`}>
          <div className={`relative w-2 h-2 ${sessionState === "active" ? "live-dot" : ""}`}>
            {sessionState === "active" && <div className="live-ring" />}
            {sessionState !== "active" && <div className="w-2 h-2 rounded-full bg-text-muted" />}
          </div>
          <span className={`text-[12px] font-semibold ${
            sessionState === "active" ? "text-success" :
            sessionState === "paused" ? "text-warning" : "text-text-muted"
          }`}>
            {sessionState === "active" ? "LIVE" : sessionState === "paused" ? "PAUSED" : sessionState.toUpperCase()}
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[13px] font-semibold font-feature tabular-nums text-text-secondary">{fmt}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Users className="w-3.5 h-3.5 text-success" />
            <span className="text-success font-semibold">{onlineCount}</span> online
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <AlertTriangle className="w-3.5 h-3.5 text-danger" />
            <span className="text-danger font-semibold">{violationCount}</span> violations
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {sessionState === "waiting" && (
          <Button variant="success" icon={<Play className="w-3.5 h-3.5" />} onClick={() => setSessionState("active")}>
            Start Exam
          </Button>
        )}
        {sessionState === "active" && (
          <>
            <Button variant="secondary" size="sm" icon={<Pause className="w-3.5 h-3.5" />} onClick={() => setSessionState("paused")}>Pause</Button>
            <Button variant="danger"    size="sm" icon={<Square className="w-3.5 h-3.5" />} onClick={() => setSessionState("ended")}>End Exam</Button>
          </>
        )}
        {sessionState === "paused" && (
          <>
            <Button variant="success"   size="sm" icon={<Play  className="w-3.5 h-3.5" />} onClick={() => setSessionState("active")}>Resume</Button>
            <Button variant="danger"    size="sm" icon={<Square className="w-3.5 h-3.5" />} onClick={() => setSessionState("ended")}>End Exam</Button>
          </>
        )}
        {sessionState === "ended" && (
          <Badge variant="muted">Session Ended</Badge>
        )}
      </div>
    </div>
  );
}

/* ── Warn Student Modal ── */
function WarnModal({ student, onClose }: { student: MonitoringStudent; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const TEMPLATES = [
    "You have been detected switching tabs. Please focus on the exam.",
    "Unauthorized application detected. Close all non-exam windows immediately.",
    "Multiple faces detected in your camera. Ensure you are alone.",
    "Your clipboard activity has been flagged. Do not copy/paste during the exam.",
  ];
  return (
    <Modal open onClose={onClose} title={`Warn: ${student.name}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-warning/8 border border-warning/20">
          <Avatar name={student.name} size="sm" />
          <div>
            <p className="text-[13px] font-medium text-text-primary">{student.name}</p>
            <p className="text-[12px] text-text-muted">{student.regno} · Risk: {student.risk}%</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[12.5px] font-medium text-text-secondary">Quick Templates</p>
          <div className="space-y-1.5">
            {TEMPLATES.map((t, i) => (
              <button key={i} onClick={() => setMessage(t)}
                className={`w-full text-left p-2.5 rounded-xl text-[12px] border transition-all ${
                  message === t ? "border-warning/40 bg-warning/8 text-warning" : "border-white/5 text-text-muted hover:border-white/10 hover:text-text-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-medium text-text-secondary">Custom Message</label>
          <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
            className="input-premium w-full resize-none" placeholder="Type a custom warning…" />
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" icon={<Volume2 className="w-3.5 h-3.5" />} onClick={onClose}>Send Warning</Button>
      </ModalFooter>
    </Modal>
  );
}

export default function InvigilatorMonitoringPage() {
  const [sessionState, setSessionState] = useState<SessionState>("active");
  const [view,          setView]         = useState<"grid" | "list">("grid");
  const [riskFilter,    setRiskFilter]   = useState("all");
  const [elapsed,       setElapsed]      = useState(3720);
  const [warnStudent,   setWarnStudent]  = useState<MonitoringStudent | null>(null);
  const [detailStudent, setDetailStudent] = useState<MonitoringStudent | null>(null);
  const [activePanel,   setActivePanel]  = useState<"violations" | "alerts" | "timeline">("violations");

  useEffect(() => {
    if (sessionState !== "active") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionState]);

  const students = MOCK_MONITORING_STUDENTS;
  const filtered = useMemo(() => {
    if (riskFilter === "all") return students;
    return students.filter((s) => s.status === riskFilter);
  }, [students, riskFilter]);

  const violations = students.filter((s) => s.status === "violation").length;
  const warnings   = students.filter((s) => s.status === "warning").length;
  const online     = students.filter((s) => s.isOnline).length;
  const offline    = students.filter((s) => !s.isOnline).length;

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-4">
        <PageHeader
          title="Live Monitoring"
          description="DBMS Final Exam · CSE-3A · 20 Students"
          badge={<Badge variant="success" dot>Session Active</Badge>}
          actions={
            <div className="flex items-center gap-2">
              <button className="icon-btn"><RefreshCw className="w-3.5 h-3.5" /></button>
              <button className="icon-btn"><Download  className="w-3.5 h-3.5" /></button>
            </div>
          }
        />

        {/* Session control */}
        <SessionControlBar
          sessionState={sessionState} setSessionState={setSessionState}
          elapsed={elapsed} onlineCount={online} violationCount={violations}
        />

        {/* Risk summary */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Online",    value: online,    color: "text-success", bg: "bg-success/8  border-success/15"   },
            { label: "Warning",   value: warnings,  color: "text-warning", bg: "bg-warning/8  border-warning/15"   },
            { label: "Violation", value: violations,color: "text-danger",  bg: "bg-danger/8   border-danger/15"    },
            { label: "Offline",   value: offline,   color: "text-text-muted", bg: "bg-surface-2 border-white/6"    },
          ].map((s) => (
            <div key={s.label} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${s.bg}`}>
              <span className="text-[12px] text-text-muted">{s.label}</span>
              <span className={`text-[22px] font-bold font-feature ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-4 gap-4">
          {/* Student grid */}
          <div className="col-span-3 space-y-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
                {["all", "safe", "warning", "violation"].map((f) => (
                  <button key={f} onClick={() => setRiskFilter(f)}
                    className={`px-3 py-1 rounded-md text-[11.5px] font-medium capitalize transition-all ${
                      riskFilter === f
                        ? f === "violation" ? "bg-danger text-white" : f === "warning" ? "bg-warning text-black" : f === "safe" ? "bg-success text-black" : "bg-primary text-white"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
                <button onClick={() => setView("grid")} className={`icon-btn w-7 h-7 ${view === "grid" ? "bg-primary/20 text-primary" : ""}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setView("list")} className={`icon-btn w-7 h-7 ${view === "list" ? "bg-primary/20 text-primary" : ""}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="sync">
              <div className={view === "grid" ? "grid grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2"}>
                {filtered.map((student) => (
                  <StudentCard
                    key={student.id} student={student}
                    onView={setDetailStudent}
                    onWarn={setWarnStudent}
                    onEnd={() => {}}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>

          {/* Right panel */}
          <div className="col-span-1 space-y-4">
            {/* Panel tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-white/5">
                {(["violations", "alerts", "timeline"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActivePanel(tab)}
                    className={`flex-1 py-2.5 text-[11px] font-medium capitalize transition-colors relative ${
                      activePanel === tab ? "text-primary" : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {tab}
                    {activePanel === tab && (
                      <motion.div layoutId="inv-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-3 max-h-96 overflow-y-auto no-scrollbar">
                {activePanel === "violations" && (
                  <div className="space-y-2">
                    {MOCK_VIOLATIONS.slice(0, 12).map((v) => (
                      <div key={v.id} className={`p-2.5 rounded-xl border ${
                        v.severity === "critical" ? "bg-danger/5 border-danger/15" : "bg-warning/5 border-warning/10"
                      }`}>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-[12px] font-semibold text-text-primary truncate">{v.studentName}</p>
                          <span className="text-[10.5px] text-text-muted shrink-0">{v.time}</span>
                        </div>
                        <p className="text-[11px] text-text-muted">{v.type}</p>
                        {v.detail && <p className="text-[10.5px] text-text-muted/70 mt-0.5">{v.detail}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {activePanel === "alerts" && (
                  <div className="space-y-2">
                    {MOCK_AI_ALERTS.slice(0, 6).map((alert) => (
                      <div key={alert.id} className={`p-2.5 rounded-xl border ${alert.acknowledged ? "bg-surface-2/30 border-white/5" : "bg-danger/5 border-danger/15"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[12px] font-semibold text-text-primary">{alert.studentName}</p>
                          <span className="text-[10.5px] text-text-muted">{alert.confidence}%</span>
                        </div>
                        <p className="text-[11px] text-text-muted line-clamp-2">{alert.message}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-text-muted/60">{alert.time}</span>
                          <Badge variant={alert.acknowledged ? "success" : "danger"} size="sm">
                            {alert.acknowledged ? "Done" : "Open"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activePanel === "timeline" && (
                  <div className="space-y-0">
                    {MOCK_TIMELINE.slice(0, 8).map((event, i) => (
                      <div key={event.id} className="flex gap-2.5 pb-3 relative">
                        {i < 7 && <div className="absolute left-3 top-5 bottom-0 w-px bg-white/5" />}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold border ${
                          event.type === "warning" ? "bg-danger/10 border-danger/25 text-danger" :
                          event.type === "success" ? "bg-success/10 border-success/25 text-success" :
                          "bg-primary/10 border-primary/25 text-primary"
                        }`}>
                          {event.type === "warning" ? "!" : event.type === "success" ? "✓" : "i"}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-[11.5px] font-medium text-text-primary leading-tight">{event.title}</p>
                            <span className="text-[10px] text-text-muted shrink-0">{event.time}</span>
                          </div>
                          <p className="text-[10.5px] text-text-muted mt-0.5 leading-snug">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Risk chart */}
            <div className="card p-4">
              <p className="text-[12px] font-semibold text-text-primary mb-3">Risk Over Time</p>
              <AreaChart data={RISK_OVER_TIME} color={CHART_COLORS.warning} height={100} showGrid={false} />
            </div>

            {/* High-risk roster */}
            <div className="card p-4">
              <p className="text-[12px] font-semibold text-text-primary mb-3">High Risk Students</p>
              <div className="space-y-2">
                {students
                  .filter((s) => s.risk >= 60)
                  .sort((a, b) => b.risk - a.risk)
                  .slice(0, 5)
                  .map((s) => {
                    const risk = getRiskInfo(s.risk);
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <Avatar name={s.name} size="xs" online={s.isOnline} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11.5px] font-medium text-text-primary truncate">{s.name}</p>
                          <div className="w-full bg-surface-3 rounded-full h-1 mt-0.5">
                            <div className={`h-1 rounded-full ${risk.barClass}`} style={{ width: `${s.risk}%` }} />
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold font-feature shrink-0" style={{ color: risk.color }}>{s.risk}%</span>
                        <button onClick={() => setWarnStudent(s)} className="icon-btn w-6 h-6 shrink-0">
                          <Volume2 className="w-3 h-3 text-warning" />
                        </button>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {warnStudent    && <WarnModal   student={warnStudent}    onClose={() => setWarnStudent(null)}    />}
    </AppShell>
  );
}
