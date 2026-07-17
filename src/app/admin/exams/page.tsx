"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter, StatCard, DataTable } from "@/components/ui";
import type { Column } from "@/components/ui";
import { MOCK_EXAMS } from "@/mock/exams";
import type { AdminExam } from "@/types";
import { useFilter } from "@/hooks/useFilter";
import { motion } from "framer-motion";
import {
  ClipboardList, Plus, Search, Download, Eye, Pencil, Trash2,
  Clock, Users, Key, Play, CheckCircle2, Calendar,
} from "lucide-react";

function ExamStatusBadge({ status }: { status: string }) {
  const map: Record<string, "success" | "primary" | "warning" | "muted"> = {
    active: "success", scheduled: "primary", paused: "warning",
    ended: "muted", completed: "muted",
  };
  return <Badge variant={map[status] ?? "muted"} dot>{status}</Badge>;
}

/* ── Create Exam Modal ── */
function CreateExamModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const steps = ["Basic Info", "Assign Classes", "Invigilator & Passcode"];

  return (
    <Modal open={open} onClose={onClose} title="Create New Exam" size="lg">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-6">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 transition-all ${
              i + 1 <= step ? "bg-primary text-white" : "bg-surface-2 text-text-muted border border-white/8"
            }`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <div className="flex-1 ml-2">
              <p className={`text-[12px] font-medium ${i + 1 === step ? "text-text-primary" : "text-text-muted"}`}>{s}</p>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-white/10 mx-2" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Exam Title</label>
              <input className="input-premium w-full" placeholder="e.g. DBMS Final Exam" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Subject</label>
              <input className="input-premium w-full" placeholder="Database Management Systems" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Subject Code</label>
              <input className="input-premium w-full" placeholder="CS501" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Date</label>
              <input type="date" className="input-premium w-full" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Duration (minutes)</label>
              <input type="number" className="input-premium w-full" placeholder="60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Total Questions</label>
              <input type="number" className="input-premium w-full" placeholder="50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Total Marks</label>
              <input type="number" className="input-premium w-full" placeholder="100" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-[13px] text-text-muted mb-3">Select classes eligible for this exam</p>
          {["CSE-3A", "CSE-3B", "ECE-3A", "IT-2A", "MECH-3A", "AIML-3A"].map((c) => (
            <label key={c} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/50 cursor-pointer hover:bg-surface-2 transition-colors">
              <input type="checkbox" className="accent-primary w-4 h-4" />
              <span className="text-[13px] text-text-secondary">{c}</span>
            </label>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Assign Invigilator</label>
            <select className="input-premium w-full appearance-none">
              <option value="">Select invigilator…</option>
              {["John Martin", "Sarah Thomas", "Ravi Sharma", "Arun Kumar"].map((n) => (
                <option key={n} style={{ background: "#111827" }}>{n}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary">Exam Passcode</label>
            <div className="flex gap-2">
              <input className="input-premium flex-1" placeholder="e.g. DBMS2026" />
              <Button variant="secondary" size="sm" icon={<Key className="w-3.5 h-3.5" />}>Generate</Button>
            </div>
            <p className="text-[11.5px] text-text-muted">Students will need this passcode to start the exam</p>
          </div>
        </div>
      )}

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        {step > 1 && <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Button>}
        {step < steps.length
          ? <Button variant="primary" onClick={() => setStep((s) => s + 1)}>Continue</Button>
          : <Button variant="primary" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={onClose}>Create Exam</Button>
        }
      </ModalFooter>
    </Modal>
  );
}

const COLUMNS: Column<AdminExam>[] = [
  {
    key: "title", label: "Exam", sortable: true,
    render: (_, e) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <ClipboardList className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-text-primary">{e.title ?? e.name}</p>
          <p className="text-[11.5px] text-text-muted">{e.code} · {e.subject}</p>
        </div>
      </div>
    ),
  },
  { key: "dept",   label: "Department", sortable: true,
    render: (v) => <span className="text-[12px] text-text-muted">{v as string}</span> },
  { key: "date",   label: "Date",       sortable: true,
    render: (_, e) => (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] text-text-secondary">{e.date}</span>
      </div>
    ),
  },
  { key: "duration", label: "Duration", sortable: true, align: "center",
    render: (v) => (
      <div className="flex items-center justify-center gap-1">
        <Clock className="w-3 h-3 text-text-muted" />
        <span className="text-[12.5px] text-text-secondary">{v as number}m</span>
      </div>
    ),
  },
  { key: "classes", label: "Classes", sortable: false,
    render: (v) => (
      <div className="flex flex-wrap gap-1">
        {(v as string[]).map((c) => <Badge key={c} variant="primary" size="sm">{c}</Badge>)}
      </div>
    ),
  },
  { key: "questions", label: "Questions", align: "center",
    render: (v) => <span className="text-[12.5px] font-medium text-text-secondary">{v as number}</span> },
  { key: "status",    label: "Status",
    render: (v) => <ExamStatusBadge status={v as string} /> },
  {
    key: "actions", label: "", align: "right",
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <button className="icon-btn"><Eye     className="w-3.5 h-3.5" /></button>
        <button className="icon-btn"><Play    className="w-3.5 h-3.5" /></button>
        <button className="icon-btn"><Pencil  className="w-3.5 h-3.5" /></button>
        <button className="icon-btn text-danger/60 hover:text-danger hover:bg-danger/10"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    ),
  },
];

export default function ExamsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const active    = MOCK_EXAMS.filter((e) => e.status === "active").length;
  const scheduled = MOCK_EXAMS.filter((e) => e.status === "scheduled").length;
  const completed = MOCK_EXAMS.filter((e) => e.status === "completed").length;

  const { search, setSearch, paginated, total, page, setPage, totalPages, handleSort, sortKey, sortDir } =
    useFilter({ data: MOCK_EXAMS as unknown as Record<string, unknown>[], searchKeys: ["title", "subject", "code", "dept"] });

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Exams"
          description={`${MOCK_EXAMS.length} exams · ${active} active right now`}
          actions={
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
              <Button variant="primary"   icon={<Plus      className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>Create Exam</Button>
            </div>
          }
        />

        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total Exams"  value={MOCK_EXAMS.length} icon={<ClipboardList className="w-4 h-4" />} color="primary"  />
          <StatCard index={1} label="Active"        value={active}           icon={<Play          className="w-4 h-4" />} color="success" delta="Running now" deltaType="up" />
          <StatCard index={2} label="Scheduled"     value={scheduled}        icon={<Calendar      className="w-4 h-4" />} color="cyan"    />
          <StatCard index={3} label="Completed"     value={completed}        icon={<CheckCircle2  className="w-4 h-4" />} color="cyan"    />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="section-title">All Exams</p>
              <p className="section-subtitle">{total} results</p>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams…"
                className="input-premium pl-8 w-56 h-8 text-[12.5px]"
              />
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={paginated as unknown as AdminExam[]}
            page={page} totalPages={totalPages} total={total} perPage={20}
            onPageChange={setPage}
            sortKey={sortKey as string | null} sortDir={sortDir}
            onSort={handleSort as (k: string) => void}
            emptyMessage="No exams found"
            emptyIcon={<ClipboardList className="w-8 h-8 text-text-muted/40" />}
          />
        </div>
      </div>
      <CreateExamModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </AppShell>
  );
}
