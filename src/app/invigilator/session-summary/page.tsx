"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, StatCard } from "@/components/ui";
import { DonutChart, AreaChart } from "@/components/features/charts";
import {
  CheckCircle2, Download, Home, AlertTriangle, Users,
  Clock, Shield, Trophy, FileText,
} from "lucide-react";
import { MOCK_SESSION_INFO } from "@/data/invigilatorData";
import { MOCK_WAITING_STUDENTS } from "@/data/invigilatorData";
import { MOCK_VIOLATIONS, MOCK_TIMELINE } from "@/mock/violations";
import { CHART_COLORS } from "@/constants";

const RISK_DATA = [
  { name:"10:00",value:12 },{ name:"10:15",value:22 },{ name:"10:30",value:38 },
  { name:"10:45",value:52 },{ name:"11:00",value:44 },{ name:"11:15",value:61 },
  { name:"11:30",value:48 },{ name:"11:45",value:35 },{ name:"12:00",value:20 },
];

const SEVERITY_DATA = [
  { name:"Critical", value: 5 },
  { name:"High",     value: 3 },
  { name:"Medium",   value: 7 },
  { name:"Low",      value: 3 },
];

export default function SessionSummaryPage() {
  const router   = useRouter();
  const session  = MOCK_SESSION_INFO;
  const students = MOCK_WAITING_STUDENTS;
  const violations = MOCK_VIOLATIONS.filter((v) => v.assignedClass === "CSE-3A");

  const approved = students.filter((s) => s.permissionStatus === "approved").length;
  const rejected = students.filter((s) => s.permissionStatus === "rejected").length;
  const critical = violations.filter((v) => v.severity === "critical").length;

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Session Summary"
          description={`${session.examTitle} · ${session.classLabel}`}
          badge={<Badge variant="muted">Session Ended</Badge>}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export Report</Button>
              <Button variant="primary"   icon={<Home className="w-3.5 h-3.5" />} onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          }
        />

        {/* Success banner */}
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-4 p-5 rounded-2xl bg-success/8 border border-success/25"
        >
          <div className="w-12 h-12 rounded-2xl bg-success/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-text-primary">Exam Session Completed</p>
            <p className="text-[13px] text-text-muted mt-0.5">
              {session.examTitle} · {session.classLabel} · {session.duration} minutes
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] text-text-muted">Started</p>
              <p className="text-[13px] font-semibold text-text-primary">{session.startedAt}</p>
            </div>
            <div className="w-px h-8 bg-white/8" />
            <div className="text-right">
              <p className="text-[11px] text-text-muted">Invigilator</p>
              <p className="text-[13px] font-semibold text-text-primary">{session.invigilator}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total Students" value={students.length} icon={<Users         className="w-4 h-4" />} color="primary"  />
          <StatCard index={1} label="Appeared"       value={approved}        icon={<CheckCircle2  className="w-4 h-4" />} color="success"  delta={`${Math.round((approved/students.length)*100)}%`} deltaType="up" />
          <StatCard index={2} label="Total Violations" value={violations.length} icon={<AlertTriangle className="w-4 h-4" />} color="warning" />
          <StatCard index={3} label="Critical Cases"   value={critical}      icon={<Shield        className="w-4 h-4" />} color="danger"   />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="section-title mb-1">Risk Over Session</p>
            <p className="section-subtitle mb-4">Average risk score timeline</p>
            <AreaChart data={RISK_DATA} color={CHART_COLORS.warning} height={160} />
          </div>
          <div className="card p-5">
            <p className="section-title mb-1">Violation Severity</p>
            <p className="section-subtitle mb-4">Distribution by severity level</p>
            <DonutChart
              data={SEVERITY_DATA.map((d, i) => ({
                ...d,
                color: [CHART_COLORS.danger, CHART_COLORS.orange, CHART_COLORS.warning, CHART_COLORS.axis][i],
              }))}
              height={160}
              centerValue={violations.length}
              centerLabel="Total"
            />
          </div>
          <div className="card p-5">
            <p className="section-title mb-1">Session Overview</p>
            <p className="section-subtitle mb-4">Key session metrics</p>
            <div className="space-y-3 mt-2">
              {[
                { label:"Session ID",    value:session.id,             icon:FileText     },
                { label:"Duration",      value:`${session.duration} min`, icon:Clock     },
                { label:"Passcode Used", value:session.passcode,       icon:Shield       },
                { label:"Approved",      value:`${approved} / ${students.length}`, icon:CheckCircle2 },
                { label:"Rejected",      value:rejected,               icon:AlertTriangle },
                { label:"Violations",    value:violations.length,      icon:AlertTriangle },
              ].map((f) => {
                const FIcon = f.icon;
                return (
                  <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2 text-[12.5px] text-text-muted">
                      <FIcon className="w-3.5 h-3.5" />{f.label}
                    </div>
                    <span className="text-[12.5px] font-semibold text-text-secondary">{f.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card p-5">
          <p className="section-title mb-4">Session Timeline</p>
          <div className="space-y-0">
            {MOCK_TIMELINE.map((ev, i) => (
              <div key={ev.id} className="flex gap-3 pb-4 relative">
                {i < MOCK_TIMELINE.length - 1 && (
                  <div className="absolute left-3 top-6 bottom-0 w-px bg-white/6" />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[9px] font-bold border mt-0.5 ${
                  ev.type === "warning" ? "bg-danger/10 border-danger/25 text-danger" :
                  ev.type === "success" ? "bg-success/10 border-success/25 text-success" :
                  ev.type === "system"  ? "bg-violet-500/10 border-violet-500/25 text-violet-400" :
                  "bg-primary/10 border-primary/25 text-primary"
                }`}>
                  {ev.type === "warning" ? "!" : ev.type === "success" ? "✓" : "i"}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-medium text-text-primary">{ev.title}</p>
                    <span className="text-[11.5px] text-text-muted shrink-0">{ev.time}</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-0.5">{ev.description}</p>
                  {ev.student && (
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                      {ev.student} · {ev.regno}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-risk students */}
        <div className="card p-5">
          <p className="section-title mb-4">Flagged Students</p>
          <div className="divide-y divide-white/5">
            {students.filter((s) => s.risk >= 50).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-danger/15 flex items-center justify-center text-[11px] font-bold text-danger">
                    {s.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{s.name}</p>
                    <p className="text-[11.5px] text-text-muted">{s.regno} · {s.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-danger rounded-full" style={{ width: `${s.risk}%` }} />
                  </div>
                  <span className="text-[13px] font-bold font-feature text-danger w-12 text-right">{s.risk}%</span>
                  <Badge variant={s.permissionStatus === "approved" ? "success" : "danger"} size="sm">
                    {s.permissionStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
