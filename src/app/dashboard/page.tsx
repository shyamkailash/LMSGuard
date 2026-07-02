"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { ViolationTrendChart, RiskPieChart } from "@/components/Charts";
import { onEvent } from "@/services/websocket";
import {
  Users, BookOpen, AlertTriangle, Shield, Calendar,
  ChevronRight, Play, Check, Cpu,
  Wifi, Clock, Activity, ArrowRight, WifiOff
} from "lucide-react";
import {
  AVAILABLE_CLASSES, CLASS_STUDENTS,
  CLASS_VIOLATIONS, getExamsForClass,
} from "@/data/invigilatorData";
import { INITIAL_NETWORK_ISSUES } from "@/data/networkData";

const SEV = { critical:"badge-danger", warning:"badge-warning", medium:"badge-warning" };

// ─── Step 1: Class Selector ────────────────────────────────────────────────────
function ClassSelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{ background:"linear-gradient(135deg,#2563EB,#7C3AED)" }}>
          <Users size={24} className="text-white"/>
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color:"var(--text-primary)" }}>
          Select Your Class
        </h2>
        <p className="text-sm" style={{ color:"var(--text-muted)" }}>
          Choose the classroom you are supervising today
        </p>
      </div>

      <div className="space-y-3">
        {AVAILABLE_CLASSES.map((cls, i) => (
          <motion.button key={cls.id}
            initial={{ opacity:0, x:-16 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay:i * 0.07 }}
            whileHover={{ x:4 }}
            whileTap={{ scale:0.99 }}
            onClick={() => onSelect(cls)}
            onMouseEnter={() => setHovered(cls.id)}
            onMouseLeave={() => setHovered(null)}
            className="w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all"
            style={{
              background: hovered===cls.id ? "var(--primary-muted)" : "var(--card)",
              border: `1px solid ${hovered===cls.id ? "rgba(37,99,235,0.35)" : "var(--border)"}`,
              boxShadow:"var(--shadow)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: hovered===cls.id ? "rgba(37,99,235,0.15)" : "var(--bg-deep)",
                  border:"1px solid var(--border)",
                }}>
                <Users size={17} style={{ color: hovered===cls.id ? "var(--primary)" : "var(--text-muted)" }}/>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>{cls.label}</p>
                <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                  {cls.dept} · {cls.strength} students
                </p>
              </div>
            </div>
            <ArrowRight size={15}
              style={{ color: hovered===cls.id ? "var(--primary)" : "var(--border)" }}
              className="transition-all"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Step 2: Exam Selector ────────────────────────────────────────────────────
function ExamSelector({ selectedClass, onSelect, onBack }) {
  const exams = getExamsForClass(selectedClass.id);
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4 }} className="w-full max-w-lg mx-auto"
    >
      {/* Back + class chip */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl btn-secondary">
          ← Back
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)" }}>
          <Users size={11} style={{ color:"var(--primary)" }}/>
          <span className="text-xs font-semibold" style={{ color:"var(--primary)" }}>
            {selectedClass.label}
          </span>
          <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>
            · {selectedClass.strength} students
          </span>
        </div>
      </div>

      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{ background:"linear-gradient(135deg,#1B4D1E,#F5C800)" }}>
          <BookOpen size={22} className="text-white"/>
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color:"var(--text-primary)" }}>
          Select Exam
        </h2>
        <p className="text-sm" style={{ color:"var(--text-muted)" }}>
          Choose the exam being conducted for {selectedClass.label}
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-10 rounded-2xl"
          style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
          <BookOpen size={28} className="mx-auto mb-3" style={{ color:"var(--border)" }}/>
          <p className="font-medium" style={{ color:"var(--text-secondary)" }}>
            No exams scheduled for this class today
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam, i) => (
            <motion.button key={exam.id}
              initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:i * 0.08 }}
              whileHover={{ x:4 }} whileTap={{ scale:0.99 }}
              onClick={() => onSelect(exam)}
              onMouseEnter={() => setHovered(exam.id)}
              onMouseLeave={() => setHovered(null)}
              className="w-full p-4 rounded-2xl text-left transition-all"
              style={{
                background: hovered===exam.id ? "var(--primary-muted)" : "var(--card)",
                border:`1px solid ${hovered===exam.id ? "rgba(37,99,235,0.35)" : "var(--border)"}`,
                boxShadow:"var(--shadow)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>
                    {exam.title}
                  </p>
                  <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                    {exam.subject} · {exam.code}
                  </p>
                </div>
                <ArrowRight size={14}
                  style={{ color: hovered===exam.id ? "var(--primary)" : "var(--border)" }}/>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background:"var(--success-muted)", color:"var(--success)",
                           border:"1px solid rgba(22,163,74,0.2)" }}>
                  <Calendar size={9}/> {exam.date}
                </span>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)",
                           border:"1px solid var(--border)" }}>
                  <Clock size={9}/> {exam.startTime} – {exam.endTime}
                </span>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background:"var(--warning-muted)", color:"var(--warning)",
                           border:"1px solid rgba(217,119,6,0.2)" }}>
                  {exam.duration} min · {exam.totalQuestions} Qs
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Step 3: Confirmation + Start ─────────────────────────────────────────────
function MonitoringReady({ selectedClass, selectedExam, onBack, onStart }) {
  const students   = CLASS_STUDENTS[selectedClass.id]   || [];
  const violations = CLASS_VIOLATIONS[selectedClass.id] || [];

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4 }} className="w-full max-w-lg mx-auto"
    >
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl btn-secondary mb-6">
        ← Change Exam
      </button>

      {/* Summary card */}
      <div className="rounded-2xl overflow-hidden mb-5"
        style={{ background:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(124,58,237,0.06))",
                 border:"1px solid rgba(37,99,235,0.25)" }}>
        <div className="px-5 py-4" style={{ borderBottom:"1px solid rgba(37,99,235,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#2563EB,#7C3AED)" }}>
              <Shield size={18} className="text-white"/>
            </div>
            <div>
              <p className="font-bold" style={{ color:"var(--text-primary)" }}>
                Ready to Start Monitoring
              </p>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                Review your session details before starting
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {[
            { label:"Class",      value:selectedClass.label,  icon:Users,     color:"var(--primary)"         },
            { label:"Department", value:selectedClass.dept,   icon:Shield,    color:"var(--text-secondary)"  },
            { label:"Students",   value:students.length,      icon:Users,     color:"var(--primary)"         },
            { label:"Exam",       value:selectedExam.title,   icon:BookOpen,  color:"var(--primary)"         },
            { label:"Subject",    value:selectedExam.subject, icon:BookOpen,  color:"var(--text-secondary)"  },
            { label:"Duration",   value:`${selectedExam.duration} minutes`, icon:Clock, color:"var(--warning)" },
            { label:"Time",       value:`${selectedExam.startTime} – ${selectedExam.endTime}`, icon:Clock, color:"var(--text-secondary)" },
            { label:"Date",       value:selectedExam.date,    icon:Calendar,  color:"var(--success)"         },
          ].map(({ label, value, icon:Icon, color }) => (
            <div key={label} className="flex items-center justify-between py-1"
              style={{ borderBottom:"1px solid rgba(37,99,235,0.1)" }}>
              <div className="flex items-center gap-2">
                <Icon size={11} style={{ color:"var(--text-muted)" }}/>
                <span className="text-sm" style={{ color:"var(--text-muted)" }}>{label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label:"Students",   value:students.length,
            color:"var(--primary)", border:"rgba(37,99,235,0.2)"  },
          { label:"At Risk",    value:students.filter(s=>s.status!=="safe").length,
            color:"var(--warning)", border:"rgba(217,119,6,0.2)"  },
          { label:"Violations", value:violations.length,
            color:"var(--danger)",  border:"rgba(220,38,38,0.2)"  },
        ].map(({ label, value, color, border }) => (
          <div key={label} className="rounded-xl p-3 text-center"
            style={{ background:"var(--card)", border:`1px solid ${border}` }}>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
        onClick={onStart}
        className="w-full py-3.5 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2"
        style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
                 boxShadow:"0 6px 20px rgba(37,99,235,0.35)" }}>
        <Play size={16}/> Start Monitoring
      </motion.button>
    </motion.div>
  );
}

// ─── Step 4: Active Monitoring Dashboard ──────────────────────────────────────
function ActiveDashboard({ invProfile, selectedClass, selectedExam, onChangeSession }) {
  const router = useRouter();
  const [students,      setStudents]      = useState(CLASS_STUDENTS[selectedClass.id]   || []);
  const [violations,    setViolations]    = useState(CLASS_VIOLATIONS[selectedClass.id] || []);
  const [networkIssues, setNetworkIssues] = useState(
    (INITIAL_NETWORK_ISSUES[selectedClass.id] || []).filter(n => !n.resolved)
  );
  const [liveAlerts, setLiveAlerts] = useState(
    (CLASS_VIOLATIONS[selectedClass.id] || []).slice(0,5).map(v => ({
      id:v.id, student:v.studentName, type:v.detail||v.type,
      time:v.time, severity:v.severity,
      avatar:v.studentName.split(" ").map(n=>n[0]).join("").slice(0,2),
    }))
  );
  const [violCount, setViolCount] = useState(
    (CLASS_VIOLATIONS[selectedClass.id] || []).length
  );

  useEffect(() => {
    const off = onEvent("violation_detected", data => {
      if (data.assignedClass && data.assignedClass !== selectedClass.id) return;
      setViolCount(c => c + 1);
      setLiveAlerts(prev => [{
        id:Date.now(), student:data.studentName, type:data.detail,
        time:data.time, severity:data.severity,
        avatar:data.studentName?.split(" ").map(n=>n[0]).join("").slice(0,2),
      }, ...prev.slice(0,7)]);
    });
    const offNet = onEvent("network_issue", data => {
      if (data.assignedClass && data.assignedClass !== selectedClass.id) return;
      setNetworkIssues(prev => [data, ...prev.slice(0, 9)]);
    });
    return () => { off(); offNet(); };
  }, [selectedClass.id]);

  const safeCount = students.filter(s => s.status === "safe").length;

  return (
    <div>
      {/* Welcome + session banner */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.35 }}
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,rgba(37,99,235,0.12),rgba(124,58,237,0.08))",
                 border:"1px solid rgba(37,99,235,0.2)" }}>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-10 pointer-events-none"
             style={{ background:"var(--primary)" }}/>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1"
               style={{ color:"var(--primary)" }}>Welcome back 👋</p>
            <h2 className="text-xl font-bold mb-2" style={{ color:"var(--text-primary)" }}>
              {invProfile?.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium"
                style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)",
                         color:"var(--primary)" }}>
                <Users size={11}/> {selectedClass.label}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium"
                style={{ background:"var(--bg-deep)", border:"1px solid var(--border)",
                         color:"var(--text-secondary)" }}>
                <BookOpen size={11}/> {selectedExam.title}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium"
                style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)",
                         color:"var(--success)" }}>
                <Calendar size={11}/> {selectedExam.date}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => router.push("/monitoring")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
                       boxShadow:"0 4px 12px rgba(37,99,235,0.3)" }}>
              <Play size={13}/> Live Monitor
            </motion.button>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={onChangeSession}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium btn-secondary">
              Change Session
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatsCard title="Class Students" value={students.length} icon={Users}
          color="blue"   subtitle={selectedClass.label} index={0}/>
        <StatsCard title="Safe"           value={safeCount}       icon={Shield}
          color="green"  subtitle="No violations"       index={1}/>
        <StatsCard title="Violations"     value={violCount}       icon={AlertTriangle}
          color="red"    subtitle="This session"         index={2}/>
        <StatsCard title="Network Issues" value={networkIssues.filter(n=>!n.resolved).length} icon={WifiOff}
          color="yellow" subtitle="Pending action"      index={3}/>
      </div>

      {/* System status + exam details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color:"var(--text-muted)" }}>System Status</h3>
          <div className="space-y-2.5">
            {[
              { label:"AI Engine",      value:"Running",  icon:Cpu,      color:"var(--success)" },
              { label:"Network",        value:"Stable",   icon:Wifi,     color:"var(--success)" },
              { label:"Stream Quality", value:"HD 1080p", icon:Activity, color:"var(--primary)"  },
              { label:"Session Time",   value:"Active",   icon:Clock,    color:"var(--warning)" },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} className="flex items-center justify-between py-1.5"
                   style={{ borderBottom:"1px solid var(--border-soft)" }}>
                <div className="flex items-center gap-2">
                  <Icon size={12} style={{ color:"var(--text-muted)" }}/>
                  <span className="text-sm" style={{ color:"var(--text-secondary)" }}>{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:color }}/>
                  <span className="text-sm font-semibold" style={{ color }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.37 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color:"var(--text-muted)" }}>Exam Details</h3>
          <div className="space-y-2">
            {[
              { label:"Exam",      value:selectedExam.title                              },
              { label:"Subject",   value:selectedExam.subject                            },
              { label:"Code",      value:selectedExam.code                               },
              { label:"Time",      value:`${selectedExam.startTime} – ${selectedExam.endTime}` },
              { label:"Duration",  value:`${selectedExam.duration} minutes`              },
              { label:"Questions", value:selectedExam.totalQuestions                     },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1"
                   style={{ borderBottom:"1px solid var(--border-soft)" }}>
                <span className="text-sm" style={{ color:"var(--text-muted)" }}>{label}</span>
                <span className="text-sm font-semibold truncate max-w-[55%] text-right"
                      style={{ color:"var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.44 }}
          className="lg:col-span-2 rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
                Violation Trend
              </h3>
              <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                {selectedClass.label}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background:"var(--danger)" }}/>
                <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>Violations</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background:"var(--success)" }}/>
                <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>Safe</span>
              </div>
            </div>
          </div>
          <ViolationTrendChart />
        </motion.div>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color:"var(--text-primary)" }}>
            Risk Distribution
          </h3>
          <p className="text-[11px] mb-3" style={{ color:"var(--text-muted)" }}>
            {students.length} students
          </p>
          <RiskPieChart />
        </motion.div>
      </div>

      {/* Recent alerts */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.56 }}
        className="rounded-2xl p-4 mb-5"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
              Recent Alerts
            </h3>
            <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
              From {selectedClass.label}
            </p>
          </div>
          <a href="/violations" className="flex items-center gap-1 text-xs font-medium"
             style={{ color:"var(--primary)" }}>
            View all <ChevronRight size={12}/>
          </a>
        </div>
        {liveAlerts.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Shield size={28} className="mb-2 opacity-30" style={{ color:"var(--text-muted)" }}/>
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>No alerts — all clear 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {liveAlerts.slice(0,5).map((a, i) => (
              <motion.div key={a.id}
                initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:i*0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl table-row"
                style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>
                      {a.student}
                    </p>
                    <span className={`badge ${SEV[a.severity] || "badge-warning"}`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color:"var(--text-muted)" }}>{a.type}</p>
                </div>
                <span className="text-[11px] font-mono shrink-0" style={{ color:"var(--text-muted)" }}>
                  {a.time}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Network Issues Section ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.62 }}
        className="rounded-2xl p-4"
        style={{ background:"var(--card)", border:"1px solid rgba(217,119,6,0.2)", boxShadow:"var(--shadow)" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"var(--warning-muted)", border:"1px solid rgba(217,119,6,0.2)" }}>
              <WifiOff size={15} style={{ color:"var(--warning)" }}/>
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
                Network Issues
              </h3>
              <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                {selectedClass.label} · Invigilator action required
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background:"var(--warning-muted)", color:"var(--warning)",
                       border:"1px solid rgba(217,119,6,0.2)" }}>
              {networkIssues.filter(n => !n.resolved).length} pending
            </span>
            <a href="/monitoring"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color:"var(--primary)" }}>
              Monitor <ChevronRight size={11}/>
            </a>
          </div>
        </div>

        {networkIssues.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Wifi size={28} className="mb-2 opacity-30" style={{ color:"var(--success)" }}/>
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>
              No network issues — all connections stable 🟢
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {networkIssues.slice(0, 5).map((ni, i) => {
              const isDisconnected = ni.networkStatus === "disconnected";
              return (
                <motion.div key={ni.id}
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "var(--bg-deep)",
                    border: `1px solid ${ni.resolved
                      ? "var(--border)"
                      : isDisconnected
                        ? "rgba(220,38,38,0.2)"
                        : "rgba(217,119,6,0.2)"}`,
                    opacity: ni.resolved ? 0.6 : 1,
                  }}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                  flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {ni.studentName?.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
                        {ni.studentName}
                      </p>
                      <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                        {ni.regno}
                      </span>
                      {ni.resolved ? (
                        <span className="badge badge-success text-[9px]">✓ Resolved</span>
                      ) : (
                        <span className="badge text-[9px]"
                          style={{
                            background: isDisconnected ? "var(--danger-muted)" : "var(--warning-muted)",
                            color:      isDisconnected ? "var(--danger)"       : "var(--warning)",
                            borderColor:isDisconnected ? "rgba(220,38,38,0.25)": "rgba(217,119,6,0.25)",
                          }}>
                          {isDisconnected ? "🔴 Disconnected" : "🟡 Weak Signal"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color:"var(--text-muted)" }}>
                      {ni.issue} · {ni.durationMin} min
                    </p>
                  </div>

                  {/* Action / time */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] font-mono" style={{ color:"var(--text-muted)" }}>
                      {ni.disconnectedAt}
                    </span>
                    {!ni.resolved && (
                      <button
                        onClick={() => router.push("/monitoring")}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-colors"
                        style={{ background:"var(--primary-muted)", color:"var(--primary)",
                                 border:"1px solid rgba(37,99,235,0.2)" }}>
                        Take Action
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [invProfile,     setInvProfile]     = useState(null);
  // 1 = choose class, 2 = choose exam, 3 = confirm, 4 = active dashboard
  const [step,           setStep]           = useState(1);
  const [selectedClass,  setSelectedClass]  = useState(null);
  const [selectedExam,   setSelectedExam]   = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("invProfile");
    if (raw) {
      const profile = JSON.parse(raw);
      setInvProfile(profile);
    }
    // Restore saved session if exists
    const clsRaw  = sessionStorage.getItem("invSelectedClass");
    const examRaw = sessionStorage.getItem("invSelectedExam");
    if (clsRaw && examRaw) {
      try {
        const cls  = JSON.parse(clsRaw);
        const exam = JSON.parse(examRaw);
        if (cls?.id && exam?.id) {
          setSelectedClass(cls);
          setSelectedExam(exam);
          setStep(4);
        }
      } catch { /* ignore bad data */ }
    }
  }, []);

  function handleClassSelect(cls) {
    setSelectedClass(cls);
    setStep(2);
  }

  function handleExamSelect(exam) {
    setSelectedExam(exam);
    setStep(3);
  }

  function handleStart() {
    // Persist session for sidebar, monitoring, violations, reports pages
    sessionStorage.setItem("invSelectedClass", JSON.stringify(selectedClass));
    sessionStorage.setItem("invSelectedExam",  JSON.stringify(selectedExam));
    // Trigger websocket reconnect with new class scope
    import("@/services/websocket").then(({ connectSocket }) => {
      connectSocket(selectedClass.id);
    });
    setStep(4);
  }

  function handleChangeSession() {
    // Clear saved session, go back to class picker
    sessionStorage.setItem("invSelectedClass", "");
    sessionStorage.setItem("invSelectedExam",  "");
    setSelectedClass(null);
    setSelectedExam(null);
    setStep(1);
  }

  // Step labels for breadcrumb
  const STEPS = ["Choose Class", "Choose Exam", "Confirm", "Monitoring"];

  const isSetup = step < 4;

  return (
    <DashboardLayout
      title={isSetup ? "Session Setup" : "Dashboard"}
      subtitle={
        isSetup
          ? "Select class and exam to begin monitoring"
          : `${selectedClass?.label} · ${selectedExam?.title}`
      }
    >
      {/* ── Setup wizard wrapper ── */}
      {isSetup && (
        <div className="max-w-2xl mx-auto">
          {/* Progress stepper */}
          <motion.div
            initial={{ opacity:0, y:-8 }}
            animate={{ opacity:1, y:0 }}
            className="flex items-center justify-center gap-0 mb-10"
          >
            {STEPS.slice(0, 3).map((label, i) => {
              const s = i + 1;
              const done   = step > s;
              const active = step === s;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: done ? "var(--success)" : active ? "var(--primary)" : "var(--border)",
                        color: done || active ? "white" : "var(--text-muted)",
                        boxShadow: active ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",
                      }}
                    >
                      {done ? <Check size={13}/> : s}
                    </div>
                    <span className="text-[10px] font-medium whitespace-nowrap"
                      style={{ color: active ? "var(--primary)" : done ? "var(--success)" : "var(--text-muted)" }}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="w-16 h-0.5 mx-2 mb-4 transition-all"
                      style={{ background: step > s ? "var(--success)" : "var(--border)" }}/>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-30 }} transition={{ duration:0.22 }}>
                <ClassSelector onSelect={handleClassSelect}/>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-30 }} transition={{ duration:0.22 }}>
                <ExamSelector
                  selectedClass={selectedClass}
                  onSelect={handleExamSelect}
                  onBack={() => setStep(1)}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-30 }} transition={{ duration:0.22 }}>
                <MonitoringReady
                  selectedClass={selectedClass}
                  selectedExam={selectedExam}
                  onBack={() => setStep(2)}
                  onStart={handleStart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Active dashboard ── */}
      {step === 4 && selectedClass && selectedExam && (
        <ActiveDashboard
          invProfile={invProfile}
          selectedClass={selectedClass}
          selectedExam={selectedExam}
          onChangeSession={handleChangeSession}
        />
      )}
    </DashboardLayout>
  );
}
