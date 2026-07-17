"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { BarChartComponent } from "@/components/features/charts";
import { motion } from "framer-motion";
import { MOCK_DEPARTMENTS, DEPARTMENT_ANALYTICS } from "@/mock/departments";
import { ANIMATION_VARIANTS, CHART_COLORS } from "@/constants";
import type { Department } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import {
  Building2, Plus, Search, Users, BookOpen,
  UserCog, MoreHorizontal, Pencil, Trash2, Eye,
} from "lucide-react";

function DeptModal({
  open, onClose, dept,
}: {
  open: boolean;
  onClose: () => void;
  dept: Department | null;
}) {
  const [form, setForm] = useState({
    name: dept?.name ?? "",
    code: dept?.code ?? "",
    hod:  dept?.hod  ?? "",
    email: dept?.email ?? "",
    building: dept?.building ?? "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title={dept ? "Edit Department" : "Add Department"} size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Department Name</label>
            <input className="input-premium w-full" value={form.name} onChange={set("name")} placeholder="e.g. Computer Science & Engineering" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Department Code</label>
            <input className="input-premium w-full" value={form.code} onChange={set("code")} placeholder="e.g. CSE" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Building</label>
            <input className="input-premium w-full" value={form.building} onChange={set("building")} placeholder="e.g. Block A" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Head of Department</label>
            <input className="input-premium w-full" value={form.hod} onChange={set("hod")} placeholder="e.g. Dr. Ramesh Kumar" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Email</label>
            <input className="input-premium w-full" type="email" value={form.email} onChange={set("email")} placeholder="dept@ssiet.ac.in" />
          </div>
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onClose}>{dept ? "Save Changes" : "Add Department"}</Button>
      </ModalFooter>
    </Modal>
  );
}

const COLUMNS: Column<Department>[] = [
  {
    key: "name", label: "Department", sortable: true,
    render: (_, d) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-text-primary">{d.name}</p>
          <p className="text-[11.5px] text-text-muted">{d.code} · Est. {d.established}</p>
        </div>
      </div>
    ),
  },
  { key: "hod",      label: "Head of Dept",  sortable: true,
    render: (v) => <span className="text-[12.5px] text-text-secondary">{v as string}</span> },
  { key: "students", label: "Students",  sortable: true, align: "center",
    render: (v) => (
      <div className="flex items-center justify-center gap-1.5">
        <Users className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] font-medium text-text-secondary font-feature">{v as number}</span>
      </div>
    ),
  },
  { key: "classes",  label: "Classes",   sortable: true, align: "center",
    render: (v) => (
      <div className="flex items-center justify-center gap-1.5">
        <BookOpen className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] font-medium text-text-secondary">{v as number}</span>
      </div>
    ),
  },
  { key: "invigilators", label: "Invigilators", sortable: true, align: "center",
    render: (v) => (
      <div className="flex items-center justify-center gap-1.5">
        <UserCog className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] font-medium text-text-secondary">{v as number}</span>
      </div>
    ),
  },
  { key: "building", label: "Building",  render: (v) => <span className="text-[12.5px] text-text-muted">{v as string}</span> },
  { key: "status",   label: "Status",
    render: (v) => <Badge variant={v === "active" ? "success" : "muted"} dot>{v as string}</Badge>,
  },
  {
    key: "actions", label: "", align: "right",
    render: (_, d) => <DeptActions dept={d} />,
  },
];

function DeptActions({ dept }: { dept: Department }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      <button className="icon-btn" title="View"><Eye className="w-3.5 h-3.5" /></button>
      <button className="icon-btn" title="Edit" onClick={() => setOpen(true)}><Pencil className="w-3.5 h-3.5" /></button>
      <button className="icon-btn text-danger/60 hover:text-danger hover:bg-danger/10" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
      <DeptModal open={open} onClose={() => setOpen(false)} dept={dept} />
    </div>
  );
}

export default function DepartmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { search, setSearch, paginated, total, page, setPage, totalPages, handleSort, sortKey, sortDir } =
    useFilter({ data: MOCK_DEPARTMENTS as unknown as Record<string, unknown>[], searchKeys: ["name", "code", "hod"] });

  const chartData = DEPARTMENT_ANALYTICS.map((d) => ({ name: d.name, value: d.students }));

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Departments"
          description={`${MOCK_DEPARTMENTS.length} departments · ${MOCK_DEPARTMENTS.reduce((a, d) => a + d.students, 0)} total students`}
          actions={
            <Button variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>
              Add Department
            </Button>
          }
        />

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Departments",  value: MOCK_DEPARTMENTS.length,                                    color: "primary" as const, icon: <Building2 className="w-4 h-4" /> },
            { label: "Total Students", value: MOCK_DEPARTMENTS.reduce((a, d) => a + d.students, 0),    color: "cyan"    as const, icon: <Users     className="w-4 h-4" /> },
            { label: "Total Classes",  value: MOCK_DEPARTMENTS.reduce((a, d) => a + d.classes,  0),    color: "success" as const, icon: <BookOpen  className="w-4 h-4" /> },
            { label: "Invigilators",   value: MOCK_DEPARTMENTS.reduce((a, d) => a + (d.invigilators ?? 0), 0), color: "purple" as const, icon: <UserCog   className="w-4 h-4" /> },
          ].map((s, i) => (
            <StatCard key={i} index={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
          ))}
        </div>

        {/* Chart + table */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible"
            className="card p-5"
          >
            <p className="section-title mb-1">Students by Department</p>
            <p className="section-subtitle mb-4">Distribution across all departments</p>
            <BarChartComponent data={chartData} multiColor height={200} />
          </motion.div>

          <motion.div
            variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible"
            className="card p-5"
          >
            <p className="section-title mb-1">Violations by Department</p>
            <p className="section-subtitle mb-4">Total violations per dept</p>
            <BarChartComponent
              data={DEPARTMENT_ANALYTICS.map((d) => ({ name: d.name, value: d.violations }))}
              color={CHART_COLORS.danger}
              height={200}
            />
          </motion.div>

          <motion.div
            variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible"
            className="card p-5"
          >
            <p className="section-title mb-1">Pass Rate by Department</p>
            <p className="section-subtitle mb-4">Avg exam pass rate (%)</p>
            <BarChartComponent
              data={DEPARTMENT_ANALYTICS.map((d) => ({ name: d.name, value: d.passRate }))}
              color={CHART_COLORS.success}
              height={200}
            />
          </motion.div>
        </div>

        {/* Table */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="section-title">All Departments</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments…"
                className="input-premium pl-8 w-56 h-8 text-[12.5px]"
              />
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as Department[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null}
            sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No departments found"
            emptyIcon={<Building2 className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>

      <DeptModal open={modalOpen} onClose={() => setModalOpen(false)} dept={null} />
    </AppShell>
  );
}
