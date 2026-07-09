import { MainLayout } from "@/app/layouts/MainLayout";
import { MonitoringWorkspace } from "@/components/monitoring/MonitoringWorkspace";

export default function LiveMonitoringPage() {
  return (
    <MainLayout allowedRoles={["Admin", "Invigilator"]}>
      <MonitoringWorkspace />
    </MainLayout>
  );
}
