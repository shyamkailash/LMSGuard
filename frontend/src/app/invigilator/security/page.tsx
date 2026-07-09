import { MainLayout } from "@/app/layouts/MainLayout";
import { ExaminationSecurityPanel } from "@/components/settings/ExaminationSecurityPanel";

export default function InvigilatorSecurityPage() {
  return (
    <MainLayout allowedRoles={["Invigilator"]}>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-cyan-200">Security Panel</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Live examination controls</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Toggle proctoring controls here and active student exam sessions receive the changes through the real-time policy channel.
            </p>
          </div>
        </section>
        <ExaminationSecurityPanel />
      </div>
    </MainLayout>
  );
}
