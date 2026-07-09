import { MainLayout } from "@/app/layouts/MainLayout";
import { StudentExamSummary } from "@/components/student/StudentExamPanels";

export default function StudentUpcomingExamsPage() {
  return (
    <MainLayout allowedRoles={["Student"]}>
      <div className="space-y-6">
        <StudentExamSummary mode="upcoming" />
      </div>
    </MainLayout>
  );
}
