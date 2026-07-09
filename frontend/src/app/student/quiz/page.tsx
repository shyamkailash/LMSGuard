import { MainLayout } from "@/app/layouts/MainLayout";
import { StudentQuizPanel } from "@/components/student/StudentExamPanels";

export default function StudentQuizPage() {
  return (
    <MainLayout allowedRoles={["Student"]}>
      <div className="space-y-6">
        <StudentQuizPanel />
      </div>
    </MainLayout>
  );
}
