import { CheckCircle2, Download, Filter, Search } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { alerts } from "@/mock/platform";

export default function Violations() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-violet-200">Violations</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Evidence review queue</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Prioritized cases with context, severity, and review workflow state.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="size-4" /> Filter</Button>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
          </div>
        </section>

        <section className="aurora-panel rounded-[2rem] p-4">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
            <Search className="size-4 text-zinc-500" />
            <input className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500" placeholder="Search evidence, student, exam, event" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs text-zinc-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Case</th>
                  <th className="px-4 py-2 font-medium">Student</th>
                  <th className="px-4 py-2 font-medium">Exam</th>
                  <th className="px-4 py-2 font-medium">Event</th>
                  <th className="px-4 py-2 font-medium">Severity</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((violation) => (
                  <tr key={violation.id} className="bg-white/[0.035] text-zinc-300">
                    <td className="rounded-l-2xl px-4 py-4 font-medium text-zinc-100">{violation.id}</td>
                    <td className="px-4 py-4">
                      <p className="text-zinc-100">{violation.student}</p>
                      <p className="text-xs text-zinc-500">{violation.registerNumber}</p>
                    </td>
                    <td className="px-4 py-4">{violation.exam}</td>
                    <td className="px-4 py-4">{violation.event}</td>
                    <td className="px-4 py-4"><RiskBadge score={violation.severity} /></td>
                    <td className="px-4 py-4">
                      <StatusBadge tone={violation.status === "Reviewed" ? "online" : violation.status === "Escalated" ? "offline" : "review"}>
                        {violation.status}
                      </StatusBadge>
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <Button variant="ghost" size="sm"><CheckCircle2 className="size-4" /> Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
