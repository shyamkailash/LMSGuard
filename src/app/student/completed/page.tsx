"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Shield, CheckCircle2, Trophy, Home, Download, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

function CompletedContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { userName } = useAuthStore();

  const score     = Number(searchParams.get("score")  ?? 0);
  const total     = Number(searchParams.get("total")  ?? 50);
  const examTitle = decodeURIComponent(searchParams.get("exam") ?? "Exam");

  const pct     = Math.round((score / total) * 100);
  const passed  = pct >= 40;
  const grade   = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 40 ? "D" : "F";

  const colorClass   = pct >= 70 ? "text-success" : pct >= 40 ? "text-warning" : "text-danger";
  const borderColor  = pct >= 70 ? "border-success/25 bg-success/10" : pct >= 40 ? "border-warning/25 bg-warning/10" : "border-danger/25 bg-danger/10";
  const strokeColor  = pct >= 70 ? "#22C55E" : pct >= 40 ? "#F59E0B" : "#EF4444";
  const circumference = 2 * Math.PI * 48;

  return (
    <div className="min-h-screen bg-background mesh-bg flex flex-col">
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 h-[52px] flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13.5px] font-bold text-text-primary">LMSGuard</span>
          <span className="text-text-subtle text-[12px]">· Exam Submitted</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, type: "spring", stiffness: 160 }}
            className="card p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className={cn("w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center border", borderColor)}
            >
              {passed
                ? <Trophy        className={cn("w-9 h-9", colorClass)} />
                : <CheckCircle2 className="w-9 h-9 text-text-muted" />
              }
            </motion.div>

            <p className="text-[12.5px] text-text-muted mb-1">{passed ? "🎉 Congratulations!" : "Exam Submitted"}</p>
            <h1 className="text-[22px] font-bold text-text-primary mb-1 tracking-tight">
              {passed ? "You Passed!" : "Keep Practising"}
            </h1>
            <p className="text-[13px] text-text-muted mb-6">{examTitle}</p>

            {/* Score ring */}
            <div className="relative w-[120px] h-[120px] mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#1F2937" strokeWidth="9" />
                <motion.circle
                  cx="60" cy="60" r="48"
                  fill="none" stroke={strokeColor} strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-[28px] font-bold font-feature leading-none", colorClass)}>{pct}%</span>
                <span className="text-[11px] text-text-muted">Score</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Correct", value: score,         color: "text-success" },
                { label: "Wrong",   value: total - score, color: "text-danger"  },
                { label: "Grade",   value: grade,         color: colorClass      },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-surface-2/60">
                  <p className={cn("text-[20px] font-bold font-feature", s.color)}>{s.value}</p>
                  <p className="text-[11px] text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-surface-2/50 mb-6 text-left space-y-2">
              {[
                { label: "Student",   value: userName ?? "Rahul Kumar"                    },
                { label: "Questions", value: `${score} correct / ${total} total`         },
                { label: "Status",    value: passed ? "PASS" : "FAIL", hilight: true, passed },
                { label: "Submitted", value: new Date().toLocaleTimeString("en-IN")       },
              ].map((f) => (
                <div key={f.label} className="flex justify-between text-[12.5px]">
                  <span className="text-text-muted">{f.label}</span>
                  <span className={
                    f.hilight
                      ? f.passed ? "text-success font-semibold" : "text-danger font-semibold"
                      : "text-text-secondary font-medium"
                  }>{f.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {}}
                className="btn btn-secondary flex-1 justify-center gap-2 text-[12.5px]"
              >
                <Download className="w-3.5 h-3.5" /> Report
              </button>
              <button
                onClick={() => router.push("/student/dashboard")}
                className="btn btn-primary flex-[2] justify-center gap-2 text-[12.5px]"
              >
                <Home className="w-3.5 h-3.5" /> Dashboard
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20"
          >
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-text-secondary">
              Your exam session was monitored by LMSGuard AI. All activity has been securely
              submitted to your invigilator for review.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => router.push("/student/violations")}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-2/50 border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <div className="text-left">
                  <p className="text-[12.5px] font-medium text-text-secondary">View Violation History</p>
                  <p className="text-[11.5px] text-text-muted">See all recorded events from your sessions</p>
                </div>
              </div>
              <span className="text-text-subtle group-hover:text-text-muted transition-colors text-[12px]">→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function StudentCompletedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <CompletedContent />
    </Suspense>
  );
}
