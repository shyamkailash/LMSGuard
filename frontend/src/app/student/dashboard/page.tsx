"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Clock, BookOpen, CheckCircle,
  Calendar, AlertCircle, LogOut, ChevronRight, Zap, FileText,
  Shield, Key, XCircle, Lock
} from "lucide-react";
import { getSession, clearSession } from "@/lib/session";
import ThemeToggle from "@/components/ThemeToggle";
import { MOCK_ASSESSMENTS } from "@/data/studentData";
// TODO: Replace MOCK_ASSESSMENTS with real exam schedule from backend API
// GET /api/student/exams/{student_id}

const STATUS_CFG = {
  available: { label: "Available",  badge: "badge-success", dot: "var(--success)", icon: CheckCircle },
  upcoming:  { label: "Upcoming",   badge: "badge-warning", dot: "var(--warning)", icon: Calendar    },
  completed: { label: "Completed",  badge: "badge-primary", dot: "var(--primary)", icon: CheckCircle },
};

/** Start Password modal that students must pass before beginning an exam */
function StartPasswordModal({
  examTitle,
  onConfirm,
  onCancel,
}: {
  examTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [input, setInput]   = useState("");
  const [error, setError]   = useState("");
  const [locked, setLocked] = useState(false);

  // TODO: Fetch the actual start password from backend GET /api/student/security-control/{student_id}
  // For now, any 4+ char input is accepted as a placeholder
  const DEMO_PASSWORD = "1234";

  function handleVerify() {
    if (input === DEMO_PASSWORD) {
      onConfirm();
    } else {
      setError("Incorrect start password. Please contact your invigilator.");
      setLocked(true);
      setTimeout(() => setLocked(false), 3000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
         style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl p-7 text-center"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}>

        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
             style={{ background: "var(--primary-muted)" }}>
          <Key size={28} style={{ color: "var(--primary)" }} />
        </div>

        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Enter Start Password
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
          {examTitle}
        </p>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          Your invigilator has provided a start password to begin this exam session.
        </p>

        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(""); }}
          placeholder="Enter start password"
          className="input-field !rounded-xl text-center text-lg font-mono mb-3"
          autoFocus
          onKeyDown={e => e.key === "Enter" && !locked && handleVerify()}
        />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl mb-3"
              style={{ color: "var(--danger)", background: "var(--danger-soft)", border: "1px solid var(--danger-border)" }}>
              <XCircle size={13} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            Cancel
          </button>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleVerify} disabled={!input || locked}
            className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
            <Shield size={13} /> Verify
          </motion.button>
        </div>

        <p className="text-[10px] mt-3" style={{ color: "var(--text-muted)" }}>
          {/* TODO: Remove demo hint when real password system is connected */}
          Demo: enter "1234" to proceed
        </p>
      </motion.div>
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("Student");
  const [studentId,   setStudentId]   = useState("student-001");
  const [time, setTime] = useState("");
  const [pendingExam, setPendingExam] = useState<typeof MOCK_ASSESSMENTS[0] | null>(null);

  useEffect(() => {
    // Route guard — student only
    // TODO (backend): Validate session token server-side
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    if (session.role !== "student") { router.replace("/login"); return; }

    setStudentName(session.name);
    setStudentId(session.user_id);

    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function handleStartExam(exam: typeof MOCK_ASSESSMENTS[0]) {
    if (exam.status !== "available") return;
    setPendingExam(exam); // Show password prompt first
  }

  function handlePasswordConfirmed() {
    if (!pendingExam) return;
    sessionStorage.setItem("activeExam", JSON.stringify(pendingExam));
    router.push(`/student/exam?id=${pendingExam.id}`);
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const firstName = studentName.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Start Password Modal */}
      <AnimatePresence>
        {pendingExam && (
          <StartPasswordModal
            examTitle={pendingExam.title}
            onConfirm={handlePasswordConfirmed}
            onCancel={() => setPendingExam(null)}
          />
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-10"
        style={{ background: "var(--card)", borderBottom: "2px solid #1B4D1E", boxShadow: "var(--shadow)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight" style={{ color: "#1B4D1E" }}>LMSGuard AI</p>
            <p className="text-[9px] leading-tight" style={{ color: "var(--text-muted)" }}>
              Student Exam Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Live clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-medium"
               style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <Clock size={11} /> {time}
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-3 cursor-default"
               style={{ borderLeft: "1px solid var(--border)" }}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800] flex items-center justify-center text-white text-[10px] font-bold">
              {studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{studentName}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{studentId}</p>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: "var(--danger-muted)", color: "var(--danger)", border: "1px solid rgba(220,38,38,0.2)" }}>
            <LogOut size={12} /> Logout
          </motion.button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-2xl p-6 mb-7 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(22,163,74,0.06))",
            border: "1px solid rgba(27,77,30,0.15)",
          }}>
          <div className="absolute right-4 top-4 w-24 h-24 rounded-full opacity-10"
               style={{ background: "var(--success)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <h1 className="text-xl font-bold" style={{ color: "#1B4D1E" }}>
                Welcome back, <span style={{ color: "var(--primary)" }}>{firstName}!</span>
              </h1>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Student Session · ID: {studentId}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <FileText size={13} style={{ color: "var(--success)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {MOCK_ASSESSMENTS.filter(a => a.status === "available").length} exam(s) available
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

        {/* Exam password notice */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-start gap-3 p-4 rounded-2xl mb-6"
          style={{ background: "var(--primary-muted)", border: "1px solid var(--primary-border)" }}>
          <Key size={16} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--primary)" }}>
              Exam Session Password Required
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              You will be asked to enter a <strong>Start Password</strong> (provided by your invigilator) before
              beginning any exam. A <strong>Quit Password</strong> is required to submit and exit.
            </p>
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
              <motion.div key={exam.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={canStart ? { y: -5, transition: { duration: 0.18 } } : {}}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "var(--card)",
                  border: canStart ? "1px solid rgba(27,77,30,0.2)" : "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                  opacity: canStart ? 1 : 0.75,
                }}>
                <div className="h-1.5" style={{
                  background: canStart ? "linear-gradient(90deg,#16A34A,#2563EB)" : "var(--border)",
                }} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{
                           background: canStart ? "var(--success-muted)" : "var(--bg-deep)",
                           border: `1px solid ${canStart ? "rgba(22,163,74,0.2)" : "var(--border)"}`,
                         }}>
                      <BookOpen size={18} style={{ color: canStart ? "var(--success)" : "var(--text-muted)" }} />
                    </div>
                    <span className={`badge ${sc.badge}`}>
                      <StatusIcon size={9} /> {sc.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-0.5 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {exam.title}
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    {exam.subject} · {exam.code}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { icon: Clock,    label: "Duration",  value: `${exam.duration} min` },
                      { icon: FileText, label: "Questions", value: `${exam.totalQuestions} Qs` },
                      { icon: Zap,      label: "Marks",     value: `${exam.totalMarks}` },
                      { icon: Calendar, label: "Date",      value: exam.date },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2 p-2 rounded-xl"
                           style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                        <Icon size={11} style={{ color: "var(--text-muted)" }} />
                        <div>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</p>
                          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1" />
                  {canStart ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                      style={{ background: "linear-gradient(135deg,#16A34A,#15803D)",
                               boxShadow: "0 4px 12px rgba(22,163,74,0.25)" }}>
                      <Key size={13} /> Enter Start Password
                    </motion.button>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl text-sm font-medium text-center"
                         style={{ background: "var(--bg-deep)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      {exam.status === "upcoming" ? "⏳ Not yet available" : "✅ Completed"}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security notice */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-7 flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: "var(--primary-muted)", border: "1px solid rgba(37,99,235,0.15)" }}>
          <AlertCircle size={16} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--primary)" }}>
              Examination Security Notice
            </p>
            <ul className="text-xs space-y-0.5" style={{ color: "var(--text-secondary)" }}>
              <li>• Ensure stable internet connection before starting.</li>
              <li>• Do not switch tabs or applications — AI monitoring is active throughout the session.</li>
              <li>• A Start Password is required to begin. A Quit Password is required to submit.</li>
              <li>• Unauthorized app usage will be flagged and reported to your invigilator.</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
