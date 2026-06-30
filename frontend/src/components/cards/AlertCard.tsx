import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";

import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";

type AlertCardProps = {
  student: string;
  event: string;
  time: string;
  score: number;
  status: "Queued" | "Reviewed" | "Escalated";
};

export function AlertCard({
  student,
  event,
  time,
  score,
  status,
}: AlertCardProps) {
  const Icon = status === "Reviewed" ? CheckCircle2 : status === "Escalated" ? AlertTriangle : Eye;

  return (
    <article className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition hover:bg-white/[0.065]">
      <div className="flex items-start gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-violet-400/10 text-violet-100 ring-1 ring-violet-300/15">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-zinc-100">{student}</p>
            <RiskBadge score={score} />
          </div>
          <p className="mt-1 text-sm text-zinc-400">{event}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">{time}</span>
            <StatusBadge
              tone={
                status === "Reviewed"
                  ? "online"
                  : status === "Escalated"
                    ? "offline"
                    : "review"
              }
            >
              {status}
            </StatusBadge>
          </div>
        </div>
      </div>
    </article>
  );
}
