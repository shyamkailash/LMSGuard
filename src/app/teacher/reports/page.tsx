"use client";

import { BarChart3, Download, FileText, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const reports = [
  { title: "Exam Summary Report", detail: "3 students active, 1 completed." },
  { title: "Student-wise Violation Report", detail: "2 flagged incidents recorded." },
  { title: "Agent Online/Offline Report", detail: "2 online, 1 offline." },
  { title: "SEB Launched/Not Launched Report", detail: "2 launched, 1 pending." },
  { title: "Network Issue Report", detail: "1 unstable connection detected." },
  { title: "Evidence Screenshot Report", detail: "Screenshots available for review." },
];

export default function TeacherReportsPage() {
  return (
    <DashboardLayout title="Teacher Reports" subtitle="Generate classroom and exam reports">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">Reports Center</p>
            <h2 className="text-xl font-semibold text-slate-900">Exportable monitoring reports</h2>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary"><FileText size={16} /> Generate Report</button>
            <button className="btn-secondary"><Download size={16} /> Download PDF</button>
            <button className="btn-secondary"><BarChart3 size={16} /> Export CSV</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldCheck size={16} className="text-emerald-500" /> {item.title}
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
