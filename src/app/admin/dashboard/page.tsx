"use client";
import { AppShell, PageHeader } from "@/components/layouts";
import { StatCard, Badge } from "@/components/ui";
import { AreaChart, BarChartComponent, DonutChart } from "@/components/features/charts";
import { motion } from "framer-motion";
import { MOCK_SYSTEM_STATS, MOCK_SESSIONS } from "@/mock/invigilators";
import { MOCK_VIOLATIONS, MOCK_AI_ALERTS } from "@/mock/violations";
import { MOCK_EXAMS, EXAM_TREND_DATA, VIOLATION_TREND_DATA, RISK_DISTRIBUTION_DATA, ATTENDANCE_TREND_DATA } from "@/mock/exams";
import { DEPARTMENT_ANALYTICS } from "@/mock/departments";
import { ANIMATION_VARIANTS, CHART_COLORS } from "@/constants";
import { getRiskInfo } from "@/hooks/useRisk";
import { formatDistanceToNow } from "date-fns";
import {
  GraduationCap, UserCog, ClipboardList, AlertTriangle,
  Activity, CheckCircle2, Clock, Building2, TrendingUp,
  ExternalLink, Circle,
} from "lucide-react";
import Link from "next/link";

/* ── Session status badge ── */
function SessionBadge({ status }: { status: string }) {
  if (status === "active")  return <Badge variant="success" dot>Active</Badge>;
  if (status === "paused")  return <Badge variant="warning" dot>Paused</Badge>;
  return <Badge variant="muted" dot>Ended</Badge>;
}

/* ── Recent violation row ── */
function ViolationRow({ v }: { v: typeof MOCK_VIOLATIONS[0] }) {
  const sev = v.severity;
  const colorMap = {
    critical: "text-danger",
    high:     "text-orange-400",
    medium:   "text-warning",
    low:      "text-text-muted",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/4 last:border-0 hover:bg-surface-2/30 px-1 rounded-lg transition-colors">
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${sev === "critical" ? "bg-danger" : sev === "medium" ? "bg-warning" : "bg-text-muted"}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-text-primary truncate">{v.studentName}</p>
        <p className="text-[11.5px] text-text-muted">{v.type} · {v.assignedClass}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-[11.5px] font-semibold ${colorMap[sev as keyof typeof colorMap] ?? "text-text-muted"}`}>
          {sev.charAt(0).toUpperCase() + sev.slice(1)}
        </p>
        <p className="text-[11px] text-text-muted">{v.time}</p>
      </div>
    </div>
  );
}

/* ── Active session row ── */
function SessionRow({ s }: { s: typeof MOCK_SESSIONS[0] }) {
  const risk = getRiskInfo(s.avgRisk ?? 30);
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/4 last:border-0 hover:bg-surface-2/30 px-1 rounded-lg transition-colors">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Activity className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-text-primary truncate">{s.exam}</p>
        <p className="text-[11.5px] text-text-muted">{s.class} · {s.invigilator}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <SessionBadge status={s.status} />
        <p className="text-[11px]" style={{ color: risk.color }}>{s.avgRisk}% avg risk</p>
      </div>
    </div>
  );
}

const RISK_DONUT = [
  { name: "Safe (0–30)",     value: 48, color: CHART_COLORS.success },
  { name: "Warning (31–65)", value: 32, color: CHART_COLORS.warning },
  { name: "Critical (66+)",  value: 20, color: CHART_COLORS.danger  },
];

const DEPT_BAR = DEPARTMENT_ANALYTICS.map((d) => ({ name: d.name, value: d.violations }));

export default function AdminDashboardPage() {
  const stats = MOCK_SYSTEM_STATS;
  const activeSessions = MOCK_SESSIONS.filter((s) => s.status !== "ended");
  const recentViolations = MOCK_VIOLATIONS.slice(0, 6);
  const unackAlerts = MOCK_AI_ALERTS.filter((a) => !a.acknowledged).length;

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Dashboard"
          description={`Welcome back · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
          badge={<Badge variant="success" dot>System Online</Badge>}
          actions={
            <Link href="/admin/monitoring" className="btn btn-primary gap-2 text-[13px]">
              <Activity className="w-3.5 h-3.5" />
              Live Monitoring
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard index={0} label="Total Students"    value={stats.totalStudents}    icon={<GraduationCap className="w-5 h-5" />} color="primary" delta="+12 this month" deltaType="up"   description="Across all departments" />
          <StatCard index={1} label="Invigilators"      value={stats.totalInvigilators} icon={<UserCog       className="w-5 h-5" />} color="cyan"    delta="All verified"   deltaType="neutral" description="Active staff members" />
          <StatCard index={2} label="Active Exams"      value={stats.activeExams}       icon={<ClipboardList className="w-5 h-5" />} color="success" delta="Running now"     deltaType="up"   description="Live sessions today" />
          <StatCard index={3} label="Total Violations"  value={stats.totalViolations}   icon={<AlertTriangle className="w-5 h-5" />} color="danger"  delta={`${unackAlerts} unresolved`} deltaType={unackAlerts > 0 ? "down" : "neutral"} description="Flagged this session" />
        </div>

        {/* Second row stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard index={4} label="Departments"      value={stats.totalDepartments ?? 6} icon={<Building2     className="w-5 h-5" />} color="purple"  />
          <StatCard index={5} label="Classes"          value={stats.totalClasses ?? 14}    icon={<ClipboardList className="w-5 h-5" />} color="primary" />
          <StatCard index={6} label="AI Accuracy"      value={stats.aiAccuracy}            icon={<TrendingUp    className="w-5 h-5" />} color="success" description="Detection precision" />
          <StatCard index={7} label="Server Uptime"    value={stats.serverUptime}          icon={<CheckCircle2  className="w-5 h-5" />} color="cyan"    description="Last 30 days" />
        </div>

        {/* Charts row 1 */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          variants={ANIMATION_VARIANTS.stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Exam trend */}
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} className="card p-5 col-span-2">
            <div className="section-header">
              <div>
                <p className="section-title">Exam Activity</p>
                <p className="section-subtitle">Exams scheduled vs completed per month</p>
              </div>
              <Badge variant="primary">Monthly</Badge>
            </div>
            <AreaChart
              data={EXAM_TREND_DATA}
              color={CHART_COLORS.primary}
              color2={CHART_COLORS.success}
              dataKey="value" dataKey2="value2"
              label2="Completed"
              height={200}
            />
          </motion.div>

          {/* Risk donut */}
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} className="card p-5">
            <div className="section-header">
              <div>
                <p className="section-title">Risk Distribution</p>
                <p className="section-subtitle">Student risk levels</p>
              </div>
            </div>
            <DonutChart
              data={RISK_DONUT}
              centerLabel="Students"
              centerValue={`${stats.onlineStudents ?? 48}`}
              height={220}
            />
          </motion.div>
        </motion.div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Violations trend */}
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <div className="section-header">
              <p className="section-title">Violations This Week</p>
            </div>
            <BarChartComponent
              data={VIOLATION_TREND_DATA}
              color={CHART_COLORS.danger}
              height={180}
            />
          </motion.div>

          {/* Dept violations */}
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <div className="section-header">
              <p className="section-title">Violations by Dept</p>
            </div>
            <BarChartComponent
              data={DEPT_BAR}
              multiColor
              height={180}
            />
          </motion.div>

          {/* Attendance chart */}
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <div className="section-header">
              <p className="section-title">Attendance vs Pass Rate</p>
            </div>
            <AreaChart
              data={ATTENDANCE_TREND_DATA}
              color={CHART_COLORS.success}
              color2={CHART_COLORS.cyan}
              dataKey="value" dataKey2="value2"
              label2="Pass %"
              height={180}
            />
          </motion.div>
        </div>

        {/* Bottom tables */}
        <div className="grid grid-cols-2 gap-4">
          {/* Active sessions */}
          <div className="card p-5">
            <div className="section-header">
              <div>
                <p className="section-title">Active Sessions</p>
                <p className="section-subtitle">{activeSessions.length} sessions running</p>
              </div>
              <Link href="/admin/monitoring" className="btn btn-ghost gap-1.5 text-[12px]">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-0">
              {activeSessions.map((s) => (
                <SessionRow key={s.id} s={s} />
              ))}
            </div>
          </div>

          {/* Recent violations */}
          <div className="card p-5">
            <div className="section-header">
              <div>
                <p className="section-title">Recent Violations</p>
                <p className="section-subtitle">{recentViolations.length} latest events</p>
              </div>
              <Link href="/admin/violations" className="btn btn-ghost gap-1.5 text-[12px]">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div>
              {recentViolations.map((v) => (
                <ViolationRow key={v.id} v={v} />
              ))}
            </div>
          </div>
        </div>

        {/* AI alerts strip */}
        <div className="card p-5">
          <div className="section-header mb-4">
            <div>
              <p className="section-title">AI Alerts</p>
              <p className="section-subtitle">{unackAlerts} unacknowledged alerts require attention</p>
            </div>
            <Link href="/admin/monitoring" className="btn btn-danger gap-1.5 text-[12px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              Review Alerts
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_AI_ALERTS.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl p-4 border ${
                  alert.severity === "critical"
                    ? "bg-danger/5 border-danger/15"
                    : "bg-warning/5 border-warning/15"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-[12.5px] font-semibold text-text-primary truncate">{alert.studentName}</p>
                  <Badge variant={alert.severity === "critical" ? "danger" : "warning"} size="sm">
                    {alert.confidence}%
                  </Badge>
                </div>
                <p className="text-[11.5px] text-text-muted line-clamp-2 mb-2">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">{alert.class} · {alert.time}</span>
                  {alert.acknowledged
                    ? <Badge variant="success" size="sm">Resolved</Badge>
                    : <Badge variant="danger"  size="sm">Open</Badge>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
