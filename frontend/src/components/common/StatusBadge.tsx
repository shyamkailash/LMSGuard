import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusTone = "online" | "review" | "warning" | "offline" | "neutral";

type StatusBadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

const toneStyles: Record<StatusTone, string> = {
  online: "bg-emerald-100 text-emerald-800 ring-emerald-300/60 dark:bg-emerald-400/10 dark:text-emerald-100 dark:ring-emerald-300/20",
  review: "bg-violet-100 text-violet-800 ring-violet-300/60 dark:bg-violet-400/10 dark:text-violet-100 dark:ring-violet-300/20",
  warning: "bg-amber-100 text-amber-800 ring-amber-300/60 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-300/20",
  offline: "bg-red-100 text-red-800 ring-red-300/60 dark:bg-red-400/10 dark:text-red-100 dark:ring-red-300/20",
  neutral: "bg-slate-100 text-slate-800 ring-slate-300/70 dark:bg-white/7 dark:text-zinc-200 dark:ring-white/10",
};

export function StatusBadge({
  tone = "neutral",
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 backdrop-blur",
        toneStyles[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
