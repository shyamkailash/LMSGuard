import { Expand, Filter, Grid3X3, MousePointer2, RefreshCw, Search, Wifi } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { students } from "@/mock/platform";

const featuredStudents = students.slice(0, 12);
const selected = students[1];

export default function LiveMonitoringPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm text-violet-200">Live Monitoring</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Student signal grid</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Live screenshots, application focus, connection quality, and AI risk status in one calm operational surface.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline"><Filter className="size-4" /> Filters</Button>
            <Button variant="outline"><Grid3X3 className="size-4" /> Grid</Button>
            <Button variant="outline"><RefreshCw className="size-4" /> Refresh</Button>
            <Button className="bg-violet-500 hover:bg-violet-400"><Expand className="size-4" /> Fullscreen</Button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="aurora-panel flex items-center gap-3 rounded-3xl px-4 py-3">
              <Search className="size-4 text-zinc-500" />
              <input className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500" placeholder="Search by name, register number, department, exam" />
              <StatusBadge tone="online">1,284 online</StatusBadge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {featuredStudents.map((student, index) => (
                <article key={student.id} className="aurora-card overflow-hidden">
                  <div className="relative aspect-video bg-[#101018]">
                    <div className="absolute inset-0 aurora-grid opacity-60" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
                      Live feed {index + 1}
                    </div>
                    <div className="absolute inset-x-5 bottom-5 h-20 rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-zinc-50">{student.name}</h2>
                        <p className="mt-1 text-xs text-zinc-500">{student.registerNumber} | {student.department}</p>
                      </div>
                      <RiskBadge score={student.riskScore} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-white/[0.04] p-3">
                        <p className="text-zinc-500">Application</p>
                        <p className="mt-1 truncate text-zinc-200">{student.currentApplication}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] p-3">
                        <p className="text-zinc-500">Remaining</p>
                        <p className="mt-1 text-zinc-200">{student.timeRemaining}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <StatusBadge tone={student.aiStatus === "Elevated" ? "warning" : student.aiStatus === "Reviewing" ? "review" : "online"}>
                        {student.aiStatus}
                      </StatusBadge>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Wifi className="size-3.5" /> {student.connection}%
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="aurora-panel h-fit rounded-[2rem] p-5 xl:sticky xl:top-28">
            <div className="aspect-video rounded-3xl border border-white/10 bg-white/[0.045] p-4">
              <div className="h-full rounded-2xl bg-[radial-gradient(circle_at_50%_35%,rgb(124_58_237/0.22),transparent_13rem),#101018]" />
            </div>
            <div className="mt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-50">{selected.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{selected.exam}</p>
                </div>
                <RiskBadge score={selected.riskScore} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Keyboard", "Normal"],
                  ["Mouse", "High travel"],
                  ["Clipboard", "Blocked"],
                  ["Network", `${selected.connection}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                    <p className="text-zinc-500">{label}</p>
                    <p className="mt-1 text-zinc-100">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {["Secondary face candidate", "Focus changed to restricted window", "Policy recovered application focus"].map((event, index) => (
                  <div key={event} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                    <MousePointer2 className="mt-0.5 size-4 text-violet-200" />
                    <div>
                      <p className="text-sm text-zinc-200">{event}</p>
                      <p className="mt-1 text-xs text-zinc-500">{index * 4 + 2} min ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </MainLayout>
  );
}
