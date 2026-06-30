import { ExternalLink, UsersRound } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { exams } from "@/mock/platform";

export default function ActiveExamsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-violet-200">Active Exams</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Exam control room</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Live, scheduled, and review sessions are grouped by academic context and risk.</p>
          </div>
          <Button className="bg-violet-500 hover:bg-violet-400">Create exam</Button>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam) => (
            <article key={exam.id} className="aurora-card p-5">
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
                <div className="flex items-center justify-between">
                  <span>Invigilator</span>
                  <span className="text-zinc-200">{exam.invigilator}</span>
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
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
