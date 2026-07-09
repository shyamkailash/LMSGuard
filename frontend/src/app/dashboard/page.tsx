import { Activity, BrainCircuit, CalendarClock, GraduationCap, RadioTower, ShieldAlert } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AlertCard } from "@/components/cards/AlertCard";
import { StatCard } from "@/components/cards/StatCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { ManagedAccountPanel } from "@/components/admin/ManagedAccountPanel";
import { RiskChart } from "@/components/charts/RiskChart";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { ExaminationSecurityPanel } from "@/components/settings/ExaminationSecurityPanel";
import { alerts, calendarBlocks, departmentRisk, exams, notifications, riskTrend, stats } from "@/mock/platform";

const icons = [GraduationCap, Activity, BrainCircuit, ShieldAlert];

export default function DashboardPage() {
  return (
    <MainLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <section className="aurora-panel overflow-hidden rounded-[2rem] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <StatusBadge tone="review">Aurora Intelligence active</StatusBadge>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-balance text-zinc-50 lg:text-5xl">
                <DashboardGreeting />
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                AI inference, identity confidence, network telemetry, and evidence capture are synchronized for the current session.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-black/20">
              <RiskChart score={92} label="Trust score" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} icon={icons[index]} />
          ))}
        </section>

        <ManagedAccountPanel />

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="aurora-card p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">Risk signal trend</h2>
                <p className="mt-1 text-sm text-zinc-500">Rolling analysis across monitored sessions</p>
              </div>
              <RiskBadge score={48} label="Moderate" />
            </div>
            <AreaChart values={riskTrend} />
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Department risk</h2>
            <p className="mt-1 text-sm text-zinc-500">Weighted anomaly score by department</p>
            <div className="mt-6">
              <BarChart data={departmentRisk} />
            </div>
          </article>
        </section>

        <ExaminationSecurityPanel />

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Recent alerts</h2>
            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} student={alert.student} event={alert.event} time={alert.time} score={alert.severity} status={alert.status} />
              ))}
            </div>
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Exam overview</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {exams.map((exam) => (
                <div key={exam.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-100">{exam.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{exam.department}</p>
                    </div>
                    <RiskBadge score={exam.risk} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
                    <span>{exam.students} students</span>
                    <StatusBadge tone={exam.status === "Live" ? "online" : exam.status === "Review" ? "review" : "neutral"}>
                      {exam.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_0.8fr_1.1fr]">
          <article className="aurora-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <CalendarClock className="size-5 text-cyan-200" />
              <h2 className="text-xl font-semibold text-zinc-50">Exam calendar</h2>
            </div>
            <div className="space-y-3">
              {calendarBlocks.map((block) => (
                <div key={block.label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">{block.label}</span>
                    <span className="text-zinc-300">{block.count} seats</span>
                  </div>
                  <p className="mt-2 font-medium text-zinc-50">{block.title}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="aurora-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <RadioTower className="size-5 text-green-200" />
              <h2 className="text-xl font-semibold text-zinc-50">System status</h2>
            </div>
            {["Inference API", "Socket gateway", "Storage queue", "LMS sync"].map((item, index) => (
              <div key={item} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{item}</span>
                  <span className="text-green-300">{99 - index}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-300 via-cyan-300 to-blue-400" style={{ width: `${99 - index}%` }} />
                </div>
              </div>
            ))}
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Activity feed</h2>
            <div className="mt-5 space-y-3">
              {notifications.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-zinc-100">{item.title}</p>
                    <RiskBadge score={item.severity} />
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">{item.body}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
