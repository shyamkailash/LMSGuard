import { MainLayout } from "@/app/layouts/MainLayout";
import { StudentCodingPanel } from "@/components/student/StudentExamPanels";

export default function StudentCodingTestsPage() {
  return (
    <MainLayout allowedRoles={["Student"]}>
      <div className="space-y-6">
        <StudentCodingPanel />
      </div>
    </MainLayout>
  );
}
