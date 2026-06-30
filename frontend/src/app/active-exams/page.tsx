import { MainLayout } from "@/app/layouts/MainLayout";
import { ExamCard } from "@/components/cards/ExamCard";
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
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </section>
      </div>
    </MainLayout>
  );
}
