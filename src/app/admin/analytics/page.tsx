"use client";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, StatCard } from "@/components/ui";
import { AreaChart, BarChartComponent, DonutChart } from "@/components/features/charts";
import { motion } from "framer-motion";
import { DEPARTMENT_ANALYTICS } from "@/mock/departments";
import { EXAM_TREND_DATA, VIOLATION_TREND_DATA, RISK_DISTRIBUTION_DATA, ATTENDANCE_TREND_DATA } from "@/mock/exams";
import { MOCK_SYSTEM_STATS } from "@/mock/invigilators";
import { ANIMATION_VARIANTS, CHART_COLORS } from "@/constants";
import { BarChart3, TrendingUp, Users, AlertTriangle, Brain, Activity } from "lucide-react";

const MONTHLY_RISK = [
  { name: "Jan", value: 28 }, { name: "Feb", value: 32 },
  { name: "Mar", value: 25 }, { name: "Apr", value: 38 },
  { name: "May", value: 34 }, { name: "Jun", value: 42 },
  { name: "Jul", value: 36 },
];

const SESSION_TREND = [
  { name: "Mon", value: 3, value2: 12 },
  { name: "Tue", value: 5, value2: 19 },
  { name: "Wed", value: 2, value2: 8  },
  { name: "Thu", value: 7, value2: 24 },
  { name: "Fri", value: 6, value2: 17 },
  { name: "Sat", value: 1, value2: 6  },
];

const AI_ACCURACY = [
  { name: "App Switch",   value: 99 },
  { name: "Multi-Face",   value: 97 },
  { name: "Clipboard",    value: 95 },
  { name: "Screen Cap",   value: 98 },
  { name: "Idle",         value: 92 },
  { name: "Browser",      value: 96 },
];

export default function AnalyticsPage() {
  const stats = MOCK_SYSTEM_STATS;

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Analytics"
          description="Platform-wide examination insights and performance metrics"
          badge={<Badge variant="primary">Last 30 days</Badge>}
        />

        {/* KPI strip */}
        <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: "Total Sessions",  value: 47,    icon: <Activity   className="w-4 h-4" />, color: "primary"  as const },
            { label: "Total Students",  value: stats.totalStudents, icon: <Users      className="w-4 h-4" />, color: "cyan"    as const },
            { label: "Avg Pass Rate",   value: "84%", icon: <TrendingUp className="w-4 h-4" />, color: "success"  as const },
            { label: "Violation Rate",  value: "12%", icon: <AlertTriangle className="w-4 h-4" />, color: "danger" as const },
            { label: "AI Accuracy",     value: stats.aiAccuracy, icon: <Brain      className="w-4 h-4" />, color: "purple"  as const },
            { label: "Avg Risk Score",  value: "31%", icon: <BarChart3   className="w-4 h-4" />, color: "warning"  as const },
          ].map((s, i) => (
            <StatCard key={i} index={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
          ))}
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5 col-span-2">
            <p className="section-title mb-0.5">Sessions & Violations Over Time</p>
            <p className="section-subtitle mb-4">Daily sessions vs violations (this week)</p>
            <AreaChart
              data={SESSION_TREND}
              color={CHART_COLORS.primary}
              color2={CHART_COLORS.danger}
              dataKey="value" dataKey2="value2"
              label2="Violations"
              height={220} showLegend
            />
          </motion.div>

          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <p className="section-title mb-0.5">Risk Distribution</p>
            <p className="section-subtitle mb-4">Student risk levels</p>
            <DonutChart
              data={[
                { name: "Safe",     value: 48, color: CHART_COLORS.success },
                { name: "Warning",  value: 32, color: CHART_COLORS.warning },
                { name: "Critical", value: 20, color: CHART_COLORS.danger  },
              ]}
              centerLabel="Online" centerValue={`${stats.onlineStudents}`}
              height={230}
            />
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <p className="section-title mb-0.5">Avg Risk Trend</p>
            <p className="section-subtitle mb-4">Monthly average risk score (%)</p>
            <AreaChart data={MONTHLY_RISK} color={CHART_COLORS.warning} height={180} />
          </motion.div>

          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <p className="section-title mb-0.5">Attendance vs Pass Rate</p>
            <p className="section-subtitle mb-4">Per exam (%)</p>
            <AreaChart
              data={ATTENDANCE_TREND_DATA}
              color={CHART_COLORS.success}
              color2={CHART_COLORS.cyan}
              dataKey="value" dataKey2="value2"
              label2="Pass %"
              height={180} showLegend
            />
          </motion.div>

          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <p className="section-title mb-0.5">AI Detection Accuracy</p>
            <p className="section-subtitle mb-4">Per violation type (%)</p>
            <BarChartComponent
              data={AI_ACCURACY}
              color={CHART_COLORS.purple}
              height={180}
            />
          </motion.div>
        </div>

        {/* Row 3 — department breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <p className="section-title mb-0.5">Violations by Department</p>
            <p className="section-subtitle mb-4">Total flagged events per dept</p>
            <BarChartComponent
              data={DEPARTMENT_ANALYTICS.map((d) => ({ name: d.name, value: d.violations }))}
              color={CHART_COLORS.danger}
              height={200}
            />
          </motion.div>

          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible" className="card p-5">
            <p className="section-title mb-0.5">Pass Rate by Department</p>
            <p className="section-subtitle mb-4">Exam performance (%)</p>
            <BarChartComponent
              data={DEPARTMENT_ANALYTICS.map((d) => ({ name: d.name, value: d.passRate }))}
              color={CHART_COLORS.success}
              height={200}
            />
          </motion.div>
        </div>

        {/* Dept table */}
        <div className="card p-5">
          <p className="section-title mb-4">Department Performance Summary</p>
          <div className="table-container">
            <table className="table-premium">
              <thead>
                <tr>
                  {["Department", "Students", "Exams", "Violations", "Avg Risk", "Pass Rate"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEPARTMENT_ANALYTICS.map((d) => {
                  const risk = d.avgRisk >= 66 ? "text-danger" : d.avgRisk >= 31 ? "text-warning" : "text-success";
                  const pass = d.passRate >= 85 ? "text-success" : d.passRate >= 70 ? "text-warning" : "text-danger";
                  return (
                    <tr key={d.name}>
                      <td className="font-medium text-text-primary">{d.name}</td>
                      <td className="font-feature">{d.students}</td>
                      <td>{d.exams}</td>
                      <td className={d.violations > 25 ? "text-danger font-semibold" : ""}>{d.violations}</td>
                      <td className={`font-semibold font-feature ${risk}`}>{d.avgRisk}%</td>
                      <td className={`font-semibold font-feature ${pass}`}>{d.passRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
