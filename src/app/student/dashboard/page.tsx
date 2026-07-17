"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/authStore";
import { MOCK_ASSESSMENTS } from "@/data/studentData";
import { ANIMATION_VARIANTS } from "@/constants";
import { Shield, Clock, BookOpen, CheckCircle2, AlertTriangle, Calendar, ChevronRight, Lock, Play, GraduationCap, LogOut } from "lucide-react";

function ExamCard({ exam, onSelect }: { exam: typeof MOCK_ASSESSMENTS[0]; onSelect: () => void }) {
  const isAvailable = exam.status === "available";
  const isUpcoming  = exam.status === "upcoming";
  const isCompleted = exam.status === "completed";

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeUp}
      className={`card p-5 cursor-pointer transition-all ${isAvailable ? "hover:border-primary/30" : "opacity-70"}`}
      onClick={isAvailable ? onSelect : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isAvailable ? "bg-primary/10" : isCompleted ? "bg-success/10" : "bg-surface-2"
          }`}>
            {isAvailable  ? <Play         className="w-4 h-4 text-primary" /> :
             isCompleted  ? <CheckCircle2 className="w-4 h-4 text-success" /> :
                             <Lock        className="w-4 h-4 text-text-muted" />}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary">{exam.title}</p>
            <p className="text-[12px] text-text-muted">{exam.code} · {exam.subject}</p>
          </div>
        </div>
        <Badge
          variant={isAvailable ? "success" : isCompleted ? "muted" : "primary"}
          dot
        >
          {exam.status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: <Clock     className="w-3 h-3" />, label: `${exam.duration} min`    },
          { icon: <BookOpen  className="w-3 h-3" />, label: `${exam.totalQuestions} Qs` },
          { icon: <Calendar  className="w-3 h-3" />, label: exam.date                 },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
            {item.icon}{item.label}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-text-muted">
          {exam.startTime} – {exam.endTime}
        </span>
        {isAvailable && (
          <button className="flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:text-blue-400 transition-colors">
            Start Exam <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function StudentDashboardPage() {
  const { userName, userEmail, userAvatar, userDept, logout } = useAuthStore();
  const router = useRouter();

  const available = MOCK_ASSESSMENTS.filter((a) => a.status === "available");
  const upcoming  = MOCK_ASSESSMENTS.filter((a) => a.status === "upcoming");

  const handleExamSelect = (examId: string) => {
    router.push(`/student/exam?id=${examId}`);
  };

  return (
    <div className="min-h-screen bg-background mesh-bg">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-[14px] font-bold text-text-primary">LMSGuard</span>
            <span className="badge badge-success text-[10px]">Student Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar name={userName ?? "S"} size="sm" />
              <div className="hidden sm:block">
                <p className="text-[12.5px] font-semibold text-text-primary leading-tight">{userName}</p>
                <p className="text-[11px] text-text-muted leading-tight">{userDept}</p>
              </div>
            </div>
            <button onClick={() => { logout(); router.push("/student/login"); }}
              className="icon-btn text-text-muted hover:text-danger hover:bg-danger/10">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div variants={ANIMATION_VARIANTS.fadeUp} initial="hidden" animate="visible">
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">
            Welcome back, {userName?.split(" ")[0]}
          </h1>
          <p className="text-[13.5px] text-text-muted mt-1">
            {userDept} · 22CS101 · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </motion.div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Exams Available",  value: available.length, color: "text-success", bg: "bg-success/8  border-success/15"  },
            { label: "Upcoming",         value: upcoming.length,  color: "text-primary", bg: "bg-primary/8  border-primary/15"  },
            { label: "Completed",        value: 2,                color: "text-text-muted", bg: "bg-surface-2 border-white/6"   },
            { label: "Avg Score",        value: "84%",            color: "text-cyan",    bg: "bg-cyan/8     border-cyan/15"     },
          ].map((s, i) => (
            <div key={i} className={`flex flex-col gap-1 px-4 py-3.5 rounded-xl border ${s.bg}`}>
              <span className={`text-[24px] font-bold font-feature ${s.color}`}>{s.value}</span>
              <span className="text-[12px] text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Instructions banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-[13px] text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">Before you begin</p>
            <p>Ensure you are in a quiet, well-lit space. Close all other applications. The exam browser will lock your screen during the exam. Any violation will be recorded and reported.</p>
          </div>
        </div>

        {/* Available exams */}
        {available.length > 0 && (
          <div>
            <p className="section-title mb-4">Available Exams</p>
            <motion.div
              variants={ANIMATION_VARIANTS.stagger} initial="hidden" animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {available.map((exam) => (
                <ExamCard key={exam.id} exam={exam} onSelect={() => handleExamSelect(exam.id)} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Upcoming exams */}
        {upcoming.length > 0 && (
          <div>
            <p className="section-title mb-4">Upcoming Exams</p>
            <motion.div
              variants={ANIMATION_VARIANTS.stagger} initial="hidden" animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {upcoming.map((exam) => (
                <ExamCard key={exam.id} exam={exam} onSelect={() => {}} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
