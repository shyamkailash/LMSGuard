"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, Clock, BookOpen, Calendar, User, AlertTriangle,
  CheckCircle2, ArrowRight, ChevronLeft, Lock, FileText,
  Eye, Wifi, Cpu, Monitor,
} from "lucide-react";
import { MOCK_ASSESSMENTS } from "@/data/studentData";
import { cn } from "@/lib/utils";

function SecurityBadge({ level }: { level: string }) {
  const cfg = {
    standard: { label: "Standard Security", color: "text-primary",   bg: "bg-primary/10  border-primary/20"   },
    strict:   { label: "Strict Security",   color: "text-warning",   bg: "bg-warning/10  border-warning/20"   },
    lockdown: { label: "Full Lockdown",     color: "text-danger",    bg: "bg-danger/10   border-danger/20"    },
  }[level] ?? { label: level, color: "text-text-muted", bg: "bg-surface-2 border-white/8" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11.5px] font-semibold capitalize", cfg.color, cfg.bg)}>
      <Lock className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function ExamDetailContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const examId       = searchParams.get("id") ?? "EXAM001";
  const exam         = MOCK_ASSESSMENTS.find((e) => e.id === examId) ?? MOCK_ASSESSMENTS[0];

  const securityChecks = [
    { icon: Monitor, label: "Screen Monitoring",   desc: "Full screen recording is active during the exam"     },
    { icon: Eye,     label: "Face Verification",   desc: "AI continuously monitors for multiple faces"          },
    { icon: Wifi,    label: "Network Monitoring",  desc: "Connection quality is tracked throughout the session" },
    { icon: Cpu,     label: "App Detection",       desc: "Running applications are monitored and logged"        },
  ];

  return (
    <div className="min-h-screen bg-background mesh-bg">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 h-[52px] flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="icon-btn"
          >
            <ChevronLeft className="w-4 h-4 text-text-muted" />
          </button>
          <div className="w-px h-4 bg-white/8" />
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13.5px] font-bold text-text-primary">LMSGuard</span>
          <span className="text-text-subtle">·</span>
          <span className="text-[13px] text-text-muted truncate">{exam.title}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-5">
        {/* Exam Hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="card p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SecurityBadge level={exam.securityLevel} />
                <span className="badge badge-success text-[10.5px]">Available</span>
              </div>
              <h1 className="text-[20px] font-bold text-text-primary tracking-tight leading-snug">{exam.title}</h1>
              <p className="text-[13px] text-text-muted mt-1">{exam.code} · {exam.subject}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Clock,    label: "Duration",     value: `${exam.duration} min`          },
              { icon: BookOpen, label: "Questions",    value: `${exam.totalQuestions} MCQs`   },
              { icon: FileText, label: "Total Marks",  value: exam.totalMarks                 },
              { icon: CheckCircle2, label: "Passing",  value: `${exam.passingMarks} marks`    },
              { icon: Calendar, label: "Date",         value: exam.date                       },
              { icon: User,     label: "Invigilator",  value: exam.invigilator                },
            ].map((info) => {
              const InfoIcon = info.icon;
              return (
                <div key={info.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-2/60 border border-white/4">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <InfoIcon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-text-muted uppercase tracking-wide">{info.label}</p>
                    <p className="text-[12.5px] font-semibold text-text-primary">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          className="card p-6"
        >
          <h2 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Instructions
          </h2>
          <ul className="space-y-2.5">
            {exam.instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10.5px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[13px] text-text-secondary leading-relaxed">{inst}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}
          className="card p-6"
        >
          <h2 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> Exam Rules
          </h2>
          <ul className="space-y-2.5">
            {exam.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                <span className="text-[13px] text-text-secondary leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Allowed Materials */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-success" /> Allowed Materials
          </h2>
          <ul className="space-y-2">
            {exam.allowedMaterials.map((mat, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                <span className="text-[13px] text-text-secondary">{mat}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Security Overview */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}
          className="card p-6"
        >
          <h2 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" /> Security & Monitoring
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {securityChecks.map((check) => {
              const CIcon = check.icon;
              return (
                <div key={check.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/60 border border-white/4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-text-primary">{check.label}</p>
                    <p className="text-[11.5px] text-text-muted mt-0.5">{check.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.14 }}
          className="flex items-center gap-4 pb-8"
        >
          <button
            onClick={() => router.back()}
            className="btn btn-secondary gap-2 flex-1 justify-center"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Go Back
          </button>
          <button
            onClick={() => router.push(`/student/waiting?id=${exam.id}`)}
            className="btn btn-primary gap-2 flex-[2] justify-center py-3 text-[14px]"
          >
            Proceed to Exam <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function ExamDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ExamDetailContent />
    </Suspense>
  );
}
