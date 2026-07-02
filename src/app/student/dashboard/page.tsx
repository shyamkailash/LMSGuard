"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap, Clock, BookOpen, CheckCircle,
  Calendar, AlertCircle, LogOut, ChevronRight, Zap, FileText, Shield
} from "lucide-react";
import Link from "next/link";
import { MOCK_ASSESSMENTS, MOCK_STUDENT } from "@/data/studentData";

const STATUS_CFG = {
  available: { label:"Available",  badge:"badge-success", dot:"var(--success)", icon: CheckCircle  },
  upcoming:  { label:"Upcoming",   badge:"badge-warning", dot:"var(--warning)", icon: Calendar     },
  completed: { label:"Completed",  badge:"badge-primary", dot:"var(--primary)", icon: CheckCircle  },
};

export default function StudentDashboard() {
  const router = useRouter();
  const [studentName, setStudentName] = useState(MOCK_STUDENT.name);
  const [time, setTime] = useState("");

  useEffect(() => {
    // Restore name from session if available
    const saved = sessionStorage.getItem("studentName");
    if (saved) setStudentName(saved);

    // Live clock
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function handleStartExam(exam) {
    if (exam.status !== "available") return;
    sessionStorage.setItem("activeExam", JSON.stringify(exam));
    router.push(`/student/exam?id=${exam.id}`);
  }

  function handleLogout() {
    sessionStorage.clear();
    router.push("/student/login");
  }

  const firstName = studentName.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top Navbar */}
      <header
        className="h-14 flex items-center justify-between px-6 sticky top-0 z-10"
        style={{ background:"var(--card)", borderBottom:"2px solid #1B4D1E",
                 boxShadow:"var(--shadow)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
              <Shield size={15} className="text-white"/>
            </div>
          <div>
            <p className="text-xs font-bold leading-tight" style={{ color:"#1B4D1E" }}>
              Institute
            </p>
            <p className="text-[9px] leading-tight" style={{ color:"var(--text-muted)" }}>
              LMSGuard AI · Student Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-medium"
            style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            <Clock size={11} />
            {time}
          </div>

          

          {/* User badge */}
          <div
            className="flex items-center gap-2 pl-3 cursor-default"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800] flex items-center justify-center text-white text-[10px] font-bold">
              {studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{studentName}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{MOCK_STUDENT.regno}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: "var(--danger-muted)", color: "var(--danger)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            <LogOut size={12} /> Logout
          </motion.button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-6 mb-7 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(139,0,0,0.10),rgba(200,150,30,0.06))",
            border: "1px solid rgba(27,77,30,0.15)",
          }}
        >
          <div className="absolute right-4 top-4 w-24 h-24 rounded-full opacity-10"
               style={{ background: "var(--success)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <h1 className="text-xl font-bold" style={{ color:"#1B4D1E" }}>
                Welcome back, <span style={{ color:"var(--accent)" }}>{firstName}!</span>
              </h1>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {MOCK_STUDENT.department} · {MOCK_STUDENT.semester} · {MOCK_STUDENT.regno}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <FileText size={13} style={{ color: "var(--success)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {MOCK_ASSESSMENTS.filter(a => a.status === "available").length} exam{MOCK_ASSESSMENTS.filter(a => a.status === "available").length !== 1 ? "s" : ""} available
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} style={{ color: "var(--warning)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {MOCK_ASSESSMENTS.filter(a => a.status === "upcoming").length} upcoming
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            Available Assessments
          </h2>
          <div className="flex items-center gap-1.5">
            <Zap size={12} style={{ color: "var(--warning)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>AI-proctored exams</span>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_ASSESSMENTS.map((exam, i) => {
            const sc = STATUS_CFG[exam.status] || STATUS_CFG.upcoming;
            const StatusIcon = sc.icon;
            const canStart = exam.status === "available";

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={canStart ? { y: -5, transition: { duration: 0.18 } } : {}}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "var(--card)",
                  border: canStart ? "1px solid rgba(27,77,30,0.2)" : "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                  opacity: canStart ? 1 : 0.75,
                }}
              >
                {/* Top color bar */}
                <div
                  className="h-1.5"
                  style={{
                    background: canStart
                      ? "linear-gradient(90deg, #16A34A, #2563EB)"
                      : "var(--border)",
                  }}
                />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: canStart ? "var(--success-muted)" : "var(--bg-deep)",
                        border: `1px solid ${canStart ? "rgba(22,163,74,0.2)" : "var(--border)"}`,
                      }}
                    >
                      <BookOpen size={18} style={{ color: canStart ? "var(--success)" : "var(--text-muted)" }} />
                    </div>
                    <span className={`badge ${sc.badge}`}>
                      <StatusIcon size={9} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base mb-0.5 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {exam.title}
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    {exam.subject} · {exam.code}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { icon: Clock,    label: "Duration",   value: `${exam.duration} min` },
                      { icon: FileText, label: "Questions",  value: `${exam.totalQuestions} Qs` },
                      { icon: Zap,      label: "Marks",      value: `${exam.totalMarks}` },
                      { icon: Calendar, label: "Date",       value: exam.date },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 p-2 rounded-xl"
                        style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}
                      >
                        <Icon size={11} style={{ color: "var(--text-muted)" }} />
                        <div>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</p>
                          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex-1" />

                  {/* CTA */}
                  {canStart ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #16A34A, #15803D)",
                        boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
                      }}
                    >
                      Start Exam <ChevronRight size={14} />
                    </motion.button>
                  ) : (
                    <div
                      className="w-full py-2.5 rounded-xl text-sm font-medium text-center"
                      style={{ background: "var(--bg-deep)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                    >
                      {exam.status === "upcoming" ? "⏳ Not yet available" : "✅ Completed"}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-7 flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: "var(--primary-muted)", border: "1px solid rgba(37,99,235,0.15)" }}
        >
          <AlertCircle size={16} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--primary)" }}>
              Important Instructions
            </p>
            <ul className="text-xs space-y-0.5" style={{ color: "var(--text-secondary)" }}>
              <li>• Ensure stable internet connection before starting.</li>
              <li>• Do not switch tabs or applications during the exam.</li>
              <li>• AI monitoring is active throughout the session.</li>
              <li>• Submit the exam before the timer runs out.</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
