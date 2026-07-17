"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  Shield, Clock, BookOpen, CheckCircle2, AlertTriangle,
  Calendar, ChevronRight, Lock, Play, GraduationCap,
  LogOut, Bell, User, Trophy, TrendingUp, ChevronDown,
  X, FileText, AlertCircle, Info,
} from "lucide-react";
import { MOCK_ASSESSMENTS, MOCK_STUDENT, MOCK_NOTIFICATIONS, type StudentExam } from "@/data/studentData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

/* ── Exam Card ─────────────────────────────────────────────── */
function ExamCard({ exam, onSelect }: { exam: StudentExam; onSelect: () => void }) {
  const isAvailable = exam.status === "available";
  const isUpcoming  = exam.status === "upcoming";
  const isCompleted = exam.status === "completed";

  const statusConfig = {
    available: { badge: "success" as const, icon: Play,         color: "text-success", bg: "bg-success/10",  label: "Available Now" },
    upcoming:  { badge: "primary" as const, icon: Clock,        color: "text-primary", bg: "bg-primary/10",  label: "Upcoming"      },
    completed: { badge: "muted"   as const, icon: CheckCircle2, color: "text-success", bg: "bg-success/10",  label: "Completed"     },
    missed:    { badge: "danger"  as const, icon: AlertCircle,  color: "text-danger",  bg: "bg-danger/10",   label: "Missed"        },
  }[exam.status];

  const Icon = statusConfig.icon;

  return (
    <motion.div
      layout
      whileHover={isAvailable ? { y: -2 } : undefined}
      className={cn(
        "card p-5 transition-all duration-200",
        isAvailable && "card-hover cursor-pointer",
        !isAvailable && "opacity-80"
      )}
      onClick={isAvailable ? onSelect : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", statusConfig.bg)}>
            <Icon className={cn("w-4 h-4", statusConfig.color)} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-text-primary truncate">{exam.title}</p>
            <p className="text-[12px] text-text-muted">{exam.code} · {exam.subject}</p>
          </div>
        </div>
        <Badge variant={statusConfig.badge} dot className="shrink-0 text-[10.5px]">
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 mb-4 py-3 border-y border-white/5">
        {[
          { icon: <Clock    className="w-3 h-3" />, label: `${exam.duration} min`    },
          { icon: <BookOpen className="w-3 h-3" />, label: `${exam.totalQuestions} Qs` },
          { icon: <Calendar className="w-3 h-3" />, label: exam.date               },
          { icon: <User     className="w-3 h-3" />, label: exam.invigilator        },
          { icon: <Shield   className="w-3 h-3" />, label: exam.securityLevel      },
          { icon: <Trophy   className="w-3 h-3" />, label: `${exam.passingMarks} to pass` },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="shrink-0 text-text-subtle">{item.icon}</span>
            <span className="truncate capitalize">{item.label}</span>
          </div>
        ))}
      </div>

      {isCompleted && exam.score !== undefined ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[22px] font-bold font-feature",
              exam.score / exam.totalMarks >= 0.7 ? "text-success" :
              exam.score / exam.totalMarks >= 0.4 ? "text-warning" : "text-danger"
            )}>
              {exam.score}/{exam.totalMarks}
            </span>
            <span className="badge badge-muted text-[11px]">{exam.grade}</span>
          </div>
          <span className="text-[11.5px] text-text-muted">{exam.submittedAt}</span>
        </div>
      ) : isAvailable ? (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-text-muted">{exam.startTime} – {exam.endTime}</span>
          <button className="flex items-center gap-1 text-[12.5px] font-semibold text-success hover:text-emerald-400 transition-colors">
            Start Exam <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-[12px] text-text-muted">
          <Lock className="w-3 h-3" />
          <span>{exam.startTime} · {exam.date}</span>
        </div>
      )}
    </motion.div>
  );
}

/* ── Main Dashboard ─────────────────────────────────────────── */
export default function StudentDashboardPage() {
  const { userName, userAvatar, userDept, logout } = useAuthStore();
  const router = useRouter();

  const [activeTab,       setActiveTab]       = useState<"all" | "available" | "upcoming" | "completed">("all");
  const [notifOpen,       setNotifOpen]       = useState(false);
  const [profileOpen,     setProfileOpen]     = useState(false);
  const [unreadCount]                         = useState(MOCK_NOTIFICATIONS.filter((n) => !n.read).length);

  const filteredExams = activeTab === "all"
    ? MOCK_ASSESSMENTS
    : MOCK_ASSESSMENTS.filter((e) => e.status === activeTab);

  const available = MOCK_ASSESSMENTS.filter((e) => e.status === "available");
  const upcoming  = MOCK_ASSESSMENTS.filter((e) => e.status === "upcoming");
  const completed = MOCK_ASSESSMENTS.filter((e) => e.status === "completed");

  const handleExamSelect = (examId: string) => router.push(`/student/exam-detail?id=${examId}`);

  const notifIcon = { exam: FileText, alert: AlertTriangle, info: Info, warning: AlertCircle } as const;

  return (
    <div className="min-h-screen bg-background mesh-bg">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[13.5px] font-bold text-text-primary">LMSGuard</span>
            <span className="badge badge-success text-[10px] px-1.5 py-0.5">Student</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                className="icon-btn relative"
              >
                <Bell className="w-4 h-4 text-text-muted" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-danger rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 glass rounded-xl border border-white/8 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 border-b border-white/5">
                      <span className="text-[12.5px] font-semibold text-text-primary">Notifications</span>
                      <button onClick={() => setNotifOpen(false)} className="icon-btn-xs"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto no-scrollbar">
                      {MOCK_NOTIFICATIONS.map((n) => {
                        const NIcon = notifIcon[n.type];
                        return (
                          <div key={n.id} className={cn("flex gap-3 px-3 py-2.5 border-b border-white/4 hover:bg-white/3 transition-colors", !n.read && "bg-primary/4")}>
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                              n.type === "exam" ? "bg-primary/15" : n.type === "alert" ? "bg-warning/15" : "bg-surface-2"
                            )}>
                              <NIcon className={cn("w-3.5 h-3.5", n.type === "exam" ? "text-primary" : n.type === "alert" ? "text-warning" : "text-text-muted")} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[12px] font-semibold text-text-primary truncate">{n.title}</p>
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                              </div>
                              <p className="text-[11.5px] text-text-muted leading-relaxed mt-0.5">{n.message}</p>
                              <p className="text-[10.5px] text-text-subtle mt-1">{n.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-2 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {userAvatar ?? "RK"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[12px] font-semibold text-text-primary leading-none">{userName ?? "Rahul Kumar"}</p>
                  <p className="text-[10.5px] text-text-muted leading-none mt-0.5">Student</p>
                </div>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-white/8 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/5">
                      <p className="text-[13px] font-semibold text-text-primary">{userName}</p>
                      <p className="text-[11.5px] text-text-muted">{MOCK_STUDENT.regno} · {MOCK_STUDENT.class}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => { router.push("/student/profile"); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-2 transition-colors text-left"
                      >
                        <User className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-[12.5px] text-text-secondary">My Profile</span>
                      </button>
                      <button
                        onClick={() => { router.push("/student/violations"); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-2 transition-colors text-left"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-[12.5px] text-text-secondary">Violation History</span>
                      </button>
                      <div className="border-t border-white/5 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); router.push("/student/login"); }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-danger/10 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 text-danger" />
                          <span className="text-[12.5px] text-danger">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-7 space-y-7">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[21px] font-bold text-text-primary tracking-tight">
                Welcome back, {(userName ?? "Rahul").split(" ")[0]} 👋
              </h1>
              <p className="text-[13px] text-text-muted mt-0.5">
                {userDept ?? "Computer Science & Engineering"} · {MOCK_STUDENT.regno} ·{" "}
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/8 border border-success/15">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[12px] text-success font-medium">Session Active</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Available",  value: available.length, color: "text-success", bg: "bg-success/8  border-success/15",  icon: Play          },
            { label: "Upcoming",   value: upcoming.length,  color: "text-primary", bg: "bg-primary/8  border-primary/15",  icon: Calendar      },
            { label: "Completed",  value: completed.length, color: "text-text-secondary", bg: "bg-surface-2 border-white/6", icon: CheckCircle2 },
            { label: "Avg Score",  value: `${MOCK_STUDENT.avgScore}%`, color: "text-cyan", bg: "bg-cyan/8 border-cyan/15",  icon: TrendingUp    },
          ].map((s) => {
            const SIcon = s.icon;
            return (
              <div key={s.label} className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl border", s.bg)}>
                <SIcon className={cn("w-4 h-4 shrink-0", s.color)} />
                <div>
                  <span className={cn("block text-[22px] font-bold font-feature leading-none", s.color)}>{s.value}</span>
                  <span className="text-[11.5px] text-text-muted">{s.label}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Alert banner */}
        {available.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20"
          >
            <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-text-primary">
                {available.length} exam{available.length > 1 ? "s" : ""} available now
              </p>
              <p className="text-[12.5px] text-text-secondary mt-0.5">
                Ensure you are in a quiet, well-lit space. Close all other applications before starting.
                LMSGuard Secure Browser will lock your screen during the exam.
              </p>
            </div>
          </motion.div>
        )}

        {/* Tabs + Exam List */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
          <div className="flex items-center gap-1 mb-4 p-1 bg-surface-2 rounded-xl w-fit">
            {(["all", "available", "upcoming", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all capitalize",
                  activeTab === tab
                    ? "bg-surface text-text-primary shadow-sm border border-white/6"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                {tab}
                {tab !== "all" && (
                  <span className={cn(
                    "ml-1.5 text-[10.5px] font-bold px-1.5 py-0.5 rounded-full",
                    tab === "available" ? "bg-success/15 text-success" :
                    tab === "upcoming"  ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-muted"
                  )}>
                    {tab === "available" ? available.length : tab === "upcoming" ? upcoming.length : completed.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {filteredExams.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-text-muted">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-[14px] font-medium">No {activeTab} exams</p>
                </div>
              ) : (
                filteredExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} onSelect={() => handleExamSelect(exam.id)} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </div>
  );
}
