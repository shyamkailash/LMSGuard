import { MainLayout } from "@/app/layouts/MainLayout";
import { StudentWaitingRoomPanel } from "@/components/student/StudentExamPanels";

export default function StudentCurrentExamPage() {
  return (
    <MainLayout allowedRoles={["Student"]}>
      <div className="space-y-6">
        <section className="aurora-panel rounded-[2rem] p-6">
          <p className="text-sm text-emerald-200">Current Exam</p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Secure exam room</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Only the active exam workflow is shown here: waiting room, password gate, proctoring status, timer, and submit controls.
          </p>
        </section>
        <StudentWaitingRoomPanel />
      </div>
    </MainLayout>
  );
}
