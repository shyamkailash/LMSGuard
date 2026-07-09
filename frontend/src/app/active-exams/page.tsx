import { MainLayout } from "@/app/layouts/MainLayout";
import { ExamCard } from "@/components/cards/ExamCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExamAssignmentPanel } from "@/components/exams/ExamAssignmentPanel";
import { Button } from "@/components/ui/button";
import { calendarBlocks, exams } from "@/mock/platform";

export default function ActiveExamsPage() {
  return (
    <MainLayout allowedRoles={["Admin", "Invigilator"]}>
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
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </section>

        <div id="assignments">
          <ExamAssignmentPanel />
        </div>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Schedule timeline</h2>
            <div className="mt-5 space-y-3">
              {calendarBlocks.map((block) => (
                <div key={block.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div>
                    <p className="text-sm text-zinc-500">{block.label}</p>
                    <p className="mt-1 font-medium text-zinc-50">{block.title}</p>
                  </div>
                  <StatusBadge tone="review">{block.count} assigned</StatusBadge>
                </div>
              ))}
            </div>
          </article>
          <article className="aurora-card p-6">
            <h2 className="text-xl font-semibold text-zinc-50">Create exam checklist</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Assign invigilator", "Assign students", "Set monitoring rules", "Schedule countdown", "LMS roster sync", "Report template"].map((item, index) => (
                <label key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4 text-sm text-zinc-300">
                  <input type="checkbox" defaultChecked={index < 4} className="size-4 rounded border-white/10 bg-white/5 accent-cyan-500" />
                  {item}
                </label>
              ))}
            </div>
          </article>
        </section>
      </div>
    </MainLayout>
  );
}
