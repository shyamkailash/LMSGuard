"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Lock, ArrowRight, Clock, User, BookOpen, AlertTriangle } from "lucide-react";
import { MOCK_ASSESSMENTS } from "@/data/studentData";
import { useAuthStore } from "@/store/authStore";

function PermissionGrantedContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const examId       = searchParams.get("id") ?? "EXAM001";
  const exam         = MOCK_ASSESSMENTS.find((e) => e.id === examId) ?? MOCK_ASSESSMENTS[0];
  const { userName } = useAuthStore();

  const [countdown, setCountdown] = useState(10);
  const [autoLaunch, setAutoLaunch] = useState(false);

  /* Countdown to auto-launch */
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setAutoLaunch(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* Navigate when countdown hits zero or user clicks launch */
  useEffect(() => {
    if (autoLaunch) {
      router.push(`/student/launch?id=${examId}`);
    }
  }, [autoLaunch, examId, router]);

  const handleLaunch = () => router.push(`/student/launch?id=${examId}`);

  return (
    <div className="min-h-screen bg-background mesh-bg flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-success/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 h-[52px] flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13.5px] font-bold text-text-primary">LMSGuard</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-5">
          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 160 }}
            className="card p-8 text-center"
          >
            {/* Checkmark */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-success/20"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.3 + i * 0.15, opacity: 0 }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeOut" }}
                />
              ))}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-28 h-28 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center relative z-10"
              >
                <CheckCircle2 className="w-14 h-14 text-success" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[12px] font-semibold text-success">Permission Granted</span>
              </div>
              <h1 className="text-[22px] font-bold text-text-primary tracking-tight">
                You&#39;re cleared to begin!
              </h1>
              <p className="text-[13px] text-text-muted">
                Your invigilator has approved your exam session. LMSGuard Secure Browser
                will activate monitoring when you launch the exam.
              </p>
            </motion.div>

            {/* Exam details */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-surface-2/70 border border-white/5 text-left space-y-2.5 mb-6"
            >
              {[
                { icon: BookOpen, label: "Exam",      value: exam.title,           color: "text-primary"  },
                { icon: Clock,    label: "Duration",  value: `${exam.duration} min`, color: "text-warning" },
                { icon: User,     label: "Student",   value: userName ?? "Rahul Kumar", color: "text-success" },
                { icon: Lock,     label: "Security",  value: exam.securityLevel,   color: "text-blue-400" },
              ].map((f) => {
                const FIcon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3">
                    <FIcon className={`w-3.5 h-3.5 shrink-0 ${f.color}`} />
                    <span className="text-[11.5px] text-text-muted w-20">{f.label}</span>
                    <span className="text-[12.5px] font-medium text-text-secondary truncate">{f.value}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Launch Button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleLaunch}
                className="btn btn-success w-full justify-center gap-2.5 py-3.5 text-[14.5px] font-semibold relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-white/5"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <Lock className="w-4 h-4" />
                Launch LMSGuard Secure Browser
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-5 h-5 rounded-full border-2 border-success/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-success">{countdown}</span>
                </div>
                <span className="text-[12px] text-text-muted">Auto-launching in {countdown}s</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-warning/8 border border-warning/20"
          >
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-text-secondary">
              Once you launch the exam, your timer starts and cannot be paused.
              Ensure all distractions are removed before proceeding.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PermissionGrantedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-success/30 border-t-success rounded-full animate-spin" />
      </div>
    }>
      <PermissionGrantedContent />
    </Suspense>
  );
}
