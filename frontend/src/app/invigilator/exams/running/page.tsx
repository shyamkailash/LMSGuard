import { MainLayout } from "@/app/layouts/MainLayout";
import { InvigilatorExamControlPanel, InvigilatorExamList } from "@/components/invigilator/InvigilatorPanels";

export default function InvigilatorRunningExamsPage() {
  return (
    <MainLayout allowedRoles={["Invigilator"]}>
      <div className="space-y-6">
        <InvigilatorExamList mode="running" />
        <InvigilatorExamControlPanel />
      </div>
    </MainLayout>
  );
}
