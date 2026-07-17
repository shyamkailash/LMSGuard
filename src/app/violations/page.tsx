"use client";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { MOCK_VIOLATIONS } from "@/mock/violations";
import type { ViolationRecord } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, ShieldAlert, CheckCircle2, Eye } from "lucide-react";

function SeverityBadge({ s }: { s: string }) {
  const map: Record<string, "danger" | "warning" | "muted"> = { critical: "danger", high: "danger", medium: "warning", low: "muted" };
  return <Badge variant={map[s] ?? "muted"} dot>{s}</Badge>;
}

const COLUMNS: Column<ViolationRecord>[] = [
  { key: "studentName", label: "Student", sortable: true,
    render: (_, v) => (
      <div>
        <p className="text-[12.5px] font-medium text-text-primary">{v.studentName}</p>
        <p className="text-[11px] text-text-muted">{v.regno}</p>
      </div>
    ),
  },
  { key: "type",      label: "Type",    sortable: true, render: (v) => <span className="text-[12.5px] text-text-secondary">{v as string}</span> },
  { key: "detail",    label: "Detail",  render: (v) => <span className="text-[12px] text-text-muted">{(v as string) ?? "—"}</span> },
  { key: "severity",  label: "Severity",sortable: true, render: (v) => <SeverityBadge s={v as string} /> },
  { key: "timestamp", label: "When",    sortable: true,
    render: (_, v) => <span className="text-[12px] text-text-muted">{formatDistanceToNow(new Date(v.timestamp), { addSuffix: true })}</span>,
  },
  { key: "actions", label: "", align: "right",
    render: () => <button className="icon-btn"><Eye className="w-3.5 h-3.5" /></button>,
  },
];

export default function InvViolationsPage() {
  const cseViolations = MOCK_VIOLATIONS.filter((v) => v.assignedClass === "CSE-3A");
  const { paginated, total, page, setPage, totalPages, search, setSearch, handleSort, sortKey, sortDir } =
    useFilter({ data: cseViolations as unknown as Record<string, unknown>[], searchKeys: ["studentName", "regno", "type"] });

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader title="Violations" description="Violations recorded in your sessions" />
        <div className="grid grid-cols-3 gap-4">
          <StatCard index={0} label="Total" value={cseViolations.length} icon={<AlertTriangle className="w-4 h-4" />} color="danger"  />
          <StatCard index={1} label="Critical" value={cseViolations.filter((v) => v.severity === "critical").length} icon={<ShieldAlert className="w-4 h-4" />} color="danger" />
          <StatCard index={2} label="Resolved" value={0} icon={<CheckCircle2 className="w-4 h-4" />} color="success" />
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">My Violations ({total})</p>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…" className="input-premium w-48 h-8 text-[12.5px]" />
          </div>
          <DataTable
            columns={COLUMNS} data={paginated as unknown as ViolationRecord[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage} sortKey={sortKey as string | null}
            sortDir={sortDir} onSort={handleSort as (k: string) => void}
            emptyMessage="No violations recorded" emptyIcon={<AlertTriangle className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>
    </AppShell>
  );
}
