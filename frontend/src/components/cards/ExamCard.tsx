import { ExternalLink, UsersRound } from "lucide-react";

import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Exam } from "@/mock/platform";

type ExamCardProps = {
  exam: Exam;
};

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <article className="aurora-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge tone={exam.status === "Live" ? "online" : exam.status === "Review" ? "review" : "neutral"}>
            {exam.status}
          </StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-zinc-50">{exam.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{exam.department}</p>
        </div>
        <RiskBadge score={exam.risk} />
      </div>
      <div className="mt-6 space-y-3 text-sm text-zinc-400">
        <div className="flex items-center justify-between gap-3">
          <span>Invigilator</span>
          <span className="text-right text-zinc-200">{exam.invigilator}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Time</span>
          <span className="text-zinc-200">{exam.startsAt}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2"><UsersRound className="size-4" /> Students</span>
          <span className="text-zinc-200">{exam.students}</span>
        </div>
      </div>
      <Button variant="outline" className="mt-6 w-full justify-between">
        Open monitoring
        <ExternalLink className="size-4" />
      </Button>
    </article>
  );
}
