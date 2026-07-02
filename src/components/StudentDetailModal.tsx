"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Keyboard, Mouse, Wifi, AlertTriangle, CheckCircle, Zap } from "lucide-react";

export default function StudentDetailModal({ student, onClose }) {
  if (!student) return null;
  const risk = student.risk ?? 0;
  const riskColor = risk >= 70 ? "var(--danger)" : risk >= 35 ? "var(--warning)" : "var(--success)";
  const riskBarClass = risk >= 70 ? "risk-bar-danger" : risk >= 35 ? "risk-bar-warning" : "risk-bar-safe";

  const ACTIVITY = [
    { icon: Keyboard, label: "Keyboard", status: "Active",    color: "var(--success)" },
    { icon: Mouse,    label: "Mouse",    status: "Active",    color: "var(--success)" },
    { icon: Wifi,     label: "Network",  status: "Connected", color: "var(--primary)"  },
    { icon: Monitor,  label: "Screen",   status: "Recording", color: "var(--warning)" },
  ];

  const violations = student.violations || [
    { time:"10:30", type:"Browser Switch",      severity:"medium"   },
    { time:"10:40", type:"Unknown Application", severity:"critical" },
  ];

  const SEV = {
    critical: "badge-danger",
    warning:  "badge-warning",
    medium:   "badge-warning",
    safe:     "badge-success",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4"
               style={{ borderBottom: "1px solid var(--border)", background: "var(--primary-muted)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4D1E] to-[#F5C800] flex items-center justify-center text-white font-bold text-sm">
                {student.avatar}
              </div>
              <div>
                <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>{student.name}</h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{student.regno} · {student.exam}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${student.status === "safe" ? "badge-success" : student.status === "violation" ? "badge-danger" : "badge-warning"}`}>
                {student.status === "safe" ? <CheckCircle size={9}/> : <AlertTriangle size={9}/>}
                {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
              </span>
              <button onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4 max-h-[68vh] overflow-y-auto">
            {/* Live Screen */}
            <div className="rounded-xl relative overflow-hidden aspect-video"
                 style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
              <div className="absolute inset-0 p-4 space-y-2.5 opacity-20">
                {[80,60,90,45,70].map((w,i) => (
                  <div key={i} className="h-2 rounded" style={{ width:`${w}%`, background:"var(--border)" }}/>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Monitor size={36} style={{ color: "var(--border)" }} />
              </div>
              {/* LIVE */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
                   style={{ background: "var(--danger)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white live-blink"/>
                <span className="text-white text-[9px] font-bold">LIVE SCREEN</span>
              </div>
              {/* Avatar */}
              <div className="absolute bottom-2 left-2 w-9 h-9 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800] flex items-center justify-center text-white text-xs font-bold"
                   style={{ border: "2px solid var(--card)" }}>
                {student.avatar}
              </div>
              {/* Current Window */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg"
                   style={{ background: "rgba(0,0,0,0.7)", border: "1px solid var(--border)" }}>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Current Window</p>
                <p className="text-xs font-medium text-white">Chrome · Exam Portal</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="rounded-xl p-4" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Zap size={13} style={{ color: riskColor }}/>
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Risk Score</span>
                </div>
                <span className="text-xl font-bold" style={{ color: riskColor }}>{risk}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${risk}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${riskBarClass}`}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px]">
                <span style={{ color: "var(--success)" }}>Safe</span>
                <span style={{ color: "var(--warning)" }}>Warning</span>
                <span style={{ color: "var(--danger)" }}>Critical</span>
              </div>
            </div>

            {/* Activity */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Live Activity</h4>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY.map(({ icon: Icon, label, status, color }) => (
                  <div key={label} className="flex items-center justify-between p-2.5 rounded-xl"
                       style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <Icon size={13} style={{ color: "var(--text-muted)" }}/>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: color }}/>
                      <span className="text-xs font-medium" style={{ color }}>{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Violation History */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Violation History</h4>
              <div className="space-y-2">
                {violations.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl"
                       style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={12} style={{ color: v.severity === "critical" ? "var(--danger)" : "var(--warning)" }}/>
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{v.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{v.time}</span>
                      <span className={`badge ${SEV[v.severity] || "badge-warning"}`}>{v.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button className="flex-1 py-2 text-sm font-semibold rounded-xl transition-colors btn-primary" style={{ background:"var(--danger)" }}>
              Flag Violation
            </button>
            <button className="flex-1 py-2 text-sm font-semibold rounded-xl btn-primary">
              Send Warning
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl btn-secondary">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
