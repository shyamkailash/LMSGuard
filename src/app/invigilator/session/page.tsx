"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { StudentCard } from "@/components/features/monitoring/StudentCard";
import { AreaChart } from "@/components/features/charts";
import {
  Play, Pause, Square, Users, AlertTriangle, Clock,
  Shield, Key, Copy, CheckCircle2, XCircle, Volume2,
  Download, RefreshCw, Activity, LayoutGrid, List,
  ChevronRight, Wifi, WifiOff,
} from "lucide-react";
import { MOCK_SESSION_INFO, MOCK_SESSION_ALERTS } from "@/data/invigilatorData";
import { MOCK_MONITORING_STUDENTS } from "@/mock/students";
import { MOCK_VIOLATIONS, MOCK_TIMELINE } from "@/mock/violations";
import { CHART_COLORS } from "@/constants";
import { getRiskInfo } from "@/hooks/useRisk";
import type { MonitoringStudent } from "@/types";
import { cn } from "@/lib/utils";

type State = "active" | "paused" | "ended";

const RISK_TREND = [
  { name:"10:00",value:12 },{ name:"10:15",value:22 },{ name:"10:30",value:38 },
  { name:"10:45",value:52 },{ name:"11:00",value:44 },{ name:"11:15",value:61 },
  { name:"11:30",value:48 },
];

/* ── Session Token Card ───────────────────────────── */
function TokenCard({ session }: { session: typeof MOCK_SESSION_INFO }) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="card p-4 space-y-3">
      <p className="text-[11.5px] font-semibold text-text-muted uppercase tracking-wide">Session Token</p>
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2/80 border border-white/6">
        <Key className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="flex-1 font-mono text-[12.5px] text-text-primary tracking-wider">{session.token}</span>
        <button onClick={() => copy(session.token)} className="icon-btn w-6 h-6">
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2/80 border border-white/6">
        <Shield className="w-3.5 h-3.5 text-warning shrink-0" />
        <span className="flex-1 font-mono text-[13px] font-bold text-warning tracking-widest">{session.passcode}</span>
        <button onClick={() => copy(session.passcode)} className="icon-btn w-6 h-6">
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11.5px]">
        {[
          { label:"Approved", value:session.approved, color:"text-success" },
          { label:"Waiting",  value:session.waiting,  color:"text-warning" },
          { label:"Blocked",  value:session.blocked,  color:"text-danger"  },
          { label:"Total",    value:session.totalStudents, color:"text-text-primary" },
        ].map((s) => (
          <div key={s.label} className="flex justify-between px-2.5 py-1.5 rounded-lg bg-surface-2/60">
            <span className="text-text-muted">{s.label}</span>
            <span className={cn("font-bold font-feature", s.color)}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Warn Student Modal ───────────────────────────── */
function WarnModal({ student, onClose }: { student: MonitoringStudent; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const TEMPLATES = [
    "You have been detected switching tabs. Focus on the exam.",
    "Unauthorized application detected. Close it immediately.",
    "Multiple faces in camera. Ensure you are alone.",
    "Clipboard activity detected. Stop copy/paste operations.",
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
          {TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => setMsg(t)}
              className={cn("w-full text-left p-2.5 rounded-xl text-[12px] border transition-all",
                msg === t ? "border-warning/40 bg-warning/8 text-warning" : "border-white/5 text-text-muted hover:border-white/10"
              )}
            >{t}</button>
          ))}
        </div>
        <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)}
          className="input-premium w-full resize-none" placeholder="Custom message…" />
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" icon={<Volume2 className="w-3.5 h-3.5" />} onClick={onClose}>Send Warning</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ── Pause Dialog ─────────────────────────────────── */
function PauseDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [reason, setReason] = useState("");
  const REASONS = ["Technical issue", "Announcement to students", "Bathroom break", "Other"];
  return (
    <Modal open onClose={onCancel} title="Pause Exam Session" size="sm">
      <div className="space-y-4">
        <p className="text-[13px] text-text-muted">Select a reason for pausing the session. Students will see a pause notification.</p>
        <div className="space-y-2">
          {REASONS.map((r) => (
            <button key={r} onClick={() => setReason(r)}
              className={cn("w-full text-left p-3 rounded-xl border text-[13px] transition-all",
                reason === r ? "border-warning/40 bg-warning/8 text-warning" : "border-white/6 text-text-secondary hover:border-white/12"
              )}
            >{r}</button>
          ))}
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="secondary" icon={<Pause className="w-3.5 h-3.5" />} onClick={onConfirm}>Pause Session</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ── End Exam Dialog ──────────────────────────────── */
function EndDialog({ stats, onConfirm, onCancel }: {
  stats: { online: number; violations: number; elapsed: string };
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal open onClose={onCancel} title="End Exam Session" size="md">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-danger/8 border border-danger/20 space-y-3">
          <p className="text-[13px] font-semibold text-text-primary">Session Summary</p>
          {[
            { label:"Duration",       value:stats.elapsed            },
            { label:"Students Online",value:stats.online             },
            { label:"Total Violations",value:stats.violations        },
          ].map((f) => (
            <div key={f.label} className="flex justify-between text-[13px]">
              <span className="text-text-muted">{f.label}</span>
              <span className="font-semibold text-text-primary">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-warning/8 border border-warning/20">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-text-secondary">
            Ending the session will lock all students out. This action cannot be undone.
          </p>
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" icon={<Square className="w-3.5 h-3.5" />} onClick={onConfirm}>End Session</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function SessionPage() {
  const router = useRouter();
  const [state,      setState]      = useState<State>("active");
  const [elapsed,    setElapsed]    = useState(3720);
  const [riskFilter, setRiskFilter] = useState("all");
  const [view,       setView]       = useState<"grid"|"list">("grid");
  const [panel,      setPanel]      = useState<"alerts"|"violations"|"timeline">("alerts");
  const [warnStu,    setWarnStu]    = useState<MonitoringStudent | null>(null);
  const [showPause,  setShowPause]  = useState(false);
  const [showEnd,    setShowEnd]    = useState(false);

  useEffect(() => {
    if (state !== "active") return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  const h = Math.floor(elapsed/3600);
  const m = Math.floor((elapsed%3600)/60);
  const s = elapsed%60;
  const elapsedStr = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

  const students = MOCK_MONITORING_STUDENTS;
  const filtered = useMemo(() =>
    riskFilter === "all" ? students : students.filter((st) => st.status === riskFilter),
  [students, riskFilter]);

  const online     = students.filter((st) => st.isOnline).length;
  const violations = students.filter((st) => st.status === "violation").length;
  const warnings   = students.filter((st) => st.status === "warning").length;

  const unackAlerts = MOCK_SESSION_ALERTS.filter((a) => !a.acknowledged);

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-4">
        <PageHeader
          title={MOCK_SESSION_INFO.examTitle}
          description={`${MOCK_SESSION_INFO.classLabel} · Session ${MOCK_SESSION_INFO.id}`}
          badge={
            state === "active" ? <Badge variant="success" dot>LIVE</Badge> :
            state === "paused" ? <Badge variant="warning" dot>Paused</Badge> :
            <Badge variant="muted">Ended</Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} />
              <Button variant="ghost" size="sm" icon={<Download  className="w-3.5 h-3.5" />}>Export</Button>
            </div>
          }
        />

        {/* Control bar */}
        <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-surface border border-white/6">
          <div className="flex items-center gap-5">
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border",
              state === "active" ? "bg-success/10 border-success/25" :
              state === "paused" ? "bg-warning/10 border-warning/25" : "bg-surface-2 border-white/6"
            )}>
              {state === "active" && <span className="live-dot relative"><span className="live-ring" /></span>}
              {state !== "active" && <span className={`w-2 h-2 rounded-full ${state === "paused" ? "bg-warning" : "bg-text-muted"}`} />}
              <span className={cn("text-[12px] font-semibold",
                state === "active" ? "text-success" : state === "paused" ? "text-warning" : "text-text-muted"
              )}>
                {state === "active" ? "LIVE" : state === "paused" ? "PAUSED" : "ENDED"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold font-feature tabular-nums text-text-secondary">
              <Clock className="w-3.5 h-3.5 text-text-muted" />{elapsedStr}
            </div>
            <div className="flex items-center gap-4 text-[12px] text-text-muted">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-success" />
                <span className="text-success font-semibold">{online}</span> online
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                <span className="text-danger font-semibold">{violations}</span> violations
              </span>
              {unackAlerts.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-warning" />
                  <span className="text-warning font-semibold">{unackAlerts.length}</span> alerts
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {state === "active" && (
              <>
                <Button variant="secondary" size="sm" icon={<Pause className="w-3.5 h-3.5" />} onClick={() => setShowPause(true)}>Pause</Button>
                <Button variant="danger"    size="sm" icon={<Square className="w-3.5 h-3.5" />} onClick={() => setShowEnd(true)}>End Exam</Button>
              </>
            )}
            {state === "paused" && (
              <>
                <Button variant="success"  size="sm" icon={<Play  className="w-3.5 h-3.5" />} onClick={() => setState("active")}>Resume</Button>
                <Button variant="danger"   size="sm" icon={<Square className="w-3.5 h-3.5" />} onClick={() => setShowEnd(true)}>End Exam</Button>
              </>
            )}
            {state === "ended" && <Badge variant="muted">Session Ended</Badge>}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label:"Online",    value:online,    color:"text-success", bg:"bg-success/8 border-success/15" },
            { label:"Warning",   value:warnings,  color:"text-warning", bg:"bg-warning/8 border-warning/15" },
            { label:"Violation", value:violations,color:"text-danger",  bg:"bg-danger/8  border-danger/15"  },
            { label:"Offline",   value:students.filter((st)=>!st.isOnline).length, color:"text-text-muted", bg:"bg-surface-2 border-white/6" },
          ].map((st) => (
            <div key={st.label} className={cn("flex items-center justify-between px-4 py-3 rounded-xl border", st.bg)}>
              <span className="text-[12px] text-text-muted">{st.label}</span>
              <span className={cn("text-[22px] font-bold font-feature", st.color)}>{st.value}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Students */}
          <div className="col-span-3 space-y-3">
            {/* Token info */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-2/60 border border-white/5 text-[12.5px]">
              <span className="text-text-muted">Passcode:</span>
              <span className="font-mono font-bold text-warning tracking-widest">{MOCK_SESSION_INFO.passcode}</span>
              <span className="text-text-muted">Token:</span>
              <span className="font-mono text-[11.5px] text-text-secondary">{MOCK_SESSION_INFO.token}</span>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
                {["all","safe","warning","violation"].map((f) => (
                  <button key={f} onClick={() => setRiskFilter(f)}
                    className={cn("px-3 py-1 rounded-md text-[11.5px] font-medium capitalize transition-all",
                      riskFilter === f
                        ? f==="violation" ? "bg-danger text-white" : f==="warning" ? "bg-warning/80 text-black" : f==="safe" ? "bg-success/80 text-black" : "bg-primary text-white"
                        : "text-text-muted hover:text-text-secondary"
                    )}
                  >{f}</button>
                ))}
              </div>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
                <button onClick={() => setView("grid")} className={cn("icon-btn w-7 h-7", view==="grid" && "bg-primary/20 text-primary")}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setView("list")} className={cn("icon-btn w-7 h-7", view==="list" && "bg-primary/20 text-primary")}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="sync">
              <div className={view === "grid" ? "grid grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2"}>
                {filtered.map((stu) => (
                  <StudentCard
                    key={stu.id} student={stu}
                    onView={(st) => router.push(`/invigilator/student-detail?id=${st.id}`)}
                    onWarn={setWarnStu}
                    onEnd={() => {}}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>

          {/* Side panel */}
          <div className="col-span-1 space-y-4">
            <TokenCard session={MOCK_SESSION_INFO} />

            <div className="card overflow-hidden">
              <div className="flex border-b border-white/5">
                {(["alerts","violations","timeline"] as const).map((tab) => (
                  <button key={tab} onClick={() => setPanel(tab)}
                    className={cn("flex-1 py-2.5 text-[11px] font-medium capitalize transition-colors relative",
                      panel===tab ? "text-primary" : "text-text-muted hover:text-text-secondary"
                    )}
                  >
                    {tab}
                    {tab==="alerts" && unackAlerts.length>0 && (
                      <span className="ml-1 px-1 py-0.5 rounded bg-danger text-[9px] font-bold text-white">{unackAlerts.length}</span>
                    )}
                    {panel===tab && <motion.div layoutId="sess-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>
                ))}
              </div>
              <div className="p-3 max-h-80 overflow-y-auto no-scrollbar">
                {panel === "alerts" && (
                  <div className="space-y-2">
                    {MOCK_SESSION_ALERTS.map((a) => (
                      <div key={a.id} className={cn("p-2.5 rounded-xl border",
                        a.acknowledged ? "bg-surface-2/30 border-white/5" :
                        a.severity==="critical" ? "bg-danger/5 border-danger/15" : "bg-warning/5 border-warning/10"
                      )}>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-[12px] font-semibold text-text-primary truncate">{a.studentName}</p>
                          <span className={cn("text-[10px] font-bold shrink-0",
                            a.severity==="critical" ? "text-danger" : a.severity==="high" ? "text-orange-400" : "text-warning"
                          )}>{a.risk}%</span>
                        </div>
                        <p className="text-[11px] text-text-muted capitalize">{a.type.replace("_"," ")}</p>
                        <p className="text-[10.5px] text-text-muted/70 mt-0.5 line-clamp-1">{a.detail}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-text-subtle">{a.time}</span>
                          <Badge variant={a.acknowledged ? "success" : "danger"} size="sm">
                            {a.acknowledged ? "Done" : "Open"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {panel === "violations" && (
                  <div className="space-y-2">
                    {MOCK_VIOLATIONS.slice(0,12).map((v) => (
                      <div key={v.id} className={cn("p-2.5 rounded-xl border",
                        v.severity==="critical" ? "bg-danger/5 border-danger/15" : "bg-warning/5 border-warning/10"
                      )}>
                        <div className="flex justify-between gap-1 mb-0.5">
                          <p className="text-[12px] font-semibold text-text-primary truncate">{v.studentName}</p>
                          <span className="text-[10.5px] text-text-muted shrink-0">{v.time}</span>
                        </div>
                        <p className="text-[11px] text-text-muted">{v.type}</p>
                      </div>
                    ))}
                  </div>
                )}
                {panel === "timeline" && (
                  <div className="space-y-0">
                    {MOCK_TIMELINE.slice(0,10).map((ev,i) => (
                      <div key={ev.id} className="flex gap-2.5 pb-3 relative">
                        {i<9 && <div className="absolute left-3 top-5 bottom-0 w-px bg-white/5" />}
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold border",
                          ev.type==="warning" ? "bg-danger/10 border-danger/25 text-danger" :
                          ev.type==="success" ? "bg-success/10 border-success/25 text-success" :
                          "bg-primary/10 border-primary/25 text-primary"
                        )}>
                          {ev.type==="warning"?"!":ev.type==="success"?"✓":"i"}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-[11.5px] font-medium text-text-primary leading-tight">{ev.title}</p>
                            <span className="text-[10px] text-text-muted shrink-0">{ev.time}</span>
                          </div>
                          <p className="text-[10.5px] text-text-muted mt-0.5 leading-snug">{ev.description}</p>
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
              <AreaChart data={RISK_TREND} color={CHART_COLORS.warning} height={100} showGrid={false} />
            </div>

            {/* High-risk list */}
            <div className="card p-4">
              <p className="text-[12px] font-semibold text-text-primary mb-3">High Risk Students</p>
              <div className="space-y-2">
                {students.filter((st)=>st.risk>=60).sort((a,b)=>b.risk-a.risk).slice(0,5).map((st) => {
                  const risk = getRiskInfo(st.risk);
                  return (
                    <div key={st.id} className="flex items-center gap-2">
                      <Avatar name={st.name} size="xs" online={st.isOnline} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-medium text-text-primary truncate">{st.name}</p>
                        <div className="w-full bg-surface-3 rounded-full h-1 mt-0.5">
                          <div className={`h-1 rounded-full ${risk.barClass}`} style={{width:`${st.risk}%`}} />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold font-feature shrink-0" style={{color:risk.color}}>{st.risk}%</span>
                      <button onClick={() => setWarnStu(st)} className="icon-btn w-6 h-6 shrink-0">
                        <Volume2 className="w-3 h-3 text-warning" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {warnStu   && <WarnModal  student={warnStu}   onClose={() => setWarnStu(null)} />}
      {showPause && <PauseDialog onConfirm={() => { setState("paused"); setShowPause(false); }} onCancel={() => setShowPause(false)} />}
      {showEnd   && (
        <EndDialog
          stats={{ online, violations, elapsed: elapsedStr }}
          onConfirm={() => { setState("ended"); setShowEnd(false); router.push("/invigilator/session-summary"); }}
          onCancel={() => setShowEnd(false)}
        />
      )}
    </AppShell>
  );
}
