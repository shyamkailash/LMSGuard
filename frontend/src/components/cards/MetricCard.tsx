import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  progress: number;
  tone?: "violet" | "cyan" | "emerald" | "amber" | "rose";
};

const gradients = {
  violet: "from-violet-400 via-indigo-400 to-cyan-300",
  cyan: "from-cyan-300 via-indigo-400 to-violet-400",
  emerald: "from-emerald-300 via-cyan-300 to-indigo-400",
  amber: "from-amber-300 via-violet-400 to-indigo-400",
  rose: "from-red-300 via-violet-400 to-indigo-400",
};

export function MetricCard({
  title,
  value,
  detail,
  progress,
  tone = "violet",
}: MetricCardProps) {
  return (
    <div className="aurora-card p-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="text-2xl font-semibold text-zinc-50">{value}</p>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/7">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", gradients[tone])}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}
