"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { motion } from "framer-motion";
import { MOCK_STUDENTS_EXTENDED } from "@/mock/students";
import { MOCK_VIOLATIONS } from "@/mock/violations";
import type { AdminStudent } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import { getRiskInfo } from "@/hooks/useRisk";
import {
  GraduationCap, Plus, Search, Filter, Download,
  AlertTriangle, Users, TrendingUp, Shield,
  Pencil, Trash2, Eye, X,
} from "lucide-react";

/* ── Student Detail Modal ── */
function StudentDetailModal({ student, onClose }: { student: AdminStudent; onClose: () => void }) {
  const risk = getRiskInfo(student.risk);
  const violations = MOCK_VIOLATIONS.filter((v) => v.studentId === student.id);

  return (
    <Modal open onClose={onClose} title="Student Profile" size="lg">
      <div className="grid grid-cols-3 gap-5">
        {/* Left */}
        <div className="col-span-1 flex flex-col items-center gap-3 p-4 rounded-xl bg-surface-2/50">
          <Avatar name={student.name} size="xl" />
          <div className="text-center">
            <p className="text-[14px] font-semibold text-text-primary">{student.name}</p>
            <p className="text-[12px] text-text-muted">{student.regno}</p>
          </div>
          <Badge variant={student.status === "active" ? "success" : "danger"} dot>
            {student.status}
          </Badge>
          <div className="w-full mt-2">
            <RiskMeter score={student.risk} />
          </div>
        </div>

        {/* Right */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Department",  value: student.dept  },
              { label: "Class",       value: student.class },
              { label: "Email",       value: student.email },
              { label: "Risk Score",  value: `${student.risk}% — ${risk.label}` },
              { label: "Violations",  value: `${student.totalViolations ?? 0} recorded` },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium">{f.label}</p>
                <p className="text-[13px] text-text-primary font-medium">{f.value}</p>
              </div>
            ))}
          </div>

          {violations.length > 0 && (
            <div>
              <p className="text-[12px] text-text-muted uppercase tracking-wide font-medium mb-2">Recent Violations</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                {violations.slice(0, 5).map((v) => (
                  <div key={v.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2/60">
                    <span className="text-[12.5px] text-text-secondary">{v.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-text-muted">{v.time}</span>
                      <Badge variant={v.severity === "critical" ? "danger" : v.severity === "medium" ? "warning" : "muted"} size="sm">
                        {v.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="danger" icon={<AlertTriangle className="w-3.5 h-3.5" />}>Flag Student</Button>
      </ModalFooter>
    </Modal>
  );
}

const COLUMNS: Column<AdminStudent>[] = [
  {
    key: "name", label: "Student", sortable: true,
    render: (_, s) => (
      <div className="flex items-center gap-3">
        <Avatar name={s.name} size="sm" />
        <div>
          <p className="text-[13px] font-medium text-text-primary">{s.name}</p>
          <p className="text-[11.5px] text-text-muted">{s.regno}</p>
        </div>
      </div>
    ),
  },
  { key: "dept",  label: "Department", sortable: true,
    render: (v) => <span className="text-[12.5px] text-text-muted">{v as string}</span> },
  { key: "class", label: "Class",      sortable: true,
    render: (v) => <Badge variant="primary" size="sm">{v as string}</Badge> },
  {
    key: "risk", label: "Risk Score", sortable: true, width: "140px",
    render: (v, s) => (
      <div className="w-28">
        <RiskMeter score={s.risk} size="sm" showLabel={false} />
      </div>
    ),
  },
  { key: "totalViolations", label: "Violations", sortable: true, align: "center",
    render: (v) => {
      const n = v as number ?? 0;
      return (
        <span className={`text-[12.5px] font-semibold font-feature ${n > 3 ? "text-danger" : n > 0 ? "text-warning" : "text-success"}`}>
          {n}
        </span>
      );
    },
  },
  { key: "status", label: "Status",
    render: (v) => (
      <Badge variant={v === "active" ? "success" : v === "flagged" ? "danger" : "muted"} dot>
        {v as string}
      </Badge>
    ),
  },
  { key: "email", label: "Email",
    render: (v) => <span className="text-[12px] text-text-muted">{v as string}</span> },
  {
    key: "actions", label: "", align: "right",
    render: (_, s) => <StudentActions student={s} />,
  },
];

function StudentActions({ student }: { student: AdminStudent }) {
  const [detail, setDetail] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      <button className="icon-btn" title="View" onClick={() => setDetail(true)}><Eye className="w-3.5 h-3.5" /></button>
      <button className="icon-btn" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
      <button className="icon-btn text-danger/60 hover:text-danger hover:bg-danger/10" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
      {detail && <StudentDetailModal student={student} onClose={() => setDetail(false)} />}
    </div>
  );
}

export default function StudentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const all = MOCK_STUDENTS_EXTENDED;
  const filtered = statusFilter === "all" ? all : all.filter((s) => s.status === statusFilter);

  const { search, setSearch, paginated, total, page, setPage, totalPages, handleSort, sortKey, sortDir } =
    useFilter({ data: filtered as unknown as Record<string, unknown>[], searchKeys: ["name", "regno", "email", "dept", "class"] });

  const flagged = all.filter((s) => s.status === "flagged").length;
  const highRisk = all.filter((s) => s.risk >= 66).length;
  const avgRisk  = Math.round(all.reduce((a, s) => a + s.risk, 0) / all.length);

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Students"
          description={`${all.length} students enrolled across all departments`}
          actions={
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
              <Button variant="primary"   icon={<Plus      className="w-3.5 h-3.5" />}>Add Student</Button>
            </div>
          }
        />

        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total Students" value={all.length}  icon={<Users        className="w-4 h-4" />} color="primary" />
          <StatCard index={1} label="Flagged"         value={flagged}    icon={<AlertTriangle className="w-4 h-4" />} color="danger"  delta={`${Math.round(flagged/all.length*100)}% of total`} deltaType="down" />
          <StatCard index={2} label="High Risk"        value={highRisk}  icon={<TrendingUp    className="w-4 h-4" />} color="warning" />
          <StatCard index={3} label="Avg Risk Score"   value={`${avgRisk}%`} icon={<Shield   className="w-4 h-4" />} color="cyan"   />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <p className="section-title">All Students</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status filter */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
                {["all", "active", "flagged"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium capitalize transition-all ${
                      statusFilter === s
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students…"
                  className="input-premium pl-8 w-56 h-8 text-[12.5px]"
                />
              </div>
              <Button variant="secondary" icon={<Download className="w-3.5 h-3.5" />} size="sm">CSV</Button>
            </div>
          </div>

          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as AdminStudent[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null} sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No students found"
            emptyIcon={<GraduationCap className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>
    </AppShell>
  );
}
