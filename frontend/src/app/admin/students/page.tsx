"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import {
  Search, Plus, GraduationCap, CheckCircle, XCircle,
  Lock, Eye, EyeOff, Hash, BookOpen, Layers,
  AlertCircle, RefreshCw, ShieldCheck, ShieldOff, UserPlus, KeyRound
} from "lucide-react";
import {
  getStudents, createStudentUser, resetStudentPassword, setStudentStatus,
  type AuthUser,
} from "@/lib/api";

// ── Shared input row ─────────────────────────────────────────────────────────

function InputRow({
  label, id, icon: Icon, type = "text", value, onChange, placeholder, required = true,
}: {
  label: string; id: string; icon: React.ElementType;
  type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: "var(--text-muted)" }}>{label}</label>
      <div className="relative">
        <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }} />
        <input id={id} required={required}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? ""}
          className="input-field pl-9 !rounded-xl text-sm"
          style={{ paddingRight: isPassword ? "2.5rem" : undefined }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}>
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function StudentUserManagementPage() {
  const router = useRouter();

  // Auth state
  const [role,       setRole]       = useState<string | null>(null);
  const [userId,     setUserId]     = useState("");
  const [authReady,  setAuthReady]  = useState(false);

  // Data
  const [students,   setStudents]   = useState<AuthUser[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [cName,      setCName]      = useState("");
  const [cRoll,      setCRoll]      = useState("");
  const [cDept,      setCDept]      = useState("");
  const [cClass,     setCClass]     = useState("");
  const [cPass,      setCPass]      = useState("");
  const [cConfirm,   setCConfirm]   = useState("");
  const [cLoading,   setCLoading]   = useState(false);
  const [cError,     setCError]     = useState("");
  const [cSuccess,   setCSuccess]   = useState("");

  // Reset password
  const [resetRoll,  setResetRoll]  = useState<string | null>(null);
  const [newPass,    setNewPass]    = useState("");
  const [rLoading,   setRLoading]   = useState(false);
  const [rMsg,       setRMsg]       = useState("");

  // Status toggle
  const [toggling,   setToggling]   = useState<string | null>(null);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  // TODO (backend): Replace with JWT-based role validation
  useEffect(() => {
    const r  = sessionStorage.getItem("role");
    const id = sessionStorage.getItem("identifier") || sessionStorage.getItem("user_id") || "";
    if (!r || r === "student") {
      router.replace("/role-select");
      return;
    }
    setRole(r);
    setUserId(id);
    setAuthReady(true);
  }, [router]);

  // ── Fetch students ─────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      setStudents(res.students);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) fetchStudents();
  }, [authReady, fetchStudents]);

  // ── Create student handler ─────────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!cName.trim() || !cRoll.trim() || !cPass.trim()) {
      setCError("Full Name, Roll Number, and Password are required."); return;
    }
    if (cPass !== cConfirm) { setCError("Passwords do not match."); return; }
    if (cPass.length < 4)   { setCError("Password must be at least 4 characters."); return; }

    setCError(""); setCSuccess(""); setCLoading(true);
    try {
      await createStudentUser({
        full_name:       cName.trim(),
        roll_number:     cRoll.trim(),
        department:      cDept.trim() || undefined,
        class_name:      cClass.trim() || undefined,
        password:        cPass,
        created_by:      userId,
        created_by_role: role || "admin",
      });
      setCSuccess(`Student ID "${cRoll.trim()}" created successfully.`);
      setCName(""); setCRoll(""); setCDept(""); setCClass(""); setCPass(""); setCConfirm("");
      fetchStudents();
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Failed.";
      if (raw.includes("BACKEND_DOWN")) {
        setCError("⚠️ Backend server is not running.");
      } else if (raw.includes("already registered")) {
        setCError(`Roll Number "${cRoll.trim()}" is already registered.`);
      } else {
        setCError(raw.replace(/^\d+:/, ""));
      }
    } finally {
      setCLoading(false);
    }
  }

  // ── Reset password handler ─────────────────────────────────────────────────
  async function handleReset() {
    if (!resetRoll || !newPass.trim()) return;
    setRLoading(true); setRMsg("");
    try {
      await resetStudentPassword({
        roll_number:     resetRoll,
        new_password:    newPass,
        updated_by:      userId,
        updated_by_role: role || "admin",
      });
      setRMsg("Password reset successfully.");
      setNewPass("");
      setTimeout(() => { setResetRoll(null); setRMsg(""); }, 2000);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Failed.";
      setRMsg(raw.replace(/^\d+:/, ""));
    } finally {
      setRLoading(false);
    }
  }

  // ── Toggle active status ───────────────────────────────────────────────────
  async function handleToggle(s: AuthUser) {
    setToggling(s.identifier);
    try {
      await setStudentStatus({
        roll_number:     s.identifier,
        is_active:       !s.is_active,
        updated_by:      userId,
        updated_by_role: role || "admin",
      });
      fetchStudents();
    } catch { /* silent */ }
    finally { setToggling(null); }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(q)
    || (s.roll_number || "").toLowerCase().includes(q)
    || (s.department || "").toLowerCase().includes(q)
    || (s.class_name || "").toLowerCase().includes(q)
  );

  const activeCount   = students.filter(s => s.is_active).length;
  const inactiveCount = students.length - activeCount;

  if (!authReady) return null;

  // ── Access Denied for students ─────────────────────────────────────────────
  if (role === "student") {
    return (
      <AdminLayout title="Access Denied" subtitle="">
        <div className="flex flex-col items-center justify-center py-20">
          <ShieldOff size={44} style={{ color: "var(--danger)" }} />
          <h2 className="text-xl font-bold mt-4" style={{ color: "var(--text-primary)" }}>Access Denied</h2>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            Students are not permitted to access this page.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Student User Management" subtitle="Create and manage student login credentials for examination access.">

      {/* ── Stats ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Total Students",    value: students.length,  color: "var(--primary)", border: "rgba(37,99,235,0.2)" },
          { label: "Active Students",   value: activeCount,      color: "var(--success)", border: "rgba(22,163,74,0.2)" },
          { label: "Deactivated",       value: inactiveCount,    color: "var(--danger)",  border: "rgba(220,38,38,0.2)" },
        ].map(({ label, value, color, border }) => (
          <div key={label} className="px-4 py-2.5 rounded-xl"
            style={{ background: "var(--card)", border: `1px solid ${border}` }}>
            <span className="text-lg font-bold" style={{ color }}>{value}</span>
            <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, roll, dept, class…" className="input-field pl-8" />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setShowCreate(!showCreate); setCError(""); setCSuccess(""); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
          <UserPlus size={13} /> Create Student ID
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={fetchStudents}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          <RefreshCw size={12} /> Refresh
        </motion.button>
      </div>

      {/* ── Create Student Form (inline card) ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
            <div className="rounded-2xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--primary-muted)" }}>
                  <UserPlus size={16} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Create Student ID</h3>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Created by {role === "admin" ? "Admin" : "Teacher / Invigilator"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputRow label="Full Name" id="cs-name" icon={GraduationCap}
                  value={cName} onChange={setCName} placeholder="Student full name" />
                <InputRow label="Roll Number" id="cs-roll" icon={Hash}
                  value={cRoll} onChange={setCRoll} placeholder="e.g. 21AI001" />
                <InputRow label="Department" id="cs-dept" icon={BookOpen} required={false}
                  value={cDept} onChange={setCDept} placeholder="e.g. AIML" />
                <InputRow label="Class Name" id="cs-class" icon={Layers} required={false}
                  value={cClass} onChange={setCClass} placeholder="e.g. III Year A" />
                <InputRow label="Password" id="cs-pass" icon={Lock} type="password"
                  value={cPass} onChange={setCPass} placeholder="Min 4 characters" />
                <InputRow label="Confirm Password" id="cs-confirm" icon={Lock} type="password"
                  value={cConfirm} onChange={setCConfirm} placeholder="Re-enter password" />

                <div className="sm:col-span-2 space-y-2">
                  <AnimatePresence>
                    {cError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                        style={{ color: "var(--danger)", background: "var(--danger-soft)", border: "1px solid var(--danger-border)" }}>
                        <AlertCircle size={13} /> {cError}
                      </motion.div>
                    )}
                    {cSuccess && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                        style={{ color: "var(--success)", background: "var(--success-muted)", border: "1px solid rgba(22,163,74,0.25)" }}>
                        <CheckCircle size={13} /> {cSuccess}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={cLoading}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
                    {cLoading ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />Creating…</>
                    ) : <><UserPlus size={14} /> Create Student ID</>}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Student Table ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>

        {/* Header */}
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.2fr_1fr_1.2fr] gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-deep)" }}>
          {["Student", "Roll Number", "Department", "Class", "Status", "Created By", "Role", "Actions"].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</p>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-14">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
            className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.2fr_1fr_1.2fr] gap-2 px-5 py-3 table-row"
            style={{ borderBottom: "1px solid var(--border-soft)" }}>

            {/* Name + avatar */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: s.is_active ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "var(--border)" }}>
                {s.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{s.full_name}</span>
            </div>

            {/* Roll */}
            <span className="text-sm font-mono flex items-center" style={{ color: "var(--text-secondary)" }}>{s.roll_number || s.identifier}</span>

            {/* Dept */}
            <span className="text-xs flex items-center truncate" style={{ color: "var(--text-secondary)" }}>{s.department || "—"}</span>

            {/* Class */}
            <span className="text-xs flex items-center" style={{ color: "var(--text-secondary)" }}>{s.class_name || "—"}</span>

            {/* Status */}
            <div className="flex items-center">
              {s.is_active ? (
                <span className="badge badge-success text-[10px] flex items-center gap-1">
                  <ShieldCheck size={10} /> Active
                </span>
              ) : (
                <span className="badge badge-danger text-[10px] flex items-center gap-1">
                  <ShieldOff size={10} /> Inactive
                </span>
              )}
            </div>

            {/* Created by */}
            <span className="text-xs flex items-center truncate" style={{ color: "var(--text-muted)" }}>
              {s.created_by || "—"}
            </span>

            {/* Created by role */}
            <span className="text-xs flex items-center capitalize" style={{ color: "var(--text-muted)" }}>
              {s.created_by_role ? `${s.created_by_role === "admin" ? "Admin" : "Teacher"}` : "—"}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => { setResetRoll(s.identifier); setNewPass(""); setRMsg(""); }}
                title="Reset Password"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "var(--primary-muted)", border: "1px solid rgba(37,99,235,0.2)", color: "var(--primary)" }}>
                <KeyRound size={11} />
              </button>
              <button onClick={() => handleToggle(s)}
                title={s.is_active ? "Deactivate" : "Activate"}
                disabled={toggling === s.identifier}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                style={{
                  background: s.is_active ? "var(--danger-muted)" : "var(--success-muted)",
                  border: `1px solid ${s.is_active ? "rgba(220,38,38,0.2)" : "rgba(22,163,74,0.2)"}`,
                  color: s.is_active ? "var(--danger)" : "var(--success)",
                }}>
                {s.is_active ? <XCircle size={11} /> : <CheckCircle size={11} />}
              </button>
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14">
            <GraduationCap size={28} className="mb-2" style={{ color: "var(--border)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {students.length === 0 ? "No student accounts created yet." : "No students match your search."}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-deep)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Showing {filtered.length} of {students.length} students
          </p>
        </div>
      </div>

      {/* ── Reset Password Modal ── */}
      <AnimatePresence>
        {resetRoll && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setResetRoll(null)}>
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ borderBottom: "1px solid var(--border)", background: "rgba(37,99,235,0.06)" }}>
                <KeyRound size={18} style={{ color: "var(--primary)" }} />
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Reset Password</h3>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Roll: {resetRoll}</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <InputRow label="New Password" id="rp-pass" icon={Lock} type="password"
                  value={newPass} onChange={setNewPass} placeholder="Enter new password" />

                <AnimatePresence>
                  {rMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                      style={{
                        color: rMsg.includes("success") ? "var(--success)" : "var(--danger)",
                        background: rMsg.includes("success") ? "var(--success-muted)" : "var(--danger-soft)",
                      }}>
                      {rMsg.includes("success") ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {rMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={handleReset} disabled={rLoading || !newPass.trim()}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
                    {rLoading ? "Resetting…" : <><KeyRound size={13} /> Reset Password</>}
                  </motion.button>
                  <button type="button" onClick={() => setResetRoll(null)}
                    className="px-4 py-2.5 rounded-xl text-sm btn-secondary">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
