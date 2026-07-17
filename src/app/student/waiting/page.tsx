"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, User, CheckCircle2, Loader2, Wifi, Monitor, Camera } from "lucide-react";
import { MOCK_ASSESSMENTS } from "@/data/studentData";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

type ApprovalStatus = "waiting" | "approved" | "rejected";

const SYSTEM_CHECKS = [
  { id: "camera",  icon: Camera,  label: "Camera access",     delay: 600  },
  { id: "network", icon: Wifi,    label: "Network connection", delay: 1100 },
  { id: "screen",  icon: Monitor, label: "Screen permission",  delay: 1600 },
];

function WaitingContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const examId       = searchParams.get("id") ?? "EXAM001";
  const exam         = MOCK_ASSESSMENTS.find((e) => e.id === examId) ?? MOCK_ASSESSMENTS[0];
  const { userName } = useAuthStore();

  const [status,        setStatus]        = useState<ApprovalStatus>("waiting");
  const [checksReady,   setChecksReady]   = useState<Record<string, boolean>>({});
  const [waitSeconds,   setWaitSeconds]   = useState(0);
  const [allChecked,    setAllChecked]    = useState(false);

  /* Run system checks in sequence */
  useEffect(() => {
    SYSTEM_CHECKS.forEach(({ id, delay }) => {
      setTimeout(() => {
        setChecksReady((prev) => ({ ...prev, [id]: true }));
      }, delay);
    });
    setTimeout(() => setAllChecked(true), 2000);
  }, []);

  /* Simulate invigilator approval after 6s */
  useEffect(() => {
    if (!allChecked) return;
    const timer = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
    const approvalTimer = setTimeout(() => {
      setStatus("approved");
    }, 6000);
    return () => { clearInterval(timer); clearTimeout(approvalTimer); };
  }, [allChecked]);

  /* Auto-navigate to permission granted screen */
  useEffect(() => {
    if (status === "approved") {
      const t = setTimeout(() => router.push(`/student/permission-granted?id=${examId}`), 2200);
      return () => clearTimeout(t);
    }
  }, [status, examId, router]);

  const formatWait = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 h-[52px] flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13.5px] font-bold text-text-primary">LMSGuard</span>
          <span className="text-text-subtle">·</span>
          <span className="text-[12.5px] text-text-muted truncate">{exam.title}</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-5">
          <AnimatePresence mode="wait">
            {status === "waiting" && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="card p-8 text-center"
              >
                {/* Animated waiting illustration */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  {/* Outer pulse rings */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-primary/20"
                      animate={{ scale: [1, 1.6 + i * 0.15], opacity: [0.4, 0] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  ))}
                  <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-10 h-10 text-primary" />
                    </motion.div>
                  </div>
                </div>

                <h2 className="text-[18px] font-bold text-text-primary mb-1">Waiting for Approval</h2>
                <p className="text-[13px] text-text-muted mb-1">
                  Your invigilator has been notified. Please wait while they verify your identity.
                </p>
                <p className="text-[12px] text-text-subtle">
                  {allChecked ? `Wait time: ${formatWait(waitSeconds)}` : "Running system checks…"}
                </p>

                {/* System Checks */}
                <div className="mt-6 space-y-2.5 text-left">
                  {SYSTEM_CHECKS.map((check) => {
                    const CIcon = check.icon;
                    const done = checksReady[check.id];
                    return (
                      <div key={check.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2/60">
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
                          done ? "bg-success/15" : "bg-surface-3"
                        )}>
                          <CIcon className={cn("w-3.5 h-3.5 transition-colors duration-300", done ? "text-success" : "text-text-muted")} />
                        </div>
                        <span className="text-[12.5px] text-text-secondary flex-1">{check.label}</span>
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4 text-text-subtle" />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Invigilator info */}
                {allChecked && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-white/5"
                  >
                    <div className="w-9 h-9 rounded-full bg-violet-500/15 flex items-center justify-center text-[12px] font-bold text-violet-400">
                      {exam.invigilator.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <p className="text-[12.5px] font-semibold text-text-primary">{exam.invigilator}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <p className="text-[11px] text-text-muted">Reviewing your request…</p>
                      </div>
                    </div>
                    <User className="w-3.5 h-3.5 text-text-subtle ml-auto" />
                  </motion.div>
                )}
              </motion.div>
            )}

            {status === "approved" && (
              <motion.div
                key="approved"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="card p-8 text-center"
              >
                {/* Success animation */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    className="w-28 h-28 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-14 h-14 text-success" />
                  </motion.div>
                  {[1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-success/30"
                      animate={{ scale: [1, 1.5 + i * 0.2], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: 2, ease: "easeOut" }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-[20px] font-bold text-success mb-1">Permission Granted!</h2>
                  <p className="text-[13px] text-text-muted mb-1">
                    {exam.invigilator} has approved your exam request.
                  </p>
                  <p className="text-[12px] text-text-subtle">Redirecting to launch screen…</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exam & Student Info */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
            className="card p-4"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {[
                { label: "Student",     value: userName ?? "Rahul Kumar"      },
                { label: "Exam",        value: exam.title                     },
                { label: "Duration",    value: `${exam.duration} min`         },
                { label: "Invigilator", value: exam.invigilator               },
                { label: "Start Time",  value: exam.startTime                 },
                { label: "Questions",   value: `${exam.totalQuestions} MCQs`  },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-0.5">
                  <span className="text-[10.5px] text-text-subtle uppercase tracking-wide">{f.label}</span>
                  <span className="text-[12.5px] font-medium text-text-secondary truncate">{f.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timer Notice */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-warning/8 border border-warning/20"
          >
            <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-text-secondary">
              Once approved, your exam timer starts immediately. Ensure you are ready before proceeding.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function WaitingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <WaitingContent />
    </Suspense>
  );
}
