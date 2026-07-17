"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { MOCK_REPORTS } from "@/mock/exams";
import type { ExamReport } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import { getRiskInfo } from "@/hooks/useRisk";
import {
  FileText, Download, Search, Eye, RefreshCw,
  CheckCircle2, Users, AlertTriangle, TrendingUp,
  Calendar, Clock,
} from "lucide-react";

const COLUMNS: Column<ExamReport>[] = [
  {
    key: "examTitle", label: "Exam", sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-[13px] font-medium text-text-primary">{r.examTitle}</p>
        <p className="text-[11.5px] text-text-muted">{r.dept} · {r.class}</p>
      </div>
    ),
  },
  { key: "date", label: "Date", sortable: true,
    render: (_, r) => (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] text-text-secondary">{r.date}</span>
      </div>
    ),
  },
  { key: "appeared", label: "Appeared", sortable: true, align: "center",
    render: (_, r) => (
      <span className="text-[12.5px] font-medium text-text-secondary font-feature">
        {r.appeared}/{r.totalStudents}
      </span>
    ),
  },
  { key: "passed", label: "Passed", sortable: true, align: "center",
    render: (_, r) => {
      const pct = Math.round((r.passed / r.appeared) * 100);
      return (
        <div className="text-center">
          <span className="text-[12.5px] font-semibold text-success">{r.passed}</span>
          <span className="text-[10.5px] text-text-muted ml-1">({pct}%)</span>
        </div>
      );
    },
  },
  { key: "violations", label: "Violations", sortable: true, align: "center",
    render: (v) => (
      <span className={`text-[12.5px] font-semibold font-feature ${(v as number) > 5 ? "text-danger" : "text-warning"}`}>
        {v as number}
      </span>
    ),
  },
  { key: "avgRisk", label: "Avg Risk", sortable: true, align: "center",
    render: (v) => {
      const risk = getRiskInfo(v as number);
      return (
        <span className="text-[12.5px] font-semibold font-feature" style={{ color: risk.color }}>
          {v as number}%
        </span>
      );
    },
  },
  { key: "duration", label: "Duration",
    render: (v) => (
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-text-muted" />
        <span className="text-[12px] text-text-muted">{v as string}</span>
      </div>
    ),
  },
  { key: "status", label: "Status",
    render: (v) => (
      <Badge variant={v === "ready" ? "success" : v === "generating" ? "warning" : "danger"} dot>
        {v as string}
      </Badge>
    ),
  },
  {
    key: "actions", label: "", align: "right",
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <button className="icon-btn"><Eye      className="w-3.5 h-3.5" /></button>
        <button className="icon-btn"><Download className="w-3.5 h-3.5" /></button>
      </div>
    ),
  },
];

export default function ReportsPage() {
  const { search, setSearch, paginated, total, page, setPage, totalPages,
    handleSort, sortKey, sortDir } =
    useFilter({ data: MOCK_REPORTS as unknown as Record<string, unknown>[], searchKeys: ["examTitle", "dept", "class"] });

  const totalStudents  = MOCK_REPORTS.reduce((a, r) => a + r.appeared, 0);
  const totalPassed    = MOCK_REPORTS.reduce((a, r) => a + r.passed,   0);
  const totalViolations = MOCK_REPORTS.reduce((a, r) => a + r.violations, 0);
  const avgPassRate    = Math.round((totalPassed / totalStudents) * 100);

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Reports"
          description={`${MOCK_REPORTS.length} exam reports generated`}
          actions={
            <div className="flex gap-2">
              <Button variant="secondary" icon={<RefreshCw className="w-3.5 h-3.5" />}>Regenerate</Button>
              <Button variant="primary"   icon={<Download  className="w-3.5 h-3.5" />}>Export All</Button>
            </div>
          }
        />

        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Reports"    value={MOCK_REPORTS.length}  icon={<FileText      className="w-4 h-4" />} color="primary" />
          <StatCard index={1} label="Appeared"   value={totalStudents}        icon={<Users         className="w-4 h-4" />} color="cyan"    />
          <StatCard index={2} label="Pass Rate"  value={`${avgPassRate}%`}   icon={<CheckCircle2  className="w-4 h-4" />} color="success" />
          <StatCard index={3} label="Violations" value={totalViolations}      icon={<AlertTriangle className="w-4 h-4" />} color="danger"  />
        </div>

        {/* Report summary cards */}
        <div className="grid grid-cols-2 gap-4">
          {MOCK_REPORTS.map((report, i) => {
            const passRate = Math.round((report.passed / report.appeared) * 100);
            const avgRisk  = getRiskInfo(report.avgRisk);
            return (
              <div key={report.id} className="card p-5 hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{report.examTitle}</p>
                    <p className="text-[12px] text-text-muted">{report.dept} · {report.class} · {report.date}</p>
                  </div>
                  <Badge variant={report.status === "ready" ? "success" : "warning"} dot>{report.status}</Badge>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Appeared",   value: `${report.appeared}/${report.totalStudents}`, color: "text-text-primary" },
                    { label: "Passed",     value: `${passRate}%`,       color: "text-success"     },
                    { label: "Violations", value: report.violations,     color: report.violations > 5 ? "text-danger" : "text-warning" },
                    { label: "Avg Risk",   value: `${report.avgRisk}%`, color: avgRisk.tier === "safe" ? "text-success" : avgRisk.tier === "warning" ? "text-warning" : "text-danger" },
                  ].map((m) => (
                    <div key={m.label} className="text-center p-2 rounded-lg bg-surface-2/50">
                      <p className={`text-[15px] font-bold ${m.color} font-feature`}>{m.value}</p>
                      <p className="text-[10.5px] text-text-muted">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-text-muted">Generated {report.generatedAt}</p>
                  <div className="flex gap-1.5">
                    <Button variant="ghost"     size="sm" icon={<Eye      className="w-3 h-3" />}>View</Button>
                    <Button variant="secondary" size="sm" icon={<Download className="w-3 h-3" />}>PDF</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="section-title">All Reports</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports…"
                className="input-premium pl-8 w-52 h-8 text-[12.5px]"
              />
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as ExamReport[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null} sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No reports available"
            emptyIcon={<FileText className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>
    </AppShell>
  );
}
