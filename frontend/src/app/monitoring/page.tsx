"use client";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StudentCard from "@/components/StudentCard";
import StudentDetailModal from "@/components/StudentDetailModal";
import { onEvent } from "@/services/websocket";
import { CLASS_STUDENTS } from "@/data/invigilatorData";
import {
  Search, Users, CheckCircle, AlertTriangle,
  RefreshCw, Wifi, Shield, BookOpen, ChevronRight, AlertCircle, WifiOff
} from "lucide-react";

const FILTERS = [
  { value:"all",          label:"All",          icon:Users,         color:"var(--primary)" },
  { value:"safe",         label:"Safe",         icon:CheckCircle,   color:"var(--success)" },
  { value:"warning",      label:"Warning",      icon:AlertTriangle, color:"var(--warning)" },
  { value:"violation",    label:"Violation",    icon:AlertTriangle, color:"var(--danger)"  },
  { value:"disconnected", label:"Offline",      icon:WifiOff,       color:"var(--danger)"  },
];

export default function MonitoringPage() {
  const router = useRouter();
  const [sessionClass, setSessionClass] = useState(null);
  const [sessionExam,  setSessionExam]  = useState(null);
  const [students,  setStudents]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [selected,  setSelected]  = useState(null);
  const [spinning,  setSpinning]  = useState(false);
  const [ready,     setReady]     = useState(false);

  useEffect(() => {
    const clsRaw  = sessionStorage.getItem("invSelectedClass");
    const examRaw = sessionStorage.getItem("invSelectedExam");
    let cls  = null;
    let exam = null;
    try { if (clsRaw)  cls  = JSON.parse(clsRaw);  } catch {}
    try { if (examRaw) exam = JSON.parse(examRaw);  } catch {}
    setSessionClass(cls?.id  ? cls  : null);
    setSessionExam (exam?.id ? exam : null);

    if (cls?.id) {
      // Stamp exam title on each student card
      const base = CLASS_STUDENTS[cls.id] || [];
      setStudents(base.map(s => ({ ...s, exam: exam?.title || s.exam || "—" })));
      setReady(true);
    } else {
      setReady(false);
    }
  }, []);

  // Real-time updates
  useEffect(() => {
    const assignedClass = sessionClass?.id;
    if (!assignedClass) return;

    const offUpdate = onEvent("screen_update", ({ studentId, risk, assignedClass:ac }) => {
      if (ac && ac !== assignedClass) return;
      setStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, risk:Math.min(100, risk) } : s
      ));
    });
    const offNet = onEvent("network_update", ({ studentId, networkStatus, assignedClass:ac }) => {
      if (ac && ac !== assignedClass) return;
      setStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, networkStatus } : s
      ));
    });
    const offViol = onEvent("violation_detected", data => {
      if (data.assignedClass && data.assignedClass !== assignedClass) return;
      setStudents(prev => prev.map(s =>
        s.id === data.studentId
          ? { ...s,
              risk:       Math.min(100, data.risk || s.risk),
              status:     data.severity === "critical" ? "violation" : "warning",
              violations: [
                { time:data.time, type:data.type, detail:data.detail, severity:data.severity },
                ...(s.violations||[]),
              ],
            }
          : s
      ));
    });
    return () => { offUpdate(); offNet(); offViol(); };
  }, [sessionClass]);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);
  }, []);

  const counts = {
    all:          students.length,
    safe:         students.filter(s => s.status==="safe").length,
    warning:      students.filter(s => s.status==="warning").length,
    violation:    students.filter(s => s.status==="violation").length,
    disconnected: students.filter(s => s.networkStatus==="disconnected").length,
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.regno.toLowerCase().includes(q);
    const matchFilter = filter === "all"
      || (filter === "disconnected" ? s.networkStatus === "disconnected" : s.status === filter);
    return matchSearch && matchFilter;
  });

  // ── No session guard ──
  if (!ready) {
    return (
      <DashboardLayout title="Live Monitoring" subtitle="No active session">
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background:"var(--warning-muted)", border:"1px solid rgba(217,119,6,0.2)" }}>
            <AlertCircle size={28} style={{ color:"var(--warning)" }}/>
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color:"var(--text-primary)" }}>
            No Active Session
          </h2>
          <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>
            You need to select a class and exam before monitoring. Go back to Dashboard to set up your session.
          </p>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            onClick={() => router.push("/dashboard")}
            className="btn-primary px-6 py-2.5 text-sm">
            ← Back to Dashboard
          </motion.button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Live Monitoring"
      subtitle={`${sessionClass?.label} · ${sessionExam?.title}`}
    >
      {/* ── Session context banner ── */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3 }}
        className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl mb-5"
        style={{ background:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.04))",
                 border:"1px solid rgba(37,99,235,0.2)" }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)" }}>
              <Shield size={15} style={{ color:"var(--primary)" }}/>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color:"var(--text-primary)" }}>
                {sessionClass?.label}
              </p>
              <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                Selected class · {sessionClass?.strength} students enrolled
              </p>
            </div>
          </div>
          <div className="h-7 w-px hidden sm:block" style={{ background:"var(--border)" }}/>
          <div className="flex items-center gap-1.5">
            <BookOpen size={12} style={{ color:"var(--primary)" }}/>
            <span className="text-sm font-medium" style={{ color:"var(--text-secondary)" }}>
              {sessionExam?.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)",
                     color:"var(--success)" }}>
            <Wifi size={10}/>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block mx-0.5 live-blink"/>
            All streams live
          </div>
          <span className="text-xs font-medium" style={{ color:"var(--text-muted)" }}>
            {students.length} students
          </span>
          {counts.disconnected > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
              style={{ background:"var(--danger-muted)", border:"1px solid rgba(220,38,38,0.25)",
                       color:"var(--danger)" }}>
              <WifiOff size={10}/>
              {counts.disconnected} offline
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color:"var(--text-muted)" }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or register no…"
            className="input-field pl-9"/>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(({ value, label, icon:Icon, color }) => {
            const active = filter === value;
            return (
              <motion.button key={value} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => setFilter(value)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  background:  active ? `${color}20` : "var(--card)",
                  color:       active ? color : "var(--text-secondary)",
                  borderColor: active ? `${color}40` : "var(--border)",
                }}>
                <Icon size={11}/> {label}
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background:active ? `${color}30` : "var(--bg-deep)",
                           color:active ? color : "var(--text-muted)" }}>
                  {counts[value]}
                </span>
              </motion.button>
            );
          })}
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={handleRefresh}
            className="w-9 h-9 rounded-xl flex items-center justify-center btn-secondary">
            <motion.div animate={{ rotate:spinning ? 360 : 0 }} transition={{ duration:0.7 }}>
              <RefreshCw size={13}/>
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ── Summary row ── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color:"var(--text-muted)" }}>
          Showing{" "}
          <span className="font-semibold" style={{ color:"var(--text-primary)" }}>
            {filtered.length}
          </span>{" "}
          of {students.length} students
        </p>
        <a href="/violations" className="flex items-center gap-1 text-xs font-medium"
           style={{ color:"var(--primary)" }}>
          View violations <ChevronRight size={11}/>
        </a>
      </div>

      {/* ── Student grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((s, i) => (
            <StudentCard key={s.id} student={s} index={i} onViewStudent={setSelected}/>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={36} className="mb-3" style={{ color:"var(--border)" }}/>
          <p className="font-medium" style={{ color:"var(--text-secondary)" }}>No students found</p>
          <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
            {search ? "Try adjusting your search" : "No students match this filter"}
          </p>
          <button onClick={() => { setSearch(""); setFilter("all"); }}
            className="mt-4 px-4 py-2 rounded-xl text-sm btn-secondary">
            Reset filters
          </button>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <StudentDetailModal student={selected} onClose={() => setSelected(null)}/>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
