import { Download, FileText, Sparkles, Table } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { departmentRisk, riskTrend } from "@/mock/platform";

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="aurora-panel rounded-[2rem] p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm text-violet-200">Reports</p>
              <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Academic integrity analytics</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">Export-ready reports with student, department, and AI summary views.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><Table className="size-4" /> CSV</Button>
              <Button variant="outline"><FileText className="size-4" /> PDF</Button>
              <Button className="bg-violet-500 hover:bg-violet-400"><Sparkles className="size-4" /> AI summary</Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Evidence packets" value="482" detail="Generated this week" progress={78} tone="violet" />
          <MetricCard title="Student reports" value="1,284" detail="Ready for department heads" progress={88} tone="cyan" />
          <MetricCard title="Reviewed cases" value="91%" detail="Median review time 7m" progress={91} tone="emerald" />
          <MetricCard title="Escalations" value="27" detail="Requires committee decision" progress={42} tone="amber" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="aurora-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">Integrity score timeline</h2>
                <p className="mt-1 text-sm text-zinc-500">Aggregated by exam session</p>
              </div>
              <Button variant="ghost" size="sm"><Download className="size-4" /> Save</Button>
            </div>
            <AreaChart values={riskTrend.map((value) => 80 - value / 2)} />
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Department summaries</h2>
            <p className="mt-1 text-sm text-zinc-500">Risk-normalized review volume</p>
            <div className="mt-6">
              <BarChart data={departmentRisk} />
            </div>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {["Student report", "Department report", "AI review memo"].map((title, index) => (
            <article key={title} className="aurora-card p-5">
              <div className="grid size-11 place-items-center rounded-2xl bg-violet-400/10 text-violet-100 ring-1 ring-violet-300/20">
                <FileText className="size-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-zinc-50">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {index === 0
                  ? "Individual evidence, timeline, screenshots, and review status."
                  : index === 1
                    ? "Exam-wide patterns, faculty workload, and department risk health."
                    : "Narrative summary with anomaly clusters and recommended next actions."}
              </p>
            </article>
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
