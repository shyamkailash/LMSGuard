"use client";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button } from "@/components/ui";
import { MOCK_REPORTS } from "@/mock/exams";
import { getRiskInfo } from "@/hooks/useRisk";
import { Download, Eye, FileText } from "lucide-react";

export default function InvReportsPage() {
  const myReports = MOCK_REPORTS.slice(0, 3);
  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Reports"
          description="Exam session reports from your monitored sessions"
          actions={<Button variant="primary" icon={<Download className="w-3.5 h-3.5" />}>Export All</Button>}
        />
        <div className="grid grid-cols-2 gap-4">
          {myReports.map((report) => {
            const passRate = Math.round((report.passed / report.appeared) * 100);
            const risk     = getRiskInfo(report.avgRisk);
            return (
              <div key={report.id} className="card p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-text-primary">{report.examTitle}</p>
                      <p className="text-[12px] text-text-muted">{report.class} · {report.date}</p>
                    </div>
                  </div>
                  <Badge variant="success" dot>Ready</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Students", value: `${report.appeared}/${report.totalStudents}`, color: "text-text-primary" },
                    { label: "Pass Rate", value: `${passRate}%`, color: "text-success" },
                    { label: "Violations", value: report.violations, color: "text-danger" },
                    { label: "Avg Risk", value: `${report.avgRisk}%`, color: risk.tier === "safe" ? "text-success" : "text-warning" },
                  ].map((m) => (
                    <div key={m.label} className="text-center p-2 rounded-lg bg-surface-2/50">
                      <p className={`text-[15px] font-bold ${m.color} font-feature`}>{m.value}</p>
                      <p className="text-[10.5px] text-text-muted">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Eye className="w-3 h-3" />}>View</Button>
                  <Button variant="secondary" size="sm" icon={<Download className="w-3 h-3" />}>PDF</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
