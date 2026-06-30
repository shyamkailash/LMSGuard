import { Ban, Gauge, Globe2, MonitorCheck, Save } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { Button } from "@/components/ui/button";
import { settings } from "@/mock/platform";

const policies = [
  { title: "Allowed apps", value: "Secure Browser, VS Code, Calculator", icon: MonitorCheck },
  { title: "Blocked apps", value: "Messaging, remote desktop, screen recorders", icon: Ban },
  { title: "Allowed websites", value: "LMS portal, documentation, university domain", icon: Globe2 },
  { title: "AI sensitivity", value: "High confidence, low interruption", icon: Gauge },
];

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-violet-200">Settings</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Monitoring policy</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Tune thresholds and exam controls while keeping intervention calm and evidence-led.</p>
          </div>
          <Button className="bg-violet-500 hover:bg-violet-400"><Save className="size-4" /> Save policy</Button>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {settings.map((item) => (
            <MetricCard key={item.title} {...item} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <article key={policy.title} className="aurora-card p-5">
                <div className="flex items-start gap-4">
                  <div className="grid size-11 place-items-center rounded-2xl bg-violet-400/10 text-violet-100 ring-1 ring-violet-300/20">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-zinc-50">{policy.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{policy.value}</p>
                    <input className="aurora-input mt-4" defaultValue={policy.value} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="aurora-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-zinc-50">Thresholds</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["Idle threshold", "90 seconds"],
              ["Risk threshold", "68 points"],
              ["Streaming quality", "Adaptive HD"],
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="text-sm text-zinc-400">{label}</span>
                <input className="aurora-input mt-2" defaultValue={value} />
              </label>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
