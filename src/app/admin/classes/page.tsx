"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { AVAILABLE_CLASSES_LIST } from "@/mock/invigilators";
import { useFilter } from "@/hooks/useFilter";
import { BookOpen, Plus, Search, Users, Building2, Eye, Pencil, Trash2 } from "lucide-react";

type ClassRow = typeof AVAILABLE_CLASSES_LIST[0];

const COLUMNS: Column<ClassRow>[] = [
  {
    key: "label", label: "Class", sortable: true,
    render: (_, c) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-cyan" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-text-primary">{c.label}</p>
          <p className="text-[11.5px] text-text-muted">Room: {c.roomNo}</p>
        </div>
      </div>
    ),
  },
  { key: "dept",     label: "Department", sortable: true,
    render: (v) => <span className="text-[12.5px] text-text-muted">{v as string}</span> },
  { key: "year",     label: "Year",       sortable: true,
    render: (v) => <Badge variant="primary" size="sm">{v as string}</Badge> },
  { key: "section",  label: "Section",    align: "center",
    render: (v) => <span className="text-[12.5px] font-semibold text-text-secondary">{v as string}</span> },
  { key: "strength", label: "Strength",   sortable: true, align: "center",
    render: (v) => (
      <div className="flex items-center justify-center gap-1.5">
        <Users className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] font-medium text-text-secondary font-feature">{v as number}</span>
      </div>
    ),
  },
  { key: "roomNo",   label: "Room",
    render: (v) => <span className="text-[12px] text-text-muted">{v as string}</span> },
  {
    key: "actions", label: "", align: "right",
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <button className="icon-btn"><Eye    className="w-3.5 h-3.5" /></button>
        <button className="icon-btn"><Pencil className="w-3.5 h-3.5" /></button>
        <button className="icon-btn text-danger/60 hover:text-danger hover:bg-danger/10"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    ),
  },
];

export default function ClassesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { search, setSearch, paginated, total, page, setPage, totalPages, handleSort, sortKey, sortDir } =
    useFilter({ data: AVAILABLE_CLASSES_LIST as unknown as Record<string, unknown>[], searchKeys: ["label", "dept", "year"] });

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Classes"
          description={`${AVAILABLE_CLASSES_LIST.length} classes across all departments`}
          actions={
            <Button variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>
              Add Class
            </Button>
          }
        />

        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total Classes"  value={AVAILABLE_CLASSES_LIST.length} icon={<BookOpen  className="w-4 h-4" />} color="cyan"    />
          <StatCard index={1} label="Total Strength" value={AVAILABLE_CLASSES_LIST.reduce((a, c) => a + c.strength, 0)} icon={<Users className="w-4 h-4" />} color="primary" />
          <StatCard index={2} label="Departments"    value={[...new Set(AVAILABLE_CLASSES_LIST.map((c) => c.dept))].length} icon={<Building2 className="w-4 h-4" />} color="purple"  />
          <StatCard index={3} label="Avg Strength"   value={Math.round(AVAILABLE_CLASSES_LIST.reduce((a, c) => a + c.strength, 0) / AVAILABLE_CLASSES_LIST.length)} icon={<Users className="w-4 h-4" />} color="success" />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="section-title">All Classes</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search classes…"
                className="input-premium pl-8 w-56 h-8 text-[12.5px]"
              />
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as ClassRow[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null} sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No classes found"
            emptyIcon={<BookOpen className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Class" size="sm">
        <div className="space-y-4">
          {[
            { label: "Class Name",   placeholder: "e.g. CSE – 3rd Year A" },
            { label: "Department",   placeholder: "Computer Science & Engineering" },
            { label: "Year",         placeholder: "3rd Year" },
            { label: "Section",      placeholder: "A" },
            { label: "Room No",      placeholder: "Lab 101" },
            { label: "Strength",     placeholder: "20" },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">{f.label}</label>
              <input className="input-premium w-full" placeholder={f.placeholder} />
            </div>
          ))}
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>Add Class</Button>
        </ModalFooter>
      </Modal>
    </AppShell>
  );
}
