"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import {
  Search, CheckCircle2, XCircle, Users, Wifi, WifiOff,
  AlertTriangle, ChevronRight, Play, Shield, Clock,
  CheckCheck, Filter, RefreshCw,
} from "lucide-react";
import { MOCK_WAITING_STUDENTS, MOCK_SESSION_INFO } from "@/data/invigilatorData";
import type { WaitingStudent } from "@/data/invigilatorData";
import { cn } from "@/lib/utils";

/* ── Approval Dialog ──────────────────────────────── */
function ApprovalDialog({
  student, action, onConfirm, onCancel,
}: {
  student: WaitingStudent;
  action: "approve" | "reject";
  onConfirm: () => void;
  onCancel:  () => void;
}) {
  return (
    <Modal
      open
      onClose={onCancel}
      title={action === "approve" ? "Approve Student" : "Reject Student"}
      size="sm"
    >
      <div className="space-y-4">
        <div className={cn(
          "flex items-center gap-3 p-3.5 rounded-xl border",
          action === "approve" ? "bg-success/8 border-success/20" : "bg-danger/8 border-danger/20"
        )}>
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-[13px] font-bold text-primary shrink-0">
            {student.avatar}
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-text-primary">{student.name}</p>
            <p className="text-[12px] text-text-muted">{student.regno} · {student.class}</p>
          </div>
        </div>

        <div className="space-y-2 text-[13px] text-text-secondary">
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-text-muted">Device</span>
            <span>{student.device}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-text-muted">IP Address</span>
            <span className="font-mono text-[12px]">{student.ipAddress}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-text-muted">Face Verified</span>
            <span className={student.faceVerified ? "text-success" : "text-danger"}>
              {student.faceVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <p className="text-[13px] text-text-muted">
          {action === "approve"
            ? "Grant this student permission to begin the exam?"
            : "Reject this student's exam access? They will be notified."}
        </p>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button
          variant={action === "approve" ? "success" : "danger"}
          icon={action === "approve" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          onClick={onConfirm}
        >
          {action === "approve" ? "Approve" : "Reject"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/* ── Bulk Action Bar ───────────────────────────────── */
function BulkBar({
  selected, onApprove, onReject, onClear,
}: {
  selected: string[];
  onApprove: () => void;
  onReject: () => void;
  onClear: () => void;
}) {
  if (!selected.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="flex items-center justify-between p-3.5 rounded-xl bg-primary/8 border border-primary/25"
    >
      <div className="flex items-center gap-2">
        <CheckCheck className="w-4 h-4 text-primary" />
        <span className="text-[13px] font-semibold text-text-primary">{selected.length} selected</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={onApprove}>
          Approve All
        </Button>
        <Button variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />} onClick={onReject}>
          Reject All
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
      </div>
    </motion.div>
  );
}

/* ── Connection Badge ─────────────────────────────── */
function ConnBadge({ status }: { status: WaitingStudent["connectionStatus"] }) {
  if (status === "connected")    return <Badge variant="success" dot size="sm">Connected</Badge>;
  if (status === "weak")         return <Badge variant="warning" dot size="sm">Weak</Badge>;
  return <Badge variant="danger" dot size="sm">Offline</Badge>;
}

/* ── Permission Badge ─────────────────────────────── */
function PermBadge({ status }: { status: WaitingStudent["permissionStatus"] }) {
  if (status === "approved") return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
  if (status === "rejected") return <Badge variant="danger"  size="sm"><XCircle     className="w-3 h-3 mr-1" />Rejected</Badge>;
  return <Badge variant="warning" dot size="sm">Waiting</Badge>;
}

/* ── Main Page ─────────────────────────────────────── */
export default function WaitingRoomPage() {
  const router = useRouter();
  const [students,    setStudents]    = useState<WaitingStudent[]>(MOCK_WAITING_STUDENTS);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState<"all" | "waiting" | "approved" | "rejected">("all");
  const [selected,    setSelected]    = useState<string[]>([]);
  const [dialog,      setDialog]      = useState<{ student: WaitingStudent; action: "approve" | "reject" } | null>(null);
  const [startOpen,   setStartOpen]   = useState(false);

  const filtered = useMemo(() => students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regno.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.permissionStatus === filter;
    return matchSearch && matchFilter;
  }), [students, search, filter]);

  const stats = useMemo(() => ({
    total:    students.length,
    online:   students.filter((s) => s.connectionStatus !== "disconnected").length,
    waiting:  students.filter((s) => s.permissionStatus === "waiting").length,
    approved: students.filter((s) => s.permissionStatus === "approved").length,
    rejected: students.filter((s) => s.permissionStatus === "rejected").length,
  }), [students]);

  const toggleSelect = (id: string) =>
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id));

  const applyAction = (ids: string[], action: "approved" | "rejected") => {
    setStudents((p) => p.map((s) => ids.includes(s.id) ? { ...s, permissionStatus: action } : s));
    setSelected([]);
  };

  const confirmDialog = () => {
    if (!dialog) return;
    applyAction([dialog.student.id], dialog.action === "approve" ? "approved" : "rejected");
    setDialog(null);
  };

  const handleBulkApprove = () => {
    const waiting = selected.filter((id) => students.find((s) => s.id === id)?.permissionStatus === "waiting");
    applyAction(waiting.length ? waiting : selected, "approved");
  };

  const handleBulkReject = () => {
    const waiting = selected.filter((id) => students.find((s) => s.id === id)?.permissionStatus === "waiting");
    applyAction(waiting.length ? waiting : selected, "rejected");
  };

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-5">
        <PageHeader
          title="Student Waiting Room"
          description="DBMS Final Exam · CSE-3A · Review and approve students"
          badge={
            stats.waiting > 0
              ? <Badge variant="warning" dot>{stats.waiting} Waiting</Badge>
              : <Badge variant="success" dot>All Processed</Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Refresh</Button>
              <Button
                variant="success"
                icon={<Play className="w-3.5 h-3.5" />}
                onClick={() => setStartOpen(true)}
              >
                Start Exam
              </Button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Total",    value: stats.total,    color: "text-text-primary", bg: "bg-surface-2 border-white/6"    },
            { label: "Online",   value: stats.online,   color: "text-success",      bg: "bg-success/8 border-success/15" },
            { label: "Waiting",  value: stats.waiting,  color: "text-warning",      bg: "bg-warning/8 border-warning/15" },
            { label: "Approved", value: stats.approved, color: "text-primary",      bg: "bg-primary/8 border-primary/15" },
            { label: "Rejected", value: stats.rejected, color: "text-danger",       bg: "bg-danger/8  border-danger/15"  },
          ].map((s) => (
            <div key={s.label} className={cn("flex flex-col gap-1 px-4 py-3.5 rounded-xl border", s.bg)}>
              <span className={cn("text-[24px] font-bold font-feature leading-none", s.color)}>{s.value}</span>
              <span className="text-[11.5px] text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or register number…"
              className="input-premium pl-9 w-full"
            />
          </div>
          <div className="flex gap-1 p-1 bg-surface-2 rounded-xl border border-white/5">
            {(["all", "waiting", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[11.5px] font-medium capitalize transition-all",
                  filter === f
                    ? "bg-surface text-text-primary border border-white/6"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk bar */}
        <AnimatePresence>
          {selected.length > 0 && (
            <BulkBar
              selected={selected}
              onApprove={handleBulkApprove}
              onReject={handleBulkReject}
              onClear={() => setSelected([])}
            />
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="grid items-center px-5 py-3 border-b border-white/5 bg-surface-2/40 text-[11px] font-semibold text-text-muted uppercase tracking-wide"
            style={{ gridTemplateColumns: "2.5rem 1fr 6rem 8rem 7rem 6rem 7rem 6rem" }}
          >
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll}
            />
            <span>Student</span>
            <span>Dept</span>
            <span>Connection</span>
            <span>Permission</span>
            <span>Face ID</span>
            <span>Joined At</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-white/4">
            {filtered.map((student, idx) => {
              const isSelected = selected.includes(student.id);
              const isWaiting  = student.permissionStatus === "waiting";

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: idx * 0.03 }}
                  className={cn(
                    "grid items-center px-5 py-3.5 transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-surface-2/30"
                  )}
                  style={{ gridTemplateColumns: "2.5rem 1fr 6rem 8rem 7rem 6rem 7rem 6rem" }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    checked={isSelected}
                    onChange={() => toggleSelect(student.id)}
                  />

                  {/* Student */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
                        {student.avatar}
                      </div>
                      {student.connectionStatus === "connected" && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-text-primary truncate">{student.name}</p>
                      <p className="text-[11px] text-text-muted font-mono">{student.regno}</p>
                    </div>
                  </div>

                  {/* Dept */}
                  <span className="text-[11.5px] text-text-muted">{student.dept}</span>

                  {/* Connection */}
                  <ConnBadge status={student.connectionStatus} />

                  {/* Permission */}
                  <PermBadge status={student.permissionStatus} />

                  {/* Face ID */}
                  {student.faceVerified
                    ? <span className="flex items-center gap-1 text-[11.5px] text-success"><CheckCircle2 className="w-3.5 h-3.5" />Verified</span>
                    : <span className="flex items-center gap-1 text-[11.5px] text-danger"><XCircle className="w-3.5 h-3.5" />Failed</span>
                  }

                  {/* Joined */}
                  <span className="text-[11.5px] text-text-muted">{student.joinedAt}</span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5">
                    {isWaiting && (
                      <>
                        <button
                          onClick={() => setDialog({ student, action: "approve" })}
                          className="w-7 h-7 rounded-lg bg-success/10 hover:bg-success/20 flex items-center justify-center transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        </button>
                        <button
                          onClick={() => setDialog({ student, action: "reject" })}
                          className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger/20 flex items-center justify-center transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5 text-danger" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => router.push(`/invigilator/student-detail?id=${student.id}`)}
                      className="icon-btn w-7 h-7"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-text-muted/30" />
              <p className="text-[13px] text-text-muted">No students match your filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval dialog */}
      {dialog && (
        <ApprovalDialog
          student={dialog.student}
          action={dialog.action}
          onConfirm={confirmDialog}
          onCancel={() => setDialog(null)}
        />
      )}

      {/* Start Exam dialog */}
      <StartExamDialog
        open={startOpen}
        stats={stats}
        onClose={() => setStartOpen(false)}
        onStart={() => router.push("/invigilator/session")}
      />
    </AppShell>
  );
}

/* ── Start Exam Dialog ────────────────────────────── */
function StartExamDialog({
  open, stats, onClose, onStart,
}: {
  open: boolean;
  stats: { approved: number; waiting: number; total: number };
  onClose: () => void;
  onStart: () => void;
}) {
  const session = MOCK_SESSION_INFO;
  return (
    <Modal open={open} onClose={onClose} title="Start Exam Session" size="md">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-success/8 border border-success/20 space-y-2">
          <p className="text-[12px] text-text-muted uppercase tracking-wide font-medium">Session Details</p>
          {[
            { label: "Exam",       value: session.examTitle   },
            { label: "Class",      value: session.classLabel  },
            { label: "Duration",   value: `${session.duration} minutes` },
            { label: "Passcode",   value: session.passcode    },
            { label: "Invigilator",value: session.invigilator },
          ].map((f) => (
            <div key={f.label} className="flex justify-between text-[13px]">
              <span className="text-text-muted">{f.label}</span>
              <span className="font-semibold text-text-primary">{f.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Approved", value: stats.approved, color: "text-success" },
            { label: "Waiting",  value: stats.waiting,  color: "text-warning" },
            { label: "Total",    value: stats.total,    color: "text-text-primary" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-surface-2/60">
              <p className={`text-[24px] font-bold font-feature ${s.color}`}>{s.value}</p>
              <p className="text-[11.5px] text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {stats.waiting > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-warning/8 border border-warning/20">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-text-secondary">
              {stats.waiting} students are still waiting for approval. Starting now will lock out unapproved students.
            </p>
          </div>
        )}
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant="success"
          icon={<Play className="w-3.5 h-3.5" />}
          onClick={onStart}
        >
          Start Session
        </Button>
      </ModalFooter>
    </Modal>
  );
}
