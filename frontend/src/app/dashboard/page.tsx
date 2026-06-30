import { Activity, BrainCircuit, GraduationCap, ShieldAlert } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AlertCard } from "@/components/cards/AlertCard";
import { StatCard } from "@/components/cards/StatCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { RiskChart } from "@/components/charts/RiskChart";
import { alerts, departmentRisk, exams, riskTrend, stats } from "@/mock/platform";

const icons = [GraduationCap, Activity, BrainCircuit, ShieldAlert];

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="aurora-panel overflow-hidden rounded-[2rem] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <StatusBadge tone="review">Aurora Intelligence active</StatusBadge>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-balance text-zinc-50 lg:text-5xl">
                Good afternoon, academic monitoring is stable across live exams.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                AI inference, identity confidence, network telemetry, and evidence capture are synchronized for the current session.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <RiskChart score={92} label="Trust score" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} icon={icons[index]} />
          ))}
        </section>

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
      </div>
    </MainLayout>
  );
}
