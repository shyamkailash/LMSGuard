"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/api";
import {
  Shield, Lock, Unlock, Monitor, AlertTriangle,
  ClipboardX, MousePointerClick, Wifi, Save,
  Key, RefreshCw, Copy, CheckCircle, XCircle
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { getSession } from "@/lib/session";
import { useRouteGuard } from "@/lib/useRouteGuard";

type SecurityControl = {
  student_id: string;
  monitoring_enabled: boolean;
  exam_locked: boolean;
  screen_capture_enabled: boolean;
  unauthorized_app_blocking: boolean;
  clipboard_blocked: boolean;
  tab_switch_blocked: boolean;
  warning_message: string;
  updated_at: string;
};

type UserRole = "admin" | "invigilator" | "student";

/** Generate a random exam password */
function generatePassword(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Password card for start/quit password */
function ExamPasswordCard({
  title,
  description,
  icon: Icon,
  password,
  onRegenerate,
  canEdit,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  password: string;
  onRegenerate: () => void;
  canEdit: boolean;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-2xl p-5"
         style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{description}</p>
        </div>
        {/* Status badge */}
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
             style={{ background: "var(--success-muted)", color: "var(--success)", border: "1px solid var(--success-border)" }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--success)" }} />
          Active
        </div>
      </div>

      {/* Password display */}
      <div className="flex items-center gap-2 p-3 rounded-xl mb-3"
           style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
        <code className="flex-1 text-lg font-mono font-bold tracking-widest"
              style={{ color: "var(--text-primary)", letterSpacing: "0.25em" }}>
          {password}
        </code>
        {canEdit && (
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: copied ? "var(--success-muted)" : "var(--primary-muted)",
              color: copied ? "var(--success)" : "var(--primary)",
              border: `1px solid ${copied ? "var(--success-border)" : "var(--primary-border)"}`,
            }}>
            {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Expiry placeholder */}
      <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
        Expiry: End of current exam session ·{" "}
        {/* TODO: Connect to backend for persistent password storage with real expiry */}
        <span style={{ color: "var(--text-subtle)" }}>TODO: persist to backend</span>
      </p>

      {canEdit ? (
        <button onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary-border)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
          <RefreshCw size={14} /> Regenerate Password
        </button>
      ) : (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Contact Admin to update this password.
        </p>
      )}
    </div>
  );
}

export default function AdminMonitoringPage() {
  const router = useRouter();
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [connected, setConnected] = useState(false);
  const [savingStudent, setSavingStudent] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const guard = useRouteGuard(["admin", "invigilator"]);

  // Exam passwords — client-side for now
  // TODO: Fetch from POST /api/admin/exam-passwords and persist there
  const [startPassword, setStartPassword] = useState(() => generatePassword());
  const [quitPassword,  setQuitPassword]  = useState(() => generatePassword());

  useEffect(() => {
    if (guard !== "allowed") return;

    // TODO (backend): Validate role server-side in FastAPI middleware.
    const session = getSession();
    if (!session) return;

    setRole(session.role as UserRole);
    loadControls();
    const timer = setInterval(loadControls, 5000);
    return () => clearInterval(timer);
  }, [guard]);

  async function loadControls() {
    try {
      const data = await fetchJson<SecurityControl[]>("/api/admin/security-controls");
      setControls(data);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }

  async function updateControl(studentId: string, patch: Partial<SecurityControl>) {
    const current = controls.find(item => item.student_id === studentId);
    if (!current) return;
    const updated = { ...current, ...patch };
    setControls(prev => prev.map(item => item.student_id === studentId ? updated : item));
    try {
      setSavingStudent(studentId);
      const saved = await fetchJson<SecurityControl>("/api/admin/security-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setControls(prev => prev.map(item => item.student_id === studentId ? saved : item));
    } catch {
      await loadControls();
    } finally {
      setSavingStudent(null);
    }
  }

  if (guard === "loading") return null;

  if (guard === "denied" || role === "student") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6"
            style={{ background: "var(--bg)" }}>
        <div className="max-w-sm w-full text-center rounded-3xl p-8"
             style={{ background: "var(--card)", border: "1px solid var(--danger-border)", boxShadow: "var(--shadow-md)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
               style={{ background: "var(--danger-muted)" }}>
            <XCircle size={32} style={{ color: "var(--danger)" }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Access Denied</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Students cannot access the Examination Security Panel.
            This area is restricted to Admin and Invigilator roles only.
          </p>
          <button onClick={() => router.replace("/login")}
            className="w-full py-2.5 rounded-xl text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
            Return to Login
          </button>
        </div>
      </main>
    );
  }

  const canEdit = role === "admin" || role === "invigilator";

  return (
    <main className="min-h-screen p-6" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="fixed right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      {/* Header */}
      <section className="rounded-3xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(124,58,237,0.08))",
          border: "1px solid rgba(37,99,235,0.25)",
          boxShadow: "var(--shadow)",
        }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>
              LMSGuard Admin Control
            </p>
            <h1 className="text-3xl font-bold mb-2">Examination Security Panel</h1>
            <p className="text-sm max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Control student monitoring, exam lock, screenshot capture, unauthorized app detection,
              clipboard blocking, and tab-switch protection from one admin console.
              {role === "invigilator" && (
                <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: "var(--warning-muted)", color: "var(--warning)" }}>
                  Invigilator — session controls enabled
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
               style={{
                 background: connected ? "var(--success-muted)" : "var(--danger-muted)",
                 color: connected ? "var(--success)" : "var(--danger)",
                 border: "1px solid var(--border)",
               }}>
            <Wifi size={15} />
            {connected ? "Database Connected" : "Backend Disconnected"}
          </div>
        </div>
      </section>

      {/* Exam passwords and session controls (Admin and Invigilator can edit) */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Exam Session Passwords
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExamPasswordCard
            title="Start Password"
            description="Student must enter this to begin the exam"
            icon={Key}
            password={startPassword}
            onRegenerate={() => setStartPassword(generatePassword())}
            canEdit={canEdit}
          />
          <ExamPasswordCard
            title="Quit Password"
            description="Student must enter this to complete and submit the exam"
            icon={Lock}
            password={quitPassword}
            onRegenerate={() => setQuitPassword(generatePassword())}
            canEdit={canEdit}
          />
        </div>
      </section>

      {/* Metric summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Metric title="Students Controlled" value={controls.length} />
        <Metric title="Monitoring Enabled"  value={controls.filter(c => c.monitoring_enabled).length} />
        <Metric title="Exam Locked"         value={controls.filter(c => c.exam_locked).length} />
        <Metric title="App Blocking"        value={controls.filter(c => c.unauthorized_app_blocking).length} />
      </section>

      {/* Student security cards */}
      <section className="space-y-4">
        {controls.length === 0 ? (
          <div className="rounded-2xl p-8 text-center"
               style={{ background: "var(--card)", border: "1px dashed var(--border)", color: "var(--text-muted)" }}>
            No student-agent data found yet. Start the student-agent to register students.
          </div>
        ) : (
          controls.map(control => (
            <StudentSecurityCard
              key={control.student_id}
              control={control}
              saving={savingStudent === control.student_id}
              canEdit={canEdit}
              onChange={patch => updateControl(control.student_id, patch)}
            />
          ))
        )}
      </section>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-2xl p-5"
         style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{title}</p>
    </div>
  );
}

function StudentSecurityCard({
  control, saving, canEdit, onChange,
}: {
  control: SecurityControl;
  saving: boolean;
  canEdit: boolean;
  onChange: (patch: Partial<SecurityControl>) => void;
}) {
  return (
    <div className="rounded-3xl p-5"
         style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
        <div className="min-w-[220px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                 style={{
                   background: control.exam_locked ? "var(--danger-muted)" : "var(--primary-muted)",
                   color: control.exam_locked ? "var(--danger)" : "var(--primary)",
                 }}>
              {control.exam_locked ? <Lock size={20} /> : <Unlock size={20} />}
            </div>
            <div>
              <h2 className="font-bold text-lg">{control.student_id}</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Last updated: {control.updated_at}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
               style={{
                 background: control.exam_locked ? "var(--danger-muted)" : "var(--success-muted)",
                 color: control.exam_locked ? "var(--danger)" : "var(--success)",
               }}>
            {control.exam_locked ? "EXAM LOCKED" : "EXAM ACTIVE"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 flex-1">
          {[
            { title: "Monitoring",       desc: "Enable live tracking",    icon: <Shield size={16}/>,            key: "monitoring_enabled"        },
            { title: "Exam Lock",        desc: "Lock student session",    icon: <Lock size={16}/>,              key: "exam_locked"               },
            { title: "Screenshots",      desc: "Capture screen evidence", icon: <Monitor size={16}/>,           key: "screen_capture_enabled"    },
            { title: "Unauthorized Apps",desc: "Detect blocked apps",     icon: <AlertTriangle size={16}/>,     key: "unauthorized_app_blocking" },
            { title: "Clipboard Block",  desc: "Prevent copy/paste",      icon: <ClipboardX size={16}/>,        key: "clipboard_blocked"         },
            { title: "Tab Switch Block", desc: "Detect switching",         icon: <MousePointerClick size={16}/>, key: "tab_switch_blocked"        },
          ].map(({ title, desc, icon, key }) => (
            <Toggle
              key={key}
              title={title}
              description={desc}
              icon={icon}
              checked={control[key] as boolean}
              disabled={!canEdit}
              onChange={val => onChange({ [key]: val } as Partial<SecurityControl>)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Warning Message
        </label>
        <div className="flex flex-col md:flex-row gap-3 mt-2">
          <input
            value={control.warning_message}
            onChange={e => onChange({ warning_message: e.target.value })}
            disabled={!canEdit}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--bg-deep)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              opacity: canEdit ? 1 : 0.6,
            }}
            placeholder="Message shown to the student"
          />
          {canEdit && (
            <button disabled={saving}
              className="px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "white", opacity: saving ? 0.7 : 1 }}>
              <Save size={15} />
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ title, description, icon, checked, onChange, disabled }: {
  title: string; description: string; icon: React.ReactNode;
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <button onClick={() => !disabled && onChange(!checked)}
      className="rounded-2xl p-4 text-left transition-all"
      style={{
        background: checked ? "var(--primary-muted)" : "var(--bg-deep)",
        border: `1px solid ${checked ? "rgba(37,99,235,0.35)" : "var(--border)"}`,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div style={{ color: checked ? "var(--primary)" : "var(--text-muted)" }}>{icon}</div>
        <div className="w-10 h-5 rounded-full p-0.5" style={{ background: checked ? "var(--primary)" : "var(--border)" }}>
          <div className="w-4 h-4 rounded-full bg-white transition-transform"
               style={{ transform: checked ? "translateX(20px)" : "translateX(0px)" }} />
        </div>
      </div>
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{description}</p>
    </button>
  );
}
