import { AlertTriangle, Eye, MonitorDot, RadioTower, UsersRound } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { AlertCard } from "@/components/cards/AlertCard";
import { StatCard } from "@/components/cards/StatCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { alerts, exams, students } from "@/mock/platform";

export default function InvigilatorDashboardPage() {
  const focusedStudents = students.slice(0, 6);

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="aurora-panel rounded-[2rem] p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <StatusBadge tone="online">Mission control online</StatusBadge>
              <h1 className="mt-4 text-4xl font-semibold text-zinc-50">Invigilator mission control</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">
                Monitor current exams, prioritize elevated students, and review evidence as it arrives.
              </p>
            </div>
            <Button className="bg-violet-500 hover:bg-violet-400">Open fullscreen monitoring</Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Live students" value="326" change="Across 4 active exams" icon={UsersRound} tone="violet" />
          <StatCard label="Elevated risk" value="18" change="6 need immediate review" icon={AlertTriangle} tone="amber" />
          <StatCard label="AI review lanes" value="12" change="All calibrated" icon={RadioTower} tone="emerald" />
          <StatCard label="Streams healthy" value="97%" change="Adaptive HD active" icon={MonitorDot} tone="cyan" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Priority students</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {focusedStudents.map((student) => (
                <div key={student.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-100">{student.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">{student.registerNumber}</p>
                    </div>
                    <RiskBadge score={student.riskScore} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
                    <span>{student.exam}</span>
                    <Button variant="ghost" size="sm"><Eye className="size-4" /> View</Button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Alert feed</h2>
            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} student={alert.student} event={alert.event} time={alert.time} score={alert.severity} status={alert.status} />
              ))}
            </div>
          </article>
        </section>

        <section className="aurora-card p-6">
          <h2 className="text-xl font-semibold text-zinc-50">Current exams</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                <StatusBadge tone={exam.status === "Live" ? "online" : "review"}>{exam.status}</StatusBadge>
                <p className="mt-4 font-medium text-zinc-100">{exam.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{exam.students} students</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
