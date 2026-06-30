"use client";

import { Eye, Wifi } from "lucide-react";

import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import type { StudentMonitor } from "@/mock/platform";

type StudentCardProps = {
  student: StudentMonitor;
  index: number;
  onView: (student: StudentMonitor) => void;
};

export function StudentCard({ student, index, onView }: StudentCardProps) {
  return (
    <article className="aurora-card overflow-hidden">
      <div className="relative aspect-video bg-[#101018]">
        <div className="absolute inset-0 aurora-grid opacity-60" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
          Live feed {index + 1}
        </div>
        <div className="absolute inset-x-5 bottom-5 h-20 rounded-2xl border border-white/10 bg-white/[0.045] backdrop-blur" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-zinc-50">{student.name}</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {student.registerNumber} | {student.department}
            </p>
          </div>
          <RiskBadge score={student.riskScore} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-white/[0.04] p-3">
            <p className="text-zinc-500">Application</p>
            <p className="mt-1 truncate text-zinc-200">{student.currentApplication}</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-3">
            <p className="text-zinc-500">Remaining</p>
            <p className="mt-1 text-zinc-200">{student.timeRemaining}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <StatusBadge tone={student.aiStatus === "Elevated" ? "warning" : student.aiStatus === "Reviewing" ? "review" : "online"}>
            {student.aiStatus}
          </StatusBadge>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <Wifi className="size-3.5" /> {student.connection}%
          </span>
        </div>
        <Button variant="outline" className="mt-4 w-full justify-between" onClick={() => onView(student)}>
          View live
          <Eye className="size-4" />
        </Button>
      </div>
    </article>
  );
}
