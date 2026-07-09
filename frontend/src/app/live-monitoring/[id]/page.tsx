import { AlertTriangle, Keyboard, MessageSquare, MousePointer2, Octagon, Send, Wifi } from "lucide-react";
import { notFound } from "next/navigation";

import { MainLayout } from "@/app/layouts/MainLayout";
import { AreaChart } from "@/components/charts/AreaChart";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { students } from "@/mock/platform";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = students.find((item) => item.id === id);

  if (!student) {
    notFound();
  }

  const trend = [18, 24, 28, student.riskScore / 2, student.riskScore - 12, student.riskScore, Math.max(22, student.riskScore - 8)];

  return (
    <MainLayout allowedRoles={["Admin", "Invigilator"]}>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-cyan-200">Student detail</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">{student.name}</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">{student.registerNumber} | {student.exam} | Current window: {student.currentApplication}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline"><MessageSquare className="size-4" /> Chat</Button>
            <Button variant="outline"><Send className="size-4" /> Warning</Button>
            <Button className="bg-red-500 hover:bg-red-400"><Octagon className="size-4" /> Terminate</Button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <article className="aurora-panel rounded-[2rem] p-4">
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_center,rgb(59_130_246/0.22),transparent_55%),#07101f]">
              <div className="aurora-grid absolute inset-0 opacity-70" />
              <div className="absolute left-4 top-4 flex gap-2">
                <StatusBadge tone="online">Live screen</StatusBadge>
                <RiskBadge score={student.riskScore} />
              </div>
              <div className="absolute inset-x-8 bottom-8 rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <p className="text-sm text-zinc-400">Secure browser workspace</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-50">{student.currentApplication}</p>
              </div>
            </div>
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">AI analysis</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              LMSGuard classifies this session as {student.aiStatus.toLowerCase()} with {student.violations} recorded policy events. Connection quality remains at {student.connection}%.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                [Keyboard, "Keyboard activity", "Normal cadence"],
                [MousePointer2, "Mouse activity", "High travel"],
                [Wifi, "Network quality", `${student.connection}%`],
                [AlertTriangle, "Violation history", `${student.violations} events`],
              ].map(([Icon, label, value]) => {
                const TileIcon = Icon as typeof Keyboard;
                return (
                  <div key={label as string} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                    <span className="inline-flex items-center gap-3 text-sm text-zinc-300">
                      <TileIcon className="size-4 text-cyan-200" />
                      {label as string}
                    </span>
                    <span className="text-sm text-zinc-100">{value as string}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Risk graph</h2>
            <AreaChart values={trend} />
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Activity timeline</h2>
            <div className="mt-5 space-y-3">
              {["Identity confidence refreshed", "Window focus changed", "Clipboard access blocked", "Invigilator note added"].map((event, index) => (
                <div key={event} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                  <p className="text-sm text-zinc-200">{event}</p>
                  <p className="mt-1 text-xs text-zinc-500">{index * 6 + 2} min ago</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
