"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download, FileText, Printer, Search, Sparkles, Table } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { departmentRisk, reportRows, riskTrend } from "@/mock/platform";

export default function ReportsPage() {
  const [query, setQuery] = useState("");
  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return reportRows.filter((row) =>
      `${row.id} ${row.student} ${row.exam} ${row.department} ${row.status}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <MainLayout allowedRoles={["Admin", "Invigilator"]}>
      <div className="space-y-6">
        <section className="aurora-panel rounded-[2rem] p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm text-violet-200">Reports</p>
              <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Academic integrity analytics</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">Export-ready reports with student, department, and AI summary views.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><CalendarDays className="size-4" /> Date</Button>
              <Button variant="outline"><Table className="size-4" /> CSV</Button>
              <Button variant="outline"><FileText className="size-4" /> PDF</Button>
              <Button variant="outline"><Printer className="size-4" /> Print</Button>
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

        <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Risk distribution</h2>
            <p className="mt-1 text-sm text-zinc-500">Open review cases by severity</p>
            <PieChart data={[
              { label: "Low", value: 38 },
              { label: "Medium", value: 31 },
              { label: "High", value: 21 },
              { label: "Critical", value: 10 },
            ]} />
          </article>
          <article className="aurora-card p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">Student ranking</h2>
                <p className="mt-1 text-sm text-zinc-500">Searchable report queue for department review</p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
                <Search className="size-4 text-zinc-500" />
                <input
                  className="min-w-0 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
                  placeholder="Search reports"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Report</th>
                    <th className="px-4 py-2 font-medium">Student</th>
                    <th className="px-4 py-2 font-medium">Exam</th>
                    <th className="px-4 py-2 font-medium">Risk</th>
                    <th className="px-4 py-2 font-medium">Packets</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.id} className="bg-white/[0.035] text-zinc-300">
                      <td className="rounded-l-2xl px-4 py-4 font-medium text-zinc-100">{row.id}</td>
                      <td className="px-4 py-4">
                        <p className="text-zinc-100">{row.student}</p>
                        <p className="text-xs text-zinc-500">{row.department}</p>
                      </td>
                      <td className="px-4 py-4">{row.exam}</td>
                      <td className="px-4 py-4"><RiskBadge score={row.risk} /></td>
                      <td className="px-4 py-4">{row.packets}</td>
                      <td className="rounded-r-2xl px-4 py-4">
                        <StatusBadge tone={row.status === "Escalated" ? "offline" : row.status === "Reviewed" ? "online" : "review"}>
                          {row.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleRows.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-8 text-center text-sm text-zinc-500">
                No report rows match your search.
              </div>
            ) : null}
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
