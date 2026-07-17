"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { ANIMATION_VARIANTS } from "@/constants";
import { Shield, CheckCircle2, Trophy, Home } from "lucide-react";

function CompletedContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { userName } = useAuthStore();

  const score     = Number(searchParams.get("score")  ?? 0);
  const total     = Number(searchParams.get("total")  ?? 50);
  const examTitle = decodeURIComponent(searchParams.get("exam") ?? "Exam");

  const percentage = Math.round((score / total) * 100);
  const passed     = percentage >= 40;
  const grade      =
    percentage >= 90 ? "A+" : percentage >= 80 ? "A"  :
    percentage >= 70 ? "B+" : percentage >= 60 ? "B"  :
    percentage >= 50 ? "C"  : percentage >= 40 ? "D"  : "F";

  const colorClass   = percentage >= 70 ? "text-success" : percentage >= 40 ? "text-warning" : "text-danger";
  const borderColor  = percentage >= 70 ? "border-success/20 bg-success/10" : percentage >= 40 ? "border-warning/20 bg-warning/10" : "border-danger/20 bg-danger/10";
  const strokeColor  = percentage >= 70 ? "#22C55E" : percentage >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="min-h-screen bg-background mesh-bg flex flex-col">
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px] font-bold text-text-primary">LMSGuard</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-5">
          <motion.div
            variants={ANIMATION_VARIANTS.scaleIn} initial="hidden" animate="visible"
            className="card p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center border ${borderColor}`}
            >
              {passed ? <Trophy className={`w-9 h-9 ${colorClass}`} /> : <CheckCircle2 className="w-9 h-9 text-text-muted" />}
            </motion.div>

            <p className="text-[13px] text-text-muted mb-1">{passed ? "🎉 Congratulations!" : "Exam Submitted"}</p>
            <h1 className="text-[22px] font-bold text-text-primary mb-1 tracking-tight">{passed ? "You Passed!" : "Keep Practising"}</h1>
            <p className="text-[13px] text-text-muted mb-6">{examTitle}</p>

            {/* Score ring */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1F2937" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={strokeColor} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-[28px] font-bold ${colorClass} font-feature`}>{percentage}%</span>
                <span className="text-[11px] text-text-muted">Score</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Correct", value: score,         color: "text-success"  },
                { label: "Wrong",   value: total - score, color: "text-danger"   },
                { label: "Grade",   value: grade,         color: colorClass      },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-surface-2/60">
                  <p className={`text-[20px] font-bold ${s.color} font-feature`}>{s.value}</p>
                  <p className="text-[11px] text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-surface-2/50 mb-6 text-left space-y-1.5">
              {[
                { label: "Student",   value: userName ?? "—"                },
                { label: "Questions", value: `${score}/${total}`            },
                { label: "Status",    value: passed ? "PASS" : "FAIL", className: passed ? "text-success font-semibold" : "text-danger font-semibold" },
                { label: "Submitted", value: new Date().toLocaleTimeString() },
              ].map((f) => (
                <div key={f.label} className="flex justify-between text-[12.5px]">
                  <span className="text-text-muted">{f.label}</span>
                  <span className={f.className ?? "text-text-secondary font-medium"}>{f.value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => router.push("/student/dashboard")}
              className="btn btn-primary w-full justify-center gap-2">
              <Home className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
          </motion.div>

          <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-text-secondary">
              Your exam session was monitored by LMSGuard AI. All activity has been submitted to your invigilator for review.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function StudentCompletedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <CompletedContent />
    </Suspense>
  );
}
