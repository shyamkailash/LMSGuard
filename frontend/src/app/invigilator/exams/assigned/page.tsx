import { MainLayout } from "@/app/layouts/MainLayout";
import { InvigilatorExamList } from "@/components/invigilator/InvigilatorPanels";

export default function InvigilatorAssignedExamsPage() {
  return (
    <MainLayout allowedRoles={["Invigilator"]}>
      <div className="space-y-6">
        <InvigilatorExamList mode="assigned" />
      </div>
    </MainLayout>
  );
}
