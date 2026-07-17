"use client";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter } from "@/components/ui";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { Avatar } from "@/components/ui/Avatar";
import { StudentCard } from "@/components/features/monitoring/StudentCard";
import { AreaChart } from "@/components/features/charts";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_MONITORING_STUDENTS } from "@/mock/students";
import { MOCK_VIOLATIONS, MOCK_AI_ALERTS, MOCK_TIMELINE } from "@/mock/violations";
import { MOCK_SESSIONS } from "@/mock/invigilators";
import { VIOLATION_TREND_DATA } from "@/mock/exams";
import { CHART_COLORS } from "@/constants";
import { getRiskInfo } from "@/hooks/useRisk";
import type { MonitoringStudent } from "@/types";
import {
  Activity, AlertTriangle, Users, Wifi, WifiOff,
  LayoutGrid, List, Filter, RefreshCw, Download,
  ChevronDown, Clock, Shield, TrendingUp, Eye,
  CheckCircle, Circle, Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/* ── Toolbar ── */
function MonitoringToolbar({
  view, setView, filter, setFilter, studentCount, violationCount,
}: {
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
  filter: string;
  setFilter: (f: string) => void;
  studentCount: number;
  violationCount: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Left: live indicator + stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20">
          <div className="relative flex items-center justify-center w-3 h-3">
            <div className="live-dot" />
            <div className="live-ring" />
          </div>
          <span className="text-[12px] font-semibold text-success">LIVE</span>
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Users className="w-3.5 h-3.5" />
            <span className="text-text-secondary font-medium font-feature">{studentCount}</span> online
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <AlertTriangle className="w-3.5 h-3.5 text-danger" />
            <span className="text-danger font-medium font-feature">{violationCount}</span> alerts
          </span>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Risk filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
          {["all", "safe", "warning", "violation"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-[11.5px] font-medium capitalize transition-all ${
                filter === f
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
        <button className="icon-btn"><RefreshCw className="w-3.5 h-3.5" /></button>
        <button className="icon-btn"><Download className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

/* ── Student Detail Drawer ── */
function StudentDetailModal({ student, onClose }: { student: MonitoringStudent; onClose: () => void }) {
  const risk = getRiskInfo(student.risk);
  return (
    <Modal open onClose={onClose} title="Student Monitor" size="lg">
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name={student.name} size="lg" online={student.isOnline} />
            <div>
              <p className="text-[14px] font-semibold text-text-primary">{student.name}</p>
              <p className="text-[12px] text-text-muted">{student.regno} · {student.dept}</p>
              <Badge variant={student.status === "violation" ? "danger" : student.status === "warning" ? "warning" : "success"} dot size="sm" className="mt-1">
                {student.status}
              </Badge>
            </div>
          </div>
          <RiskMeter score={student.risk} size="lg" />
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Network",   value: student.networkStatus, color: student.networkStatus === "stable" ? "#4ADE80" : "#F87171" },
              { label: "Tabs",      value: `${student.tabCount ?? 1} open`,   color: (student.tabCount ?? 1) > 1 ? "#FCD34D" : "#4ADE80" },
              { label: "Clipboard", value: student.clipboardActive ? "Active" : "Clear", color: student.clipboardActive ? "#FCD34D" : "#4ADE80" },
              { label: "Duration",  value: `${student.examDuration ?? 0}m`,  color: "#9CA3AF" },
            ].map((item) => (
              <div key={item.label} className="p-2.5 rounded-xl bg-surface-2/60">
                <p className="text-[10px] text-text-muted uppercase tracking-wide">{item.label}</p>
                <p className="text-[12.5px] font-semibold mt-0.5" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 space-y-4">
          <div>
            <p className="text-[12px] text-text-muted uppercase tracking-wide font-medium mb-2">Violation Timeline</p>
            {student.violations.length === 0 ? (
              <div className="flex items-center gap-2 py-4 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[13px]">No violations recorded</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                {student.violations.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      v.severity === "critical" ? "bg-danger" : v.severity === "medium" ? "bg-warning" : "bg-text-muted"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12.5px] font-medium text-text-primary">{v.type}</p>
                        <span className="text-[11px] text-text-muted">{v.time}</span>
                      </div>
                      {v.detail && <p className="text-[11.5px] text-text-muted mt-0.5">{v.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {student.runningApps && student.runningApps.length > 0 && (
            <div>
              <p className="text-[12px] text-text-muted uppercase tracking-wide font-medium mb-2">Running Applications</p>
              <div className="flex flex-wrap gap-2">
                {student.runningApps.map((app) => (
                  <span key={app} className="px-2.5 py-1 rounded-lg bg-danger/10 border border-danger/20 text-[11.5px] text-danger">{app}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="danger"   icon={<AlertTriangle className="w-3.5 h-3.5" />}>Warn Student</Button>
        <Button variant="secondary" icon={<Shield className="w-3.5 h-3.5" />}>End Exam</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ── Timeline Panel ── */
function TimelinePanel() {
  return (
    <div className="space-y-0">
      {MOCK_TIMELINE.map((event, i) => (
        <div key={event.id} className="flex gap-3 pb-4 relative">
          {i < MOCK_TIMELINE.length - 1 && (
            <div className="absolute left-3.5 top-6 bottom-0 w-px bg-white/6" />
          )}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold border ${
            event.type === "warning"  ? "bg-danger/10  border-danger/25  text-danger" :
            event.type === "success"  ? "bg-success/10 border-success/25 text-success" :
            event.type === "system"   ? "bg-purple/10  border-purple/25  text-purple" :
            "bg-primary/10 border-primary/25 text-primary"
          }`}>
            {event.type === "warning" ? "!" : event.type === "success" ? "✓" : event.type === "system" ? "⚡" : "i"}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12.5px] font-medium text-text-primary">{event.title}</p>
              <span className="text-[10.5px] text-text-muted shrink-0">{event.time}</span>
            </div>
            <p className="text-[11.5px] text-text-muted mt-0.5">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminMonitoringPage() {
  const [view,          setView]     = useState<"grid" | "list">("grid");
  const [filter,        setFilter]   = useState("all");
  const [activeTab,     setActiveTab] = useState<"students" | "alerts" | "timeline">("students");
  const [detailStudent, setDetail]   = useState<MonitoringStudent | null>(null);

  const students = MOCK_MONITORING_STUDENTS;

  const filtered = useMemo(() => {
    if (filter === "all") return students;
    return students.filter((s) => s.status === filter);
  }, [filter, students]);

  const violations  = students.filter((s) => s.status === "violation").length;
  const warnings    = students.filter((s) => s.status === "warning").length;
  const safe        = students.filter((s) => s.status === "safe").length;
  const offline     = students.filter((s) => !s.isOnline).length;
  const unackAlerts = MOCK_AI_ALERTS.filter((a) => !a.acknowledged).length;

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-5">
        <PageHeader
          title="Live Monitoring"
          description="Real-time examination session overview"
          badge={<Badge variant="success" dot>4 Active Sessions</Badge>}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>Sessions</Button>
              <Button variant="danger"    size="sm" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                {unackAlerts} Alerts
              </Button>
            </div>
          }
        />

        {/* Risk summary strip */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Online",     value: students.filter((s) => s.isOnline).length, color: "text-success", bg: "bg-success/8  border-success/15"  },
            { label: "Safe",       value: safe,       color: "text-success", bg: "bg-success/8  border-success/15"  },
            { label: "Warning",    value: warnings,   color: "text-warning", bg: "bg-warning/8  border-warning/15"  },
            { label: "Violation",  value: violations, color: "text-danger",  bg: "bg-danger/8   border-danger/15"   },
            { label: "Offline",    value: offline,    color: "text-text-muted", bg: "bg-surface-2 border-white/6"   },
          ].map((s) => (
            <div key={s.label} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${s.bg}`}>
              <span className="text-[12px] text-text-muted">{s.label}</span>
              <span className={`text-[22px] font-bold font-feature ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-4 gap-4">
          {/* Student grid — 3 cols */}
          <div className="col-span-3 space-y-4">
            <MonitoringToolbar
              view={view} setView={setView}
              filter={filter} setFilter={setFilter}
              studentCount={students.filter((s) => s.isOnline).length}
              violationCount={violations}
            />

            <AnimatePresence mode="sync">
              <div className={view === "grid"
                ? "grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
                : "space-y-2"
              }>
                {filtered.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onView={setDetail}
                    onWarn={() => {}}
                    onEnd={() => {}}
                    compact={view === "list"}
                  />
                ))}
              </div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 text-text-muted gap-2">
                <Users className="w-10 h-10 opacity-30" />
                <p className="text-[14px]">No students match the current filter</p>
              </div>
            )}
          </div>

          {/* Right panel — 1 col */}
          <div className="col-span-1 space-y-4">
            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-white/5">
                {(["students", "alerts", "timeline"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-[11.5px] font-medium capitalize transition-colors relative ${
                      activeTab === tab ? "text-primary" : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {tab}
                    {tab === "alerts" && unackAlerts > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-danger text-white text-[9px] font-bold">{unackAlerts}</span>
                    )}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 max-h-[520px] overflow-y-auto no-scrollbar">
                {activeTab === "students" && (
                  <div className="space-y-2">
                    {students
                      .sort((a, b) => b.risk - a.risk)
                      .slice(0, 10)
                      .map((s) => {
                        const risk = getRiskInfo(s.risk);
                        return (
                          <button
                            key={s.id}
                            onClick={() => setDetail(s)}
                            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-2/60 transition-colors text-left"
                          >
                            <Avatar name={s.name} size="sm" online={s.isOnline} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-text-primary truncate">{s.name}</p>
                              <div className="w-full bg-surface-3 rounded-full h-1 mt-1">
                                <div className={`h-1 rounded-full ${risk.barClass}`} style={{ width: `${s.risk}%` }} />
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold shrink-0 font-feature" style={{ color: risk.color }}>{s.risk}%</span>
                          </button>
                        );
                      })}
                  </div>
                )}

                {activeTab === "alerts" && (
                  <div className="space-y-2">
                    {MOCK_AI_ALERTS.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-xl border ${
                        alert.acknowledged ? "bg-surface-2/30 border-white/5" : "bg-danger/5 border-danger/15"
                      }`}>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="text-[12px] font-semibold text-text-primary truncate">{alert.studentName}</p>
                          <Badge variant={alert.acknowledged ? "muted" : "danger"} size="sm">
                            {alert.acknowledged ? "Done" : "Open"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-text-muted line-clamp-2">{alert.message}</p>
                        <p className="text-[10.5px] text-text-muted/60 mt-1">{alert.time} · {alert.confidence}% confidence</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "timeline" && <TimelinePanel />}
              </div>
            </div>

            {/* Mini chart */}
            <div className="card p-4">
              <p className="text-[12px] font-semibold text-text-primary mb-3">Violation Trend</p>
              <AreaChart data={VIOLATION_TREND_DATA} color={CHART_COLORS.danger} height={100} showGrid={false} />
            </div>
          </div>
        </div>
      </div>

      {detailStudent && (
        <StudentDetailModal student={detailStudent} onClose={() => setDetail(null)} />
      )}
    </AppShell>
  );
}
