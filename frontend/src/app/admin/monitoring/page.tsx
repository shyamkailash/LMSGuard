"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import {
  Shield,
  Lock,
  Unlock,
  Monitor,
  AlertTriangle,
  ClipboardX,
  MousePointerClick,
  Wifi,
  Save,
} from "lucide-react";

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

export default function AdminMonitoringPage() {
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [connected, setConnected] = useState(false);
  const [savingStudent, setSavingStudent] = useState<string | null>(null);

  async function loadControls() {
    try {
      const data = await fetchJson<SecurityControl[]>("/api/admin/security-controls");
      setControls(data);
      setConnected(true);
    } catch (error) {
      console.error("Failed to load security controls:", error);
      setConnected(false);
    }
  }

  async function updateControl(studentId: string, patch: Partial<SecurityControl>) {
    const current = controls.find((item) => item.student_id === studentId);
    if (!current) return;

    const updated = { ...current, ...patch };

    setControls((prev) =>
      prev.map((item) => (item.student_id === studentId ? updated : item))
    );

    try {
      setSavingStudent(studentId);
      const saved = await fetchJson<SecurityControl>("/api/admin/security-controls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      setControls((prev) =>
        prev.map((item) => (item.student_id === studentId ? saved : item))
      );
    } catch (error) {
      console.error("Failed to update security control:", error);
      await loadControls();
    } finally {
      setSavingStudent(null);
    }
  }

  useEffect(() => {
    loadControls();
    const timer = setInterval(loadControls, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main
      className="min-h-screen p-6"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <section
        className="rounded-3xl p-6 mb-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(124,58,237,0.08))",
          border: "1px solid rgba(37,99,235,0.25)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--primary)" }}
            >
              LMSGuard Admin Control
            </p>

            <h1 className="text-3xl font-bold mb-2">
              Examination Security Panel
            </h1>

            <p className="text-sm max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Control student monitoring, exam lock, screenshot capture,
              unauthorized app detection, clipboard blocking, and tab-switch
              protection from one admin console.
            </p>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{
              background: connected ? "var(--success-muted)" : "var(--danger-muted)",
              color: connected ? "var(--success)" : "var(--danger)",
              border: "1px solid var(--border)",
            }}
          >
            <Wifi size={15} />
            {connected ? "Database Connected" : "Backend Disconnected"}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Metric title="Students Controlled" value={controls.length} />
        <Metric
          title="Monitoring Enabled"
          value={controls.filter((c) => c.monitoring_enabled).length}
        />
        <Metric
          title="Exam Locked"
          value={controls.filter((c) => c.exam_locked).length}
        />
        <Metric
          title="App Blocking"
          value={controls.filter((c) => c.unauthorized_app_blocking).length}
        />
      </section>

      <section className="space-y-4">
        {controls.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--card)",
              border: "1px dashed var(--border)",
              color: "var(--text-muted)",
            }}
          >
            No real student-agent data found yet. Start the student-agent to
            register students.
          </div>
        ) : (
          controls.map((control) => (
            <StudentSecurityCard
              key={control.student_id}
              control={control}
              saving={savingStudent === control.student_id}
              onChange={(patch) => updateControl(control.student_id, patch)}
            />
          ))
        )}
      </section>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
    </div>
  );
}

function StudentSecurityCard({
  control,
  saving,
  onChange,
}: {
  control: SecurityControl;
  saving: boolean;
  onChange: (patch: Partial<SecurityControl>) => void;
}) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
        <div className="min-w-[220px]">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: control.exam_locked
                  ? "var(--danger-muted)"
                  : "var(--primary-muted)",
                color: control.exam_locked ? "var(--danger)" : "var(--primary)",
              }}
            >
              {control.exam_locked ? <Lock size={20} /> : <Unlock size={20} />}
            </div>

            <div>
              <h2 className="font-bold text-lg">{control.student_id}</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Last updated: {control.updated_at}
              </p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: control.exam_locked
                ? "var(--danger-muted)"
                : "var(--success-muted)",
              color: control.exam_locked ? "var(--danger)" : "var(--success)",
            }}
          >
            {control.exam_locked ? "EXAM LOCKED" : "EXAM ACTIVE"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 flex-1">
          <Toggle
            title="Monitoring"
            description="Enable live tracking"
            icon={<Shield size={16} />}
            checked={control.monitoring_enabled}
            onChange={(value) => onChange({ monitoring_enabled: value })}
          />

          <Toggle
            title="Exam Lock"
            description="Lock student session"
            icon={<Lock size={16} />}
            checked={control.exam_locked}
            onChange={(value) => onChange({ exam_locked: value })}
          />

          <Toggle
            title="Screenshots"
            description="Capture screen evidence"
            icon={<Monitor size={16} />}
            checked={control.screen_capture_enabled}
            onChange={(value) => onChange({ screen_capture_enabled: value })}
          />

          <Toggle
            title="Unauthorized Apps"
            description="Detect blocked apps"
            icon={<AlertTriangle size={16} />}
            checked={control.unauthorized_app_blocking}
            onChange={(value) => onChange({ unauthorized_app_blocking: value })}
          />

          <Toggle
            title="Clipboard Block"
            description="Prevent copy/paste"
            icon={<ClipboardX size={16} />}
            checked={control.clipboard_blocked}
            onChange={(value) => onChange({ clipboard_blocked: value })}
          />

          <Toggle
            title="Tab Switch Block"
            description="Detect switching"
            icon={<MousePointerClick size={16} />}
            checked={control.tab_switch_blocked}
            onChange={(value) => onChange({ tab_switch_blocked: value })}
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Warning Message
        </label>

        <div className="flex flex-col md:flex-row gap-3 mt-2">
          <input
            value={control.warning_message}
            onChange={(e) => onChange({ warning_message: e.target.value })}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--bg-deep)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="Message shown to the student"
          />

          <button
            disabled={saving}
            className="px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{
              background: "var(--primary)",
              color: "white",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Saved"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  title,
  description,
  icon,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="rounded-2xl p-4 text-left transition-all"
      style={{
        background: checked ? "var(--primary-muted)" : "var(--bg-deep)",
        border: `1px solid ${checked ? "rgba(37,99,235,0.35)" : "var(--border)"}`,
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div style={{ color: checked ? "var(--primary)" : "var(--text-muted)" }}>
          {icon}
        </div>

        <div
          className="w-10 h-5 rounded-full p-0.5"
          style={{
            background: checked ? "var(--primary)" : "var(--border)",
          }}
        >
          <div
            className="w-4 h-4 rounded-full bg-white transition-transform"
            style={{
              transform: checked ? "translateX(20px)" : "translateX(0px)",
            }}
          />
        </div>
      </div>

      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </button>
  );
}