"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, ChevronLeft, Mail, Phone, MapPin, Calendar,
  BookOpen, GraduationCap, Award, TrendingUp, CheckCircle2,
} from "lucide-react";
import { MOCK_STUDENT, MOCK_ASSESSMENTS } from "@/data/studentData";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function StudentProfilePage() {
  const router    = useRouter();
  const { userName } = useAuthStore();
  const student   = MOCK_STUDENT;
  const completed = MOCK_ASSESSMENTS.filter((e) => e.status === "completed");

  const passRate  = Math.round((student.passedExams / student.totalExams) * 100);

  return (
    <div className="min-h-screen bg-background mesh-bg">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 h-[52px] flex items-center gap-3">
          <button onClick={() => router.back()} className="icon-btn">
            <ChevronLeft className="w-4 h-4 text-text-muted" />
          </button>
          <div className="w-px h-4 bg-white/8" />
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13.5px] font-bold text-text-primary">My Profile</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-7 space-y-5">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="card p-6"
        >
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-[24px] font-bold text-primary">
                {student.avatar}
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center",
                student.status === "active" ? "bg-success" : "bg-warning"
              )}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-[19px] font-bold text-text-primary tracking-tight">{student.name}</h1>
                  <p className="text-[13px] text-text-muted mt-0.5">{student.regno} · {student.deptCode}</p>
                </div>
                <Badge variant={student.status === "active" ? "success" : "warning"} dot>
                  {student.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-muted">{student.semester}</span>
                <span className="badge badge-muted">{student.class}</span>
                <span className="badge badge-primary">CGPA {student.cgpa}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5">
            {[
              { label: "Total Exams",  value: student.totalExams,   color: "text-text-primary" },
              { label: "Passed",       value: student.passedExams,  color: "text-success"       },
              { label: "Avg Score",    value: `${student.avgScore}%`, color: "text-cyan"        },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={cn("text-[22px] font-bold font-feature", s.color)}>{s.value}</p>
                <p className="text-[11.5px] text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          className="card p-6"
        >
          <h2 className="text-[13.5px] font-semibold text-text-primary mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Mail,           label: "Email",       value: student.email      },
              { icon: Phone,          label: "Phone",       value: student.phone      },
              { icon: Calendar,       label: "Date of Birth", value: student.dob      },
              { icon: GraduationCap,  label: "Department",  value: student.department },
              { icon: BookOpen,       label: "Semester",    value: student.semester   },
              { icon: MapPin,         label: "Address",     value: student.address    },
            ].map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 border border-white/4">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FIcon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10.5px] text-text-muted uppercase tracking-wide">{f.label}</p>
                    <p className="text-[12.5px] font-medium text-text-secondary mt-0.5 break-words">{f.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Performance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}
          className="card p-6"
        >
          <h2 className="text-[13.5px] font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Performance Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Pass Rate",   value: `${passRate}%`,          icon: Award,      color: "text-success" },
              { label: "CGPA",        value: student.cgpa,             icon: GraduationCap, color: "text-cyan" },
              { label: "Exams Done",  value: student.totalExams,       icon: BookOpen,   color: "text-primary" },
              { label: "Avg Score",   value: `${student.avgScore}%`,  icon: TrendingUp, color: "text-warning" },
            ].map((s) => {
              const SIcon = s.icon;
              return (
                <div key={s.label} className="p-3 rounded-xl bg-surface-2/50 border border-white/4 text-center">
                  <SIcon className={cn("w-4 h-4 mx-auto mb-1.5", s.color)} />
                  <p className={cn("text-[20px] font-bold font-feature", s.color)}>{s.value}</p>
                  <p className="text-[10.5px] text-text-muted">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Pass rate bar */}
          <div>
            <div className="flex justify-between text-[12px] mb-1.5">
              <span className="text-text-muted">Pass Rate</span>
              <span className="text-success font-semibold font-feature">{passRate}%</span>
            </div>
            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-success rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${passRate}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Recent Exams */}
        {completed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-[13.5px] font-semibold text-text-primary mb-4">Completed Exams</h2>
            <div className="space-y-3">
              {completed.map((exam) => {
                const pct = exam.score != null ? Math.round((exam.score / exam.totalMarks) * 100) : 0;
                return (
                  <div key={exam.id} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2/50 border border-white/4 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        pct >= 70 ? "bg-success/15" : pct >= 40 ? "bg-warning/15" : "bg-danger/15"
                      )}>
                        <CheckCircle2 className={cn("w-4 h-4", pct >= 70 ? "text-success" : pct >= 40 ? "text-warning" : "text-danger")} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-medium text-text-secondary truncate">{exam.title}</p>
                        <p className="text-[11px] text-text-muted">{exam.submittedAt}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("text-[14px] font-bold font-feature", pct >= 70 ? "text-success" : pct >= 40 ? "text-warning" : "text-danger")}>
                        {exam.score}/{exam.totalMarks}
                      </p>
                      <p className="text-[11px] text-text-muted">{exam.grade}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
