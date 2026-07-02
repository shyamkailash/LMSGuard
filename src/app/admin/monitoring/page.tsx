"use client";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import AdminStudentDetailModal from "@/components/AdminStudentDetailModal";
import { onEvent } from "@/services/websocket";
import { ALL_STUDENTS, ALL_VIOLATIONS, ALL_CLASSES, ALL_INVIGILATORS, ALL_EXAMS, DEPARTMENTS } from "@/data/adminData";
import { CLASS_STUDENTS } from "@/data/invigilatorData";
import {
  Search, Users, CheckCircle, AlertTriangle, RefreshCw, Wifi, Shield, BookOpen,
  Filter, X, Download, MessageSquare, Ban, Play, Pause, Square, Clock, WifiOff,
  Activity, Eye, Zap, AlertCircle, ChevronDown
} from "lucide-react";

// ─── FILTER OPTIONS ──────────────────────────────────────────────────────────
const RISK_FILTERS = [
  { value:"all",       label:"All Risk Levels",   icon:Users,         color:"var(--primary)" },
  { value:"safe",      label:"Safe (0-34)",       icon:CheckCircle,   color:"var(--success)" },
  { value:"warning",   label:"Warning (35-69)",   icon:AlertTriangle, color:"var(--warning)" },
  { value:"critical",  label:"Critical (70+)",    icon:AlertTriangle, color:"var(--danger)"  },
];

const STATUS_FILTERS = [
  { value:"all",          label:"All Status",    color:"var(--primary)" },
  { value:"safe",         label:"Safe",          color:"var(--success)" },
  { value:"warning",      label:"Warning",       color:"var(--warning)" },
  { value:"violation",    label:"Violation",     color:"var(--danger)"  },
  { value:"disconnected", label:"Offline",       color:"var(--danger)"  },
];

export default function AdminMonitoringPage() {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [allStudents,   setAllStudents]   = useState([]);
  const [search,        setSearch]        = useState("");
  const [deptFilter,    setDeptFilter]    = useState("all");
  const [classFilter,   setClassFilter]   = useState("all");
  const [examFilter,    setExamFilter]    = useState("all");
  const [invigilator,   setInvigilator]   = useState("all");
  const [riskFilter,    setRiskFilter]    = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [selected,      setSelected]      = useState(null);
  const [spinning,      setSpinning]      = useState(false);
  const [toast,         setToast]         = useState(null);
  const [showFilters,   setShowFilters]   = useState(false);
  const [alerts,        setAlerts]        = useState([]);

  // ─── Initialize All Students ───────────────────────────────────────────────
  useEffect(() => {
    const students = [];
    Object.keys(CLASS_STUDENTS).forEach(classId => {
      const classData = ALL_CLASSES.find(c => c.id === classId);
      const classStudents = CLASS_STUDENTS[classId] || [];
      classStudents.forEach(s => {
        students.push({
          ...s,
          class: classData?.name || classId,
          classId,
          dept: classData?.dept || "Unknown",
          deptCode: classData?.deptCode || "",
          exam: "DBMS Final Exam", // Default exam
          examId: "EX001",
          invigilator: "John Martin", // Default invigilator
          networkStatus: s.networkStatus || "stable",
          currentWindow: s.currentWindow || "Chrome · Exam Portal",
        });
      });
    });
    setAllStudents(students);
  }, []);

  // ─── Real-time Updates ─────────────────────────────────────────────────────
  useEffect(() => {
    const offUpdate = onEvent("screen_update", ({ studentId, risk, networkStatus }) => {
      setAllStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, risk: Math.min(100, risk), networkStatus: networkStatus || s.networkStatus } : s
      ));
    });

    const offNet = onEvent("network_update", ({ studentId, networkStatus }) => {
      setAllStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, networkStatus } : s
      ));
    });

    const offViol = onEvent("violation_detected", data => {
      setAllStudents(prev => prev.map(s =>
        s.id === data.studentId
          ? {
              ...s,
              risk: Math.min(100, data.risk || s.risk),
              status: data.severity === "critical" ? "violation" : "warning",
              violations: [
                { time: data.time, type: data.type, detail: data.detail, severity: data.severity },
                ...(s.violations || []),
              ],
            }
          : s
      ));
      
      // Add to alerts
      const student = allStudents.find(st => st.id === data.studentId);
      if (student) {
        setAlerts(prev => [{
          id: Date.now(),
          studentName: student.name,
          class: student.class,
          type: data.type,
          severity: data.severity,
          time: data.time,
        }, ...prev.slice(0, 49)]);
      }
    });

    return () => { offUpdate(); offNet(); offViol(); };
  }, [allStudents]);

  // ─── Refresh Handler ───────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);
  }, []);

  // ─── Show Toast ────────────────────────────────────────────────────────────
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Admin Actions ─────────────────────────────────────────────────────────
  const pauseExam = (studentId) => {
    showToast("Exam paused for student");
  };

  const terminateExam = (studentId) => {
    showToast("Exam terminated by Admin");
  };

  const blockStudent = (studentId) => {
    showToast("Student blocked from system");
  };

  const sendWarning = (studentId) => {
    showToast("Warning message sent to student");
  };

  const forceLogout = (studentId) => {
    showToast("Student logged out by Admin");
  };

  const grantExtraTime = (studentId) => {
    showToast("Extra 15 minutes granted");
  };

  const downloadLogs = (studentId) => {
    showToast("Activity logs downloaded");
  };

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filtered = allStudents.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.regno.toLowerCase().includes(q);
    const matchDept = deptFilter === "all" || s.dept === deptFilter;
    const matchClass = classFilter === "all" || s.classId === classFilter;
    const matchExam = examFilter === "all" || s.examId === examFilter;
    const matchInvigilator = invigilator === "all" || s.invigilator === invigilator;
    
    let matchRisk = true;
    if (riskFilter === "safe") matchRisk = s.risk < 35;
    else if (riskFilter === "warning") matchRisk = s.risk >= 35 && s.risk < 70;
    else if (riskFilter === "critical") matchRisk = s.risk >= 70;

    const matchStatus = statusFilter === "all" 
      || (statusFilter === "disconnected" ? s.networkStatus === "disconnected" : s.status === statusFilter);

    const matchNetwork = networkFilter === "all" || s.networkStatus === networkFilter;

    return matchSearch && matchDept && matchClass && matchExam && matchInvigilator && matchRisk && matchStatus && matchNetwork;
  });

  // ─── Counts ────────────────────────────────────────────────────────────────
  const totalStudents = allStudents.length;
  const studentsOnline = allStudents.filter(s => s.networkStatus !== "disconnected").length;
  const violations = allStudents.filter(s => s.status === "violation").length;
  const criticalAlerts = allStudents.filter(s => s.risk >= 70).length;
  const networkIssues = allStudents.filter(s => s.networkStatus === "disconnected").length;
  const activeExams = [...new Set(allStudents.map(s => s.examId))].length;
  const activeDepts = [...new Set(allStudents.map(s => s.dept))].length;
  const activeClasses = [...new Set(allStudents.map(s => s.classId))].length;

  return (
    <AdminLayout title="Live Monitoring" subtitle="Complete System Monitoring · All Departments, Classes & Exams">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl"
            style={{ background:"var(--success)", color:"white" }}>
            <CheckCircle size={14}/><span className="text-sm font-semibold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DASHBOARD STATS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        {[
          { label:"Total Students",    value:totalStudents,  icon:Users,          color:"var(--primary)",   border:"rgba(37,99,235,0.2)" },
          { label:"Active Exams",      value:activeExams,    icon:BookOpen,       color:"var(--success)",   border:"rgba(22,163,74,0.2)" },
          { label:"Departments",       value:activeDepts,    icon:Shield,         color:"var(--primary)",   border:"rgba(37,99,235,0.2)" },
          { label:"Classes",           value:activeClasses,  icon:Users,          color:"var(--primary)",   border:"rgba(37,99,235,0.2)" },
          { label:"Students Online",   value:studentsOnline, icon:Wifi,           color:"var(--success)",   border:"rgba(22,163,74,0.2)" },
          { label:"Violations",        value:violations,     icon:AlertTriangle,  color:"var(--danger)",    border:"rgba(220,38,38,0.2)" },
          { label:"Critical Alerts",   value:criticalAlerts, icon:AlertCircle,    color:"var(--danger)",    border:"rgba(220,38,38,0.2)" },
          { label:"Network Issues",    value:networkIssues,  icon:WifiOff,        color:"var(--warning)",   border:"rgba(217,119,6,0.2)" },
        ].map(({ label, value, icon:Icon, color, border }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
            className="rounded-2xl p-3"
            style={{ background:"var(--card)", border:`1px solid ${border}`, boxShadow:"var(--shadow)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon size={13} style={{ color }}/>
              <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color:"var(--text-muted)" }}>{label}</p>
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── CONTROLS & FILTERS ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or register number…"
              className="input-field pl-9"/>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold btn-secondary"
              style={{ borderColor: showFilters ? "var(--primary)" : "var(--border)" }}>
              <Filter size={12}/> Filters
              {(deptFilter !== "all" || classFilter !== "all" || examFilter !== "all" || invigilator !== "all" || riskFilter !== "all" || statusFilter !== "all" || networkFilter !== "all") && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] ml-0.5"/>
              )}
            </motion.button>

            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={handleRefresh}
              className="w-9 h-9 rounded-xl flex items-center justify-center btn-secondary">
              <motion.div animate={{ rotate:spinning ? 360 : 0 }} transition={{ duration:0.7 }}>
                <RefreshCw size={13}/>
              </motion.div>
            </motion.button>

            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={() => downloadLogs("all")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold btn-primary">
              <Download size={12}/> Export Logs
            </motion.button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
              className="rounded-2xl p-4 space-y-4 overflow-hidden"
              style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
              
              {/* Department Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color:"var(--text-muted)" }}>
                  Department
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setDeptFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${deptFilter === "all" ? "btn-primary" : "btn-secondary"}`}>
                    All Departments
                  </button>
                  {DEPARTMENTS.map(d => (
                    <button key={d.id} onClick={() => setDeptFilter(d.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${deptFilter === d.name ? "btn-primary" : "btn-secondary"}`}>
                      {d.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color:"var(--text-muted)" }}>
                  Class
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setClassFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${classFilter === "all" ? "btn-primary" : "btn-secondary"}`}>
                    All Classes
                  </button>
                  {ALL_CLASSES.map(c => (
                    <button key={c.id} onClick={() => setClassFilter(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${classFilter === c.id ? "btn-primary" : "btn-secondary"}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color:"var(--text-muted)" }}>
                  Exam
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setExamFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${examFilter === "all" ? "btn-primary" : "btn-secondary"}`}>
                    All Exams
                  </button>
                  {ALL_EXAMS.map(e => (
                    <button key={e.id} onClick={() => setExamFilter(e.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${examFilter === e.id ? "btn-primary" : "btn-secondary"}`}>
                      {e.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Level Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color:"var(--text-muted)" }}>
                  Risk Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {RISK_FILTERS.map(({ value, label, color }) => (
                    <button key={value} onClick={() => setRiskFilter(value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all`}
                      style={{
                        background: riskFilter === value ? `${color}20` : "var(--bg-deep)",
                        color: riskFilter === value ? color : "var(--text-secondary)",
                        border: `1px solid ${riskFilter === value ? `${color}40` : "var(--border)"}`,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color:"var(--text-muted)" }}>
                  Student Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map(({ value, label, color }) => (
                    <button key={value} onClick={() => setStatusFilter(value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all`}
                      style={{
                        background: statusFilter === value ? `${color}20` : "var(--bg-deep)",
                        color: statusFilter === value ? color : "var(--text-secondary)",
                        border: `1px solid ${statusFilter === value ? `${color}40` : "var(--border)"}`,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color:"var(--text-muted)" }}>
                  Network Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "stable", "weak", "disconnected"].map(n => (
                    <button key={n} onClick={() => setNetworkFilter(n)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${networkFilter === n ? "btn-primary" : "btn-secondary"}`}>
                      {n.charAt(0).toUpperCase() + n.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <div className="flex justify-end pt-2">
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  onClick={() => {
                    setDeptFilter("all");
                    setClassFilter("all");
                    setExamFilter("all");
                    setInvigilator("all");
                    setRiskFilter("all");
                    setStatusFilter("all");
                    setNetworkFilter("all");
                    setSearch("");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background:"var(--danger)", color:"white" }}>
                  <X size={12}/> Reset All Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── RESULTS SUMMARY ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color:"var(--text-muted)" }}>
          Showing <span className="font-semibold" style={{ color:"var(--text-primary)" }}>{filtered.length}</span> of {totalStudents} students
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)", color:"var(--success)" }}>
            <Wifi size={10}/>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block mx-0.5 live-blink"/>
            All streams live
          </div>
        </div>
      </div>

      {/* ─── STUDENT GRID ──────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.map((student, i) => (
            <StudentCardAdmin key={student.id} student={student} index={i} 
              onViewStudent={setSelected}
              onPause={pauseExam}
              onTerminate={terminateExam}
              onBlock={blockStudent}
              onWarning={sendWarning}
              onLogout={forceLogout}
              onExtraTime={grantExtraTime}
              onDownload={downloadLogs}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={36} className="mb-3" style={{ color:"var(--border)" }}/>
          <p className="font-medium" style={{ color:"var(--text-secondary)" }}>No students found</p>
          <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
            {search ? "Try adjusting your search" : "No students match current filters"}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <AdminStudentDetailModal 
            student={selected} 
            onClose={() => setSelected(null)}
            onAction={(actionId, studentId) => {
              switch(actionId) {
                case "pause": pauseExam(studentId); break;
                case "terminate": terminateExam(studentId); break;
                case "block": blockStudent(studentId); break;
                case "warning": sendWarning(studentId); break;
                case "logout": forceLogout(studentId); break;
                case "extratime": grantExtraTime(studentId); break;
                case "download": downloadLogs(studentId); break;
                case "remark": showToast("Remark feature coming soon"); break;
              }
            }}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

// ─── STUDENT CARD ADMIN COMPONENT ────────────────────────────────────────────
function StudentCardAdmin({ student, index, onViewStudent, onPause, onTerminate, onBlock, onWarning, onLogout, onExtraTime, onDownload }) {
  const risk = student.risk ?? 0;
  const riskColor = risk >= 70 ? "var(--danger)" : risk >= 35 ? "var(--warning)" : "var(--success)";
  const statusColor = student.status === "safe" ? "var(--success)" : student.status === "violation" ? "var(--danger)" : "var(--warning)";
  const networkColor = student.networkStatus === "stable" ? "var(--success)" : student.networkStatus === "weak" ? "var(--warning)" : "var(--danger)";

  return (
    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.02 }}
      className="rounded-2xl overflow-hidden hover-card"
      style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
      
      {/* Live Screen Preview */}
      <div className="relative aspect-video overflow-hidden" style={{ background:"var(--bg-deep)", borderBottom:"1px solid var(--border)" }}>
        <div className="absolute inset-0 p-3 space-y-2 opacity-20">
          {[80,60,90,45,70].map((w,i) => (
            <div key={i} className="h-1.5 rounded" style={{ width:`${w}%`, background:"var(--border)" }}/>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity size={28} style={{ color:"var(--border)" }}/>
        </div>
        
        {/* LIVE indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background:"var(--danger)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-white live-blink"/>
          <span className="text-white text-[9px] font-bold">LIVE</span>
        </div>

        {/* Network Status */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background:student.networkStatus === "disconnected" ? "var(--danger)" : "rgba(0,0,0,0.7)" }}>
          <Wifi size={9} style={{ color:"white" }}/>
          <span className="text-white text-[9px] font-medium">{student.networkStatus}</span>
        </div>

        {/* Student Avatar */}
        <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800] flex items-center justify-center text-white text-[10px] font-bold"
          style={{ border:"2px solid var(--card)" }}>
          {student.avatar}
        </div>

        {/* Current Window */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-[9px]"
          style={{ background:"rgba(0,0,0,0.7)", border:"1px solid var(--border)", color:"white" }}>
          {student.currentWindow}
        </div>
      </div>

      {/* Student Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate" style={{ color:"var(--text-primary)" }}>{student.name}</h3>
            <p className="text-[10px] truncate" style={{ color:"var(--text-muted)" }}>{student.regno}</p>
          </div>
          <span className={`badge ${student.status === "safe" ? "badge-success" : student.status === "violation" ? "badge-danger" : "badge-warning"} text-[9px] ml-2 shrink-0`}>
            {student.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5 mb-3 text-[10px]">
          <div className="flex justify-between">
            <span style={{ color:"var(--text-muted)" }}>Department</span>
            <span className="font-medium" style={{ color:"var(--text-secondary)" }}>{student.deptCode}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color:"var(--text-muted)" }}>Class</span>
            <span className="font-medium truncate ml-2" style={{ color:"var(--text-secondary)" }}>{student.class}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color:"var(--text-muted)" }}>Exam</span>
            <span className="font-medium truncate ml-2" style={{ color:"var(--text-secondary)" }}>{student.exam}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color:"var(--text-muted)" }}>Invigilator</span>
            <span className="font-medium truncate ml-2" style={{ color:"var(--text-secondary)" }}>{student.invigilator}</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="rounded-xl p-2.5 mb-3" style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1">
              <Zap size={10} style={{ color:riskColor }}/>
              <span className="text-[10px] font-medium" style={{ color:"var(--text-muted)" }}>Risk Score</span>
            </div>
            <span className="text-sm font-bold" style={{ color:riskColor }}>{risk}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"var(--border)" }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${risk}%` }} transition={{ duration:0.5 }}
              className={risk >= 70 ? "risk-bar-danger" : risk >= 35 ? "risk-bar-warning" : "risk-bar-safe"}
              style={{ height:"100%" }}/>
          </div>
        </div>

        {/* Violations Count */}
        {student.violations && student.violations.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-lg" style={{ background:"var(--danger-muted)" }}>
            <AlertTriangle size={10} style={{ color:"var(--danger)" }}/>
            <span className="text-[10px] font-semibold" style={{ color:"var(--danger)" }}>
              {student.violations.length} violation{student.violations.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1.5">
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            onClick={() => onViewStudent(student)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold btn-primary">
            <Eye size={10}/> View Details
          </motion.button>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            onClick={() => onWarning(student.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background:"var(--warning)", color:"white" }}>
            <MessageSquare size={11}/>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
