import { MainLayout } from "@/app/layouts/MainLayout";
import { InvigilatorAttendancePanel } from "@/components/invigilator/InvigilatorPanels";

export default function InvigilatorAttendancePage() {
  return (
    <MainLayout allowedRoles={["Invigilator"]}>
      <div className="space-y-6">
        <InvigilatorAttendancePanel />
      </div>
    </MainLayout>
  );
}
