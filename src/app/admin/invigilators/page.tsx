"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_INVIGILATORS } from "@/mock/invigilators";
import type { AdminInvigilator } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import { UserCog, Plus, Search, Download, CheckCircle2, XCircle, Eye, Pencil, Trash2, Key } from "lucide-react";
import { StatCard as SC } from "@/components/ui/StatCard";

/* ── Add/Edit Modal ── */
function InvigilatorModal({ open, onClose, inv }: { open: boolean; onClose: () => void; inv: AdminInvigilator | null }) {
  return (
    <Modal open={open} onClose={onClose} title={inv ? "Edit Invigilator" : "Add Invigilator"} size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Full Name</label>
            <input defaultValue={inv?.name} className="input-premium w-full" placeholder="Dr. John Martin" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Email</label>
            <input defaultValue={inv?.email} type="email" className="input-premium w-full" placeholder="john@ssiet.ac.in" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Phone</label>
            <input defaultValue={inv?.phone} className="input-premium w-full" placeholder="+91 98765 XXXXX" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Department</label>
            <input defaultValue={inv?.dept} className="input-premium w-full" placeholder="Computer Science & Engineering" />
          </div>
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onClose}>{inv ? "Save Changes" : "Add Invigilator"}</Button>
      </ModalFooter>
    </Modal>
  );
}

const COLUMNS: Column<AdminInvigilator>[] = [
  {
    key: "name", label: "Invigilator", sortable: true,
    render: (_, inv) => (
      <div className="flex items-center gap-3">
        <Avatar name={inv.name} size="sm" />
        <div>
          <p className="text-[13px] font-medium text-text-primary">{inv.name}</p>
          <p className="text-[11.5px] text-text-muted">{inv.email}</p>
        </div>
      </div>
    ),
  },
  { key: "dept",   label: "Department", sortable: true,
    render: (v) => <span className="text-[12.5px] text-text-muted">{v as string}</span> },
  { key: "totalExams", label: "Exams", sortable: true, align: "center",
    render: (v) => <span className="text-[12.5px] font-medium text-text-secondary font-feature">{v as number ?? 0}</span> },
  { key: "permissions", label: "Classes", sortable: false,
    render: (v) => (
      <div className="flex flex-wrap gap-1">
        {(v as string[]).slice(0, 3).map((c) => (
          <Badge key={c} variant="primary" size="sm">{c}</Badge>
        ))}
        {(v as string[]).length > 3 && (
          <Badge variant="muted" size="sm">+{(v as string[]).length - 3}</Badge>
        )}
      </div>
    ),
  },
  { key: "joinedAt", label: "Joined",
    render: (v) => <span className="text-[12px] text-text-muted">{v as string}</span> },
  { key: "status", label: "Status",
    render: (v) => (
      <Badge variant={v === "active" ? "success" : "muted"} dot>
        {v as string}
      </Badge>
    ),
  },
  {
    key: "actions", label: "", align: "right",
    render: (_, inv) => <InvActions inv={inv} />,
  },
];

function InvActions({ inv }: { inv: AdminInvigilator }) {
  const [edit, setEdit] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      <button className="icon-btn" title="View"><Eye     className="w-3.5 h-3.5" /></button>
      <button className="icon-btn" title="Edit" onClick={() => setEdit(true)}><Pencil className="w-3.5 h-3.5" /></button>
      <button className="icon-btn" title="Permissions"><Key    className="w-3.5 h-3.5" /></button>
      <button className="icon-btn text-danger/60 hover:text-danger hover:bg-danger/10" title="Remove"><Trash2  className="w-3.5 h-3.5" /></button>
      <InvigilatorModal open={edit} onClose={() => setEdit(false)} inv={inv} />
    </div>
  );
}

export default function InvigilatorsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const active   = MOCK_INVIGILATORS.filter((i) => i.status === "active").length;
  const inactive = MOCK_INVIGILATORS.filter((i) => i.status === "inactive").length;

  const { search, setSearch, paginated, total, page, setPage, totalPages, handleSort, sortKey, sortDir } =
    useFilter({ data: MOCK_INVIGILATORS as unknown as Record<string, unknown>[], searchKeys: ["name", "email", "dept"] });

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Invigilators"
          description={`${MOCK_INVIGILATORS.length} invigilators registered`}
          actions={
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
              <Button variant="primary"   icon={<Plus      className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>Add Invigilator</Button>
            </div>
          }
        />

        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total"     value={MOCK_INVIGILATORS.length} icon={<UserCog        className="w-4 h-4" />} color="primary" />
          <StatCard index={1} label="Active"    value={active}                   icon={<CheckCircle2   className="w-4 h-4" />} color="success" />
          <StatCard index={2} label="Inactive"  value={inactive}                 icon={<XCircle        className="w-4 h-4" />} color="warning" />
          <StatCard index={3} label="Total Exams Conducted" value={MOCK_INVIGILATORS.reduce((a, i) => a + (i.totalExams ?? 0), 0)} icon={<UserCog className="w-4 h-4" />} color="cyan" />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="section-title">All Invigilators</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invigilators…"
                className="input-premium pl-8 w-56 h-8 text-[12.5px]"
              />
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as AdminInvigilator[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null} sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No invigilators found"
            emptyIcon={<UserCog className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>
      <InvigilatorModal open={modalOpen} onClose={() => setModalOpen(false)} inv={null} />
    </AppShell>
  );
}
