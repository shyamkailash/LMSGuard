import { cn } from "@/lib/utils";

type RiskLevel = "low" | "medium" | "high" | "critical";

type RiskBadgeProps = {
  score: number;
  label?: string;
  className?: string;
};

function getRiskLevel(score: number): RiskLevel {
  if (score >= 86) return "critical";
  if (score >= 66) return "high";
  if (score >= 38) return "medium";
  return "low";
}

const styles: Record<RiskLevel, string> = {
  low: "from-emerald-400/20 to-cyan-400/14 text-emerald-100 ring-emerald-300/20",
  medium: "from-amber-400/22 to-violet-400/12 text-amber-100 ring-amber-300/20",
  high: "from-orange-400/24 to-violet-500/14 text-orange-100 ring-orange-300/20",
  critical: "from-red-400/24 to-violet-500/16 text-red-100 ring-red-300/25",
};

export function RiskBadge({ score, label, className }: RiskBadgeProps) {
  const level = getRiskLevel(score);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur",
        styles[level],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? `${score}% ${level}`}
    </span>
  );
}
