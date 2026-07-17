"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { DonutChart, BarChartComponent } from "@/components/features/charts";
import { MOCK_VIOLATIONS } from "@/mock/violations";
import type { ViolationRecord } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import { CHART_COLORS } from "@/constants";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle, Search, Download, Filter,
  ShieldAlert, TrendingUp, CheckCircle2, Clock,
  Eye, CheckCheck,
} from "lucide-react";

const TYPE_CHART = [
  { name: "App Switch",    value: 18, color: CHART_COLORS.danger  },
  { name: "Browser",       value: 14, color: CHART_COLORS.warning },
  { name: "Multi-Face",    value: 8,  color: CHART_COLORS.purple  },
  { name: "Clipboard",     value: 6,  color: CHART_COLORS.cyan    },
  { name: "Screen Cap",    value: 4,  color: CHART_COLORS.orange  },
];

const SEV_CHART = [
  { name: "Critical", value: 26, color: CHART_COLORS.danger  },
  { name: "Medium",   value: 18, color: CHART_COLORS.warning },
  { name: "Low",      value: 6,  color: CHART_COLORS.axis    },
];

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, "danger" | "warning" | "muted"> = {
    critical: "danger", high: "danger", medium: "warning", low: "muted",
  };
  return <Badge variant={map[severity] ?? "muted"} dot>{severity}</Badge>;
}

const COLUMNS: Column<ViolationRecord>[] = [
  {
    key: "studentName", label: "Student", sortable: true,
    render: (_, v) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={v.studentName} size="sm" />
        <div>
          <p className="text-[12.5px] font-medium text-text-primary">{v.studentName}</p>
          <p className="text-[11px] text-text-muted">{v.regno}</p>
        </div>
      </div>
    ),
  },
  { key: "type", label: "Violation Type", sortable: true,
    render: (v) => <span className="text-[12.5px] text-text-secondary">{v as string}</span> },
  { key: "detail", label: "Detail",
    render: (v) => <span className="text-[12px] text-text-muted">{(v as string) ?? "—"}</span> },
  { key: "assignedClass", label: "Class",
    render: (v) => <Badge variant="primary" size="sm">{v as string}</Badge> },
  { key: "exam", label: "Exam",
    render: (v) => <span className="text-[12px] text-text-muted truncate max-w-[120px] block">{(v as string) ?? "—"}</span> },
  { key: "severity", label: "Severity", sortable: true,
    render: (v) => <SeverityBadge severity={v as string} /> },
  { key: "timestamp", label: "Time", sortable: true,
    render: (_, v) => (
      <div>
        <p className="text-[12px] text-text-secondary">{v.time}</p>
        <p className="text-[10.5px] text-text-muted">
          {formatDistanceToNow(new Date(v.timestamp), { addSuffix: true })}
        </p>
      </div>
    ),
  },
  {
    key: "resolved", label: "Status",
    render: (v) => v
      ? <Badge variant="success" dot>Resolved</Badge>
      : <Badge variant="danger"  dot>Open</Badge>,
  },
  {
    key: "actions", label: "", align: "right",
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <button className="icon-btn"><Eye       className="w-3.5 h-3.5" /></button>
        <button className="icon-btn text-success/60 hover:text-success hover:bg-success/10">
          <CheckCheck className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
  },
];

export default function ViolationsPage() {
  const [sevFilter, setSevFilter] = useState("all");
  const allData = sevFilter === "all"
    ? MOCK_VIOLATIONS
    : MOCK_VIOLATIONS.filter((v) => v.severity === sevFilter);

  const { search, setSearch, paginated, total, page, setPage, totalPages,
    handleSort, sortKey, sortDir } =
    useFilter({ data: allData as unknown as Record<string, unknown>[], searchKeys: ["studentName", "regno", "type", "assignedClass"] });

  const critical = MOCK_VIOLATIONS.filter((v) => v.severity === "critical").length;
  const medium   = MOCK_VIOLATIONS.filter((v) => v.severity === "medium").length;
  const resolved = MOCK_VIOLATIONS.filter((v) => v.resolved).length;

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Violations"
          description={`${MOCK_VIOLATIONS.length} total violations recorded across all sessions`}
          actions={
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
              <Button variant="danger"    icon={<ShieldAlert className="w-3.5 h-3.5" />}>Bulk Resolve</Button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total"    value={MOCK_VIOLATIONS.length} icon={<AlertTriangle  className="w-4 h-4" />} color="danger"  />
          <StatCard index={1} label="Critical" value={critical}               icon={<ShieldAlert    className="w-4 h-4" />} color="danger"  delta={`${Math.round(critical/MOCK_VIOLATIONS.length*100)}% of total`} deltaType="down" />
          <StatCard index={2} label="Medium"   value={medium}                 icon={<TrendingUp     className="w-4 h-4" />} color="warning" />
          <StatCard index={3} label="Resolved" value={resolved}               icon={<CheckCircle2   className="w-4 h-4" />} color="success" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="section-title mb-1">By Violation Type</p>
            <p className="section-subtitle mb-4">Distribution of violation categories</p>
            <DonutChart data={TYPE_CHART} centerLabel="Types" centerValue="5" height={220} />
          </div>
          <div className="card p-5">
            <p className="section-title mb-1">By Severity</p>
            <p className="section-subtitle mb-4">Critical vs medium vs low</p>
            <DonutChart data={SEV_CHART} centerLabel="Total" centerValue={MOCK_VIOLATIONS.length} height={220} />
          </div>
          <div className="card p-5">
            <p className="section-title mb-1">By Class</p>
            <p className="section-subtitle mb-4">Violations per class</p>
            <BarChartComponent
              data={[
                { name: "CSE-3A", value: 10 },
                { name: "CSE-3B", value: 4  },
                { name: "ECE-3A", value: 4  },
                { name: "IT-2A",  value: 4  },
              ]}
              color={CHART_COLORS.danger}
              height={196}
            />
          </div>
        </div>

        {/* Table */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <p className="section-title">All Violations</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-white/5">
                {["all", "critical", "medium", "low"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSevFilter(s)}
                    className={`px-3 py-1 rounded-md text-[11.5px] font-medium capitalize transition-all ${
                      sevFilter === s
                        ? s === "critical" ? "bg-danger text-white" : s === "medium" ? "bg-warning text-black" : "bg-primary text-white"
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
                  placeholder="Search violations…"
                  className="input-premium pl-8 w-52 h-8 text-[12.5px]"
                />
              </div>
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as ViolationRecord[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null} sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No violations found"
            emptyIcon={<AlertTriangle className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>
    </AppShell>
  );
}
