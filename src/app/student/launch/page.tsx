"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";
import { MOCK_ASSESSMENTS } from "@/data/studentData";
import { cn } from "@/lib/utils";

interface LaunchStep {
  id: string;
  label: string;
  detail: string;
  duration: number;
}

const LAUNCH_STEPS: LaunchStep[] = [
  { id: "session",     label: "Checking Session",             detail: "Verifying exam session integrity…",         duration: 1200 },
  { id: "permission",  label: "Verifying Permission",         detail: "Confirming invigilator approval…",          duration: 1000 },
  { id: "environment", label: "Preparing Secure Environment", detail: "Initialising LMSGuard runtime…",            duration: 1400 },
  { id: "browser",     label: "Launching Secure Browser",     detail: "Activating AI monitoring and locking screen…", duration: 1200 },
];

function LaunchContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const examId       = searchParams.get("id") ?? "EXAM001";
  const exam         = MOCK_ASSESSMENTS.find((e) => e.id === examId) ?? MOCK_ASSESSMENTS[0];

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    let stepIndex = 0;
    let elapsed   = 0;

    const advance = () => {
      if (stepIndex >= LAUNCH_STEPS.length) {
        setDone(true);
        return;
      }
      const step = LAUNCH_STEPS[stepIndex];
      setCurrentStep(stepIndex);
      setTimeout(() => {
        setCompletedSteps((prev) => new Set([...prev, stepIndex]));
        stepIndex++;
        elapsed += step.duration;
        advance();
      }, step.duration);
    };

    advance();
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => router.push(`/student/exam?id=${examId}`), 600);
      return () => clearTimeout(t);
    }
  }, [done, examId, router]);

  const totalDuration = LAUNCH_STEPS.reduce((s, step) => s + step.duration, 0);
  const elapsedDuration = LAUNCH_STEPS.slice(0, currentStep + 1).reduce((s, step) => s + step.duration, 0);
  const progress = Math.min(100, (elapsedDuration / totalDuration) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/4 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm space-y-8">
        {/* Icon */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative w-20 h-20 mb-4">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              animate={{ scale: done ? 1 : [1, 1.04, 1] }}
              transition={{ duration: 1.6, repeat: done ? 0 : Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </motion.div>
                ) : (
                  <motion.div key="loading" exit={{ opacity: 0, scale: 0.8 }}>
                    <Shield className="w-10 h-10 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {!done && (
              <svg className="absolute inset-0 w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(37,99,235,0.1)" strokeWidth="3" />
                <motion.circle
                  cx="40" cy="40" r="36"
                  fill="none" stroke="#2563EB" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 36 * (1 - progress / 100)}` }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
            )}
          </div>
          <h1 className="text-[18px] font-bold text-text-primary tracking-tight">
            {done ? "Exam Ready!" : "Launching Secure Browser"}
          </h1>
          <p className="text-[12.5px] text-text-muted mt-0.5">
            {done ? `Starting ${exam.title}…` : "Please do not close this window"}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card p-5 space-y-3"
        >
          {LAUNCH_STEPS.map((step, idx) => {
            const isComplete = completedSteps.has(idx);
            const isActive   = idx === currentStep && !isComplete;
            const isPending  = idx > currentStep;

            return (
              <div key={step.id} className={cn("flex items-center gap-3 transition-opacity duration-300", isPending && "opacity-40")}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-white/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-[12.5px] font-medium transition-colors",
                    isComplete ? "text-success" : isActive ? "text-text-primary" : "text-text-muted"
                  )}>
                    {step.label}
                  </p>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] text-text-subtle mt-0.5"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-[11.5px] text-text-muted">
            <span>{exam.title}</span>
            <span className="font-feature">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LaunchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LaunchContent />
    </Suspense>
  );
}
