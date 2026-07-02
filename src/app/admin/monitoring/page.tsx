"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ACTIVE_SESSIONS, ALL_VIOLATIONS } from "@/data/adminData";
import { Monitor, Square, Play, AlertTriangle, Users, Shield, CheckCircle, Eye } from "lucide-react";

const SEV_CFG = {
  critical: { cls:"badge-danger",  label:"Critical", dot:"var(--danger)"  },
  medium:   { cls:"badge-warning", label:"Medium",   dot:"var(--warning)" },
  warning:  { cls:"badge-warning", label:"Warning",  dot:"var(--warning)" },
};

export default function AdminMonitoringPage() {
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);
  const [toast,    setToast]    = useState(null);

  function stopSession(id) {
    setSessions(prev => prev.map(s => s.id===id ? { ...s, status:"stopped" } : s));
    setToast("Session stopped by Admin");
    setTimeout(() => setToast(null), 3000);
  }

  function resumeSession(id) {
    setSessions(prev => prev.map(s => s.id===id ? { ...s, status:"active" } : s));
    setToast("Session resumed by Admin");
    setTimeout(() => setToast(null), 3000);
  }

  const active  = sessions.filter(s=>s.status==="active").length;
  const paused  = sessions.filter(s=>s.status==="paused").length;
  const stopped = sessions.filter(s=>s.status==="stopped").length;
  const totalStudents = sessions.filter(s=>s.status==="active").reduce((a,s)=>a+s.students,0);

  return (
    <AdminLayout title="Monitoring Control" subtitle="System-wide exam monitoring — all sessions">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl"
            style={{ background:"var(--success)", color:"white" }}>
            <CheckCircle size={14}/>
            <span className="text-sm font-semibold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Active Sessions",         value:active,        color:"var(--success)", border:"rgba(22,163,74,0.2)"  },
          { label:"Paused",                  value:paused,        color:"var(--warning)", border:"rgba(217,119,6,0.2)"  },
          { label:"Stopped by Admin",        value:stopped,       color:"var(--danger)",  border:"rgba(220,38,38,0.2)"  },
          { label:"Students Monitored",      value:totalStudents, color:"var(--primary)", border:"rgba(37,99,235,0.2)"  },
        ].map(({ label, value, color, border }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.07 }}
            className="rounded-2xl p-4"
            style={{ background:"var(--card)", border:`1px solid ${border}`, boxShadow:"var(--shadow)" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Session Cards */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:"var(--text-muted)" }}>
          All Monitoring Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              className="rounded-2xl p-4"
              style={{
                background:"var(--card)",
                border:`1px solid ${s.status==="active"?"rgba(22,163,74,0.2)":s.status==="stopped"?"rgba(220,38,38,0.15)":"rgba(217,119,6,0.2)"}`,
                boxShadow:"var(--shadow)",
                opacity: s.status==="stopped" ? 0.7 : 1,
              }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: s.status==="active"?"var(--success-muted)":s.status==="stopped"?"var(--danger-muted)":"var(--warning-muted)",
                             border:`1px solid ${s.status==="active"?"rgba(22,163,74,0.2)":s.status==="stopped"?"rgba(220,38,38,0.2)":"rgba(217,119,6,0.2)"}` }}>
                    <Monitor size={16} style={{ color: s.status==="active"?"var(--success)":s.status==="stopped"?"var(--danger)":"var(--warning)" }}/>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>{s.invigilator}</p>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>Started {s.startTime}</p>
                  </div>
                </div>
                <span className={`badge ${s.status==="active"?"badge-success":s.status==="stopped"?"badge-danger":"badge-warning"} text-[10px]`}>
                  {s.status}
                </span>
              </div>

              {/* Info */}
              <div className="rounded-xl p-3 mb-3"
                style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                <div className="space-y-1">
                  {[
                    { label:"Class",      value:s.class,    color:"var(--primary)"         },
                    { label:"Exam",       value:s.exam,     color:"var(--text-primary)"     },
                    { label:"Students",   value:s.students, color:"var(--text-secondary)"   },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span style={{ color:"var(--text-muted)" }}>{label}</span>
                      <span className="font-semibold" style={{ color }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Violations badge */}
              {s.violations > 0 && (
                <div className="flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={12} style={{ color:"var(--danger)" }}/>
                  <span className="text-xs font-semibold" style={{ color:"var(--danger)" }}>
                    {s.violations} violations detected
                  </span>
                </div>
              )}

              {/* Admin actions */}
              <div className="flex gap-2">
                {s.status === "active" && (
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={() => stopSession(s.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background:"var(--danger)" }}>
                    <Square size={11}/> Stop Session
                  </motion.button>
                )}
                {s.status === "paused" && (
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={() => resumeSession(s.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background:"var(--success)" }}>
                    <Play size={11}/> Resume
                  </motion.button>
                )}
                {s.status === "stopped" && (
                  <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                    style={{ background:"var(--bg-deep)", color:"var(--text-muted)", border:"1px solid var(--border)" }}>
                    <Shield size={11}/> Stopped by Admin
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Violations — System Wide */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
        className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
            Recent Violations — All Classes
          </h3>
          <a href="/admin/violations" className="text-xs font-medium" style={{ color:"var(--primary)" }}>
            View all
          </a>
        </div>
        <div className="grid grid-cols-[2fr_1.2fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Student","Class","Type","Exam","Time","Severity"].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>
        {ALL_VIOLATIONS.slice(0,8).map((v, i) => {
          const sc = SEV_CFG[v.severity] || SEV_CFG.medium;
          return (
            <div key={v.id}
              className="grid grid-cols-[2fr_1.2fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3 table-row"
              style={{ borderBottom:"1px solid var(--border-soft)" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                  {v.studentName.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <span className="text-xs font-medium truncate" style={{ color:"var(--text-primary)" }}>{v.studentName}</span>
              </div>
              <span className="text-xs flex items-center" style={{ color:"var(--text-secondary)" }}>{v.class}</span>
              <span className="text-xs flex items-center" style={{ color:"var(--text-secondary)" }}>{v.type}</span>
              <span className="text-xs flex items-center truncate" style={{ color:"var(--text-muted)" }}>{v.exam}</span>
              <span className="text-xs font-mono flex items-center" style={{ color:"var(--text-muted)" }}>{v.time}</span>
              <div className="flex items-center">
                <span className={`badge ${sc.cls} text-[9px]`}>{sc.label}</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </AdminLayout>
  );
}
