"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Monitor, Keyboard, Mouse, Wifi, AlertTriangle, CheckCircle, Zap,
  Pause, Square, Ban, MessageSquare, LogOut, Clock, Download, FileText,
  Activity, Eye, WifiOff, Shield
} from "lucide-react";

export default function AdminStudentDetailModal({ student, onClose, onAction }) {
  if (!student) return null;
  
  const risk = student.risk ?? 0;
  const riskColor = risk >= 70 ? "var(--danger)" : risk >= 35 ? "var(--warning)" : "var(--success)";
  const riskBarClass = risk >= 70 ? "risk-bar-danger" : risk >= 35 ? "risk-bar-warning" : "risk-bar-safe";

  const ACTIVITY = [
    { icon: Keyboard, label: "Keyboard", status: "Active",    color: "var(--success)" },
    { icon: Mouse,    label: "Mouse",    status: "Active",    color: "var(--success)" },
    { icon: Wifi,     label: "Network",  status: student.networkStatus === "stable" ? "Connected" : student.networkStatus === "weak" ? "Weak" : "Offline", color: student.networkStatus === "stable" ? "var(--primary)" : student.networkStatus === "weak" ? "var(--warning)" : "var(--danger)" },
    { icon: Monitor,  label: "Screen",   status: "Recording", color: "var(--warning)" },
  ];

  const violations = student.violations || [];

  const SEV = {
    critical: "badge-danger",
    warning:  "badge-warning",
    medium:   "badge-warning",
    safe:     "badge-success",
  };

  // Admin Actions
  const adminActions = [
    { id: "pause", label: "Pause Exam", icon: Pause, color: "var(--warning)", type: "warning" },
    { id: "terminate", label: "Terminate", icon: Square, color: "var(--danger)", type: "danger" },
    { id: "block", label: "Block Student", icon: Ban, color: "var(--danger)", type: "danger" },
    { id: "warning", label: "Send Warning", icon: MessageSquare, color: "var(--warning)", type: "warning" },
    { id: "logout", label: "Force Logout", icon: LogOut, color: "var(--danger)", type: "danger" },
    { id: "extratime", label: "Grant Extra Time", icon: Clock, color: "var(--success)", type: "success" },
    { id: "download", label: "Download Logs", icon: Download, color: "var(--primary)", type: "primary" },
    { id: "remark", label: "Add Remark", icon: FileText, color: "var(--primary)", type: "primary" },
  ];

  const handleAction = (actionId) => {
    if (onAction) onAction(actionId, student.id);
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
          className="w-full max-w-4xl rounded-2xl overflow-hidden"
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
                <div className="flex items-center gap-2">
                  <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>{student.name}</h2>
                  <Shield size={12} style={{ color: "var(--primary)" }} title="Admin Monitoring"/>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {student.regno} · {student.class} · {student.exam}
                </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 max-h-[75vh] overflow-y-auto">
            {/* Left Column - Live Feed & Info */}
            <div className="lg:col-span-2 space-y-4">
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
                  <p className="text-xs font-medium text-white">{student.currentWindow || "Chrome · Exam Portal"}</p>
                </div>
              </div>

              {/* Student Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Department</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{student.dept}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Class</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{student.class}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Exam</p>
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{student.exam}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Invigilator</p>
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{student.invigilator || "John Martin"}</p>
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
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Violation History ({violations.length})
                </h4>
                {violations.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {violations.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl"
                           style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={12} style={{ color: v.severity === "critical" ? "var(--danger)" : "var(--warning)" }}/>
                          <div>
                            <span className="text-sm" style={{ color: "var(--text-primary)" }}>{v.type}</span>
                            {v.detail && <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{v.detail}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{v.time}</span>
                          <span className={`badge ${SEV[v.severity] || "badge-warning"}`}>{v.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-4 text-center" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                    <CheckCircle size={24} className="mx-auto mb-2" style={{ color: "var(--success)" }}/>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No violations detected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Admin Actions */}
            <div className="space-y-4">
              <div className="rounded-xl p-3" style={{ background: "var(--primary-muted)", border: "1px solid rgba(37,99,235,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} style={{ color: "var(--primary)" }}/>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                    Admin Controls
                  </h4>
                </div>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  Full system management and control actions
                </p>
              </div>

              {/* Exam Timer */}
              <div className="rounded-xl p-3" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} style={{ color: "var(--warning)" }}/>
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Exam Timer</span>
                  </div>
                  <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>45:32</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: "76%", background: "var(--warning)" }}/>
                </div>
              </div>

              {/* AI Status */}
              <div className="rounded-xl p-3" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} style={{ color: "var(--success)" }}/>
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>AI Monitoring</span>
                  </div>
                  <span className="badge badge-success text-[9px]">Active</span>
                </div>
              </div>

              {/* Admin Action Buttons */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  {adminActions.map(({ id, label, icon: Icon, color, type }) => (
                    <motion.button key={id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(id)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: type === "danger" ? "var(--danger-muted)" : type === "warning" ? "var(--warning-muted)" : type === "success" ? "var(--success-muted)" : "var(--primary-muted)",
                        border: `1px solid ${type === "danger" ? "rgba(220,38,38,0.2)" : type === "warning" ? "rgba(217,119,6,0.2)" : type === "success" ? "rgba(22,163,74,0.2)" : "rgba(37,99,235,0.2)"}`,
                        color: color,
                      }}>
                      <Icon size={13}/>
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Screenshot History */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Screenshot History
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-video rounded-lg relative overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                         style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye size={16} style={{ color: "var(--border)" }}/>
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono"
                           style={{ background: "rgba(0,0,0,0.7)", color: "white" }}>
                        10:{50-i*2}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Close Button */}
          <div className="flex justify-end gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl btn-secondary">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
