import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: "violet" | "cyan" | "emerald" | "amber" | "rose";
};

const tones = {
  violet: "from-violet-400/18 to-indigo-400/8 text-violet-100",
  cyan: "from-cyan-400/16 to-indigo-400/8 text-cyan-100",
  emerald: "from-emerald-400/16 to-cyan-400/8 text-emerald-100",
  amber: "from-amber-400/18 to-violet-400/8 text-amber-100",
  rose: "from-red-400/16 to-violet-400/8 text-red-100",
};

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone = "violet",
}: StatCardProps) {
  return (
    <article className="aurora-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-3xl font-semibold text-zinc-50">{value}</p>
        </div>
        <div
          className={cn(
            "grid size-11 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-white/10",
            tones[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-zinc-400">
        <ArrowUpRight className="size-3.5 text-emerald-300" />
        <span>{change}</span>
      </div>
    </article>
  );
}
