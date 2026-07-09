import { CalendarCheck, Gauge, RadioTower, UserPlus } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { invigilators } from "@/mock/platform";

export default function InvigilatorsPage() {
  return (
    <MainLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-cyan-200">Invigilators</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Faculty operations</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Availability, exam assignments, workload, and review performance in one view.</p>
          </div>
          <Button asChild className="bg-blue-500 hover:bg-blue-400">
            <a href="/active-exams#assignments"><UserPlus className="size-4" /> Assign invigilator</a>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Available now" value="18" detail="6 departments covered" progress={82} tone="emerald" />
          <MetricCard title="Review load" value="74%" detail="Balanced across faculty" progress={74} tone="cyan" />
          <MetricCard title="Average response" value="42s" detail="Live alert acknowledgement" progress={91} tone="violet" />
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          {invigilators.map((item) => (
            <article key={item.name} className="aurora-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-zinc-50">{item.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{item.role}</p>
                </div>
                <StatusBadge tone={item.availability === "Live" ? "online" : item.availability === "Review" ? "review" : "neutral"}>
                  {item.availability}
                </StatusBadge>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  [CalendarCheck, `${item.exams}`, "Exams"],
                  [Gauge, `${item.accuracy}%`, "Accuracy"],
                  [RadioTower, `${item.load}%`, "Load"],
                ].map(([Icon, value, label]) => {
                  const TileIcon = Icon as typeof CalendarCheck;
                  return (
                    <div key={label as string} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                      <TileIcon className="size-4 text-cyan-200" />
                      <p className="mt-3 text-sm font-medium text-zinc-100">{value as string}</p>
                      <p className="text-xs text-zinc-500">{label as string}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                <div className="h-full rounded-full bg-gradient-to-r from-green-300 via-cyan-300 to-blue-400" style={{ width: `${item.load}%` }} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
