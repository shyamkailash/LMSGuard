import { Bell, CalendarClock, CheckCircle2, Clock, MonitorCheck } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="aurora-panel rounded-[2rem] p-6">
          <StatusBadge tone="online">Monitoring ready</StatusBadge>
          <h1 className="mt-4 text-4xl font-semibold text-zinc-50">Student exam desk</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Your current exam status, upcoming schedule, and monitoring readiness are shown here.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Current exam" value="Ready" detail="Secure browser check passed" progress={92} tone="emerald" />
          <MetricCard title="Exam timer" value="54m" detail="Distributed Systems" progress={46} tone="violet" />
          <MetricCard title="Monitoring" value="Stable" detail="Camera, screen, and network online" progress={88} tone="cyan" />
          <MetricCard title="History" value="0" detail="No open violations" progress={8} tone="emerald" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="aurora-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-50">Distributed Systems</h2>
                <p className="mt-2 text-zinc-400">Starts today at 02:00 PM</p>
              </div>
              <Button className="bg-violet-500 hover:bg-violet-400">Launch exam</Button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                [CalendarClock, "Schedule", "Today, 02:00 PM"],
                [MonitorCheck, "Agent", "Connected"],
                [Clock, "Duration", "90 minutes"],
              ].map(([Icon, label, value]) => {
                const TileIcon = Icon as typeof CalendarClock;
                return (
                  <div key={label as string} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                    <TileIcon className="size-5 text-violet-200" />
                    <p className="mt-3 text-sm text-zinc-500">{label as string}</p>
                    <p className="mt-1 font-medium text-zinc-100">{value as string}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Notifications</h2>
            <div className="mt-5 space-y-3">
              {[
                [CheckCircle2, "Identity verification completed"],
                [Bell, "Keep the secure browser open during the exam"],
                [MonitorCheck, "Screen monitoring agent is active"],
              ].map(([Icon, text]) => {
                const NoticeIcon = Icon as typeof Bell;
                return (
                  <div key={text as string} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                    <NoticeIcon className="mt-0.5 size-4 text-violet-200" />
                    <span className="text-sm text-zinc-300">{text as string}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
