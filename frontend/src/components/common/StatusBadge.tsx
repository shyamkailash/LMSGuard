import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusTone = "online" | "review" | "warning" | "offline" | "neutral";

type StatusBadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

const toneStyles: Record<StatusTone, string> = {
  online: "bg-emerald-400/10 text-emerald-100 ring-emerald-300/20",
  review: "bg-violet-400/10 text-violet-100 ring-violet-300/20",
  warning: "bg-amber-400/10 text-amber-100 ring-amber-300/20",
  offline: "bg-red-400/10 text-red-100 ring-red-300/20",
  neutral: "bg-white/7 text-zinc-200 ring-white/10",
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
