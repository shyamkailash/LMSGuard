import { MainLayout } from "@/app/layouts/MainLayout";
import { InvigilatorExamControlPanel, InvigilatorExamList } from "@/components/invigilator/InvigilatorPanels";

export default function InvigilatorTodayExamsPage() {
  return (
    <MainLayout allowedRoles={["Invigilator"]}>
      <div className="space-y-6">
        <InvigilatorExamList mode="today" />
        <InvigilatorExamControlPanel />
      </div>
    </MainLayout>
  );
}
