"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, GraduationCap, LogOut, Clock, FileText, Zap, Home } from "lucide-react";

// Confetti particle generator
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: ["#16A34A","#2563EB","#7C3AED","#F59E0B","#EF4444","#22C55E"][i % 6],
  size: Math.random() * 8 + 4,
  delay: Math.random() * 0.8,
  duration: Math.random() * 2 + 2,
}));

export default function ExamCompletedPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("Student");
  const [examData, setExamData]       = useState(null);
  const [submitTime, setSubmitTime]   = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("studentName") || "Student";
    setStudentName(name);

    const raw = sessionStorage.getItem("activeExam");
    if (raw) setExamData(JSON.parse(raw));

    const now = new Date();
    setSubmitTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, []);

  function handleLogout() {
    sessionStorage.clear();
    router.push("/student/login");
  }

  function handleHome() {
    router.push("/student/dashboard");
  }

  const answersRaw = typeof window !== "undefined" ? sessionStorage.getItem("examAnswers") : null;
  const answersCount = answersRaw ? Object.keys(JSON.parse(answersRaw)).length : 0;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Confetti */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.8,
          }}
          initial={{ y: -20, rotate: 0, opacity: 0.8 }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0.8, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Theme toggle */}
      <div className="absolute top-5 right-5">
        
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        transition={{ duration: 0.55, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md relative"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid rgba(22,163,74,0.3)", boxShadow: "var(--shadow-xl)" }}
        >
          {/* Top accent */}
          <div className="h-2" style={{ background: "linear-gradient(90deg, #16A34A, #2563EB, #7C3AED)" }} />

          <div className="p-8 text-center">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 250, damping: 18 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
              style={{
                background: "linear-gradient(135deg, rgba(22,163,74,0.15), rgba(37,99,235,0.1))",
                border: "3px solid rgba(22,163,74,0.4)",
              }}
            >
              <CheckCircle size={40} style={{ color: "var(--success)" }} />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                Exam Completed!
              </h1>
              <p className="text-base font-medium mb-1" style={{ color: "var(--success)" }}>
                ✅ Your Response Submitted Successfully
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Well done, <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{studentName.split(" ")[0]}</span>!
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 rounded-2xl p-4 space-y-3"
              style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}
            >
              {examData && (
                <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <FileText size={14} style={{ color: "var(--success)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Exam</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{examData.title}</span>
                </div>
              )}

              {[
                { icon: FileText, label: "Questions Answered", value: `${answersCount} / ${examData?.totalQuestions || "—"}`, color: "var(--success)"  },
                { icon: Clock,    label: "Submitted At",       value: submitTime,                                               color: "var(--primary)"  },
                { icon: Zap,      label: "Status",             value: "Under Review",                                          color: "var(--warning)" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={13} style={{ color }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-4 p-3 rounded-xl"
              style={{ background: "var(--success-muted)", border: "1px solid rgba(22,163,74,0.2)" }}
            >
              <p className="text-xs" style={{ color: "var(--success)" }}>
                🎉 Your exam has been submitted and is being reviewed by the AI monitoring system.
                Results will be published by your instructor.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-6 flex flex-col gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #16A34A, #15803D)",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
                }}
              >
                <LogOut size={14} /> Logout
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHome}
                className="w-full py-2.5 rounded-xl text-sm font-semibold btn-secondary flex items-center justify-center gap-2"
              >
                <Home size={13} /> Back to Dashboard
              </motion.button>
            </motion.div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-center gap-2 px-6 py-3"
            style={{ borderTop: "1px solid var(--border)", background: "var(--bg-deep)" }}
          >
            <GraduationCap size={12} style={{ color: "var(--success)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              LMSGuard AI · Student Exam Portal
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
