"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button } from "@/components/ui";
import {
  Search, Clock, BookOpen, Users, Calendar,
  ChevronRight, Filter, Play, Shield,
} from "lucide-react";
import { AVAILABLE_EXAMS_LIST } from "@/mock/exams";
import { AVAILABLE_CLASSES_LIST } from "@/mock/invigilators";
import { cn } from "@/lib/utils";
import type { AvailableExam } from "@/types";

const STATUS_CFG = {
  active:    { variant: "success" as const, label: "Active Now"  },
  scheduled: { variant: "primary" as const, label: "Scheduled"  },
  completed: { variant: "muted"   as const, label: "Completed"  },
  upcoming:  { variant: "primary" as const, label: "Upcoming"   },
  paused:    { variant: "warning" as const, label: "Paused"     },
  ended:     { variant: "muted"   as const, label: "Ended"      },
};

function ExamCard({ exam, onSelect }: { exam: AvailableExam; onSelect: () => void }) {
  const cfg    = STATUS_CFG[exam.status ?? "scheduled"] ?? STATUS_CFG.scheduled;
  const active = exam.status === "active";
  const eligible = AVAILABLE_CLASSES_LIST.filter((c) => exam.eligibleClasses.includes(c.id));

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "card p-5 transition-all duration-200 cursor-pointer",
        active ? "hover:border-success/30" : "hover:border-primary/25"
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            active ? "bg-success/10" : "bg-primary/10"
          )}>
            <BookOpen className={cn("w-4.5 h-4.5", active ? "text-success" : "text-primary")} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-text-primary truncate leading-snug">
              {exam.title}
            </p>
            <p className="text-[12px] text-text-muted mt-0.5">{exam.code} · {exam.subject}</p>
          </div>
        </div>
        <Badge variant={cfg.variant} dot className="shrink-0">{cfg.label}</Badge>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 py-3.5 border-y border-white/5 text-[12px] text-text-muted">
        {[
          { icon: Calendar, label: exam.date                        },
          { icon: Clock,    label: `${exam.startTime} – ${exam.endTime}` },
          { icon: Clock,    label: `${exam.duration} min`           },
          { icon: BookOpen, label: `${exam.totalQuestions} questions` },
          { icon: Users,    label: `${exam.eligibleClasses.length} classes` },
          { icon: Shield,   label: `${exam.passingMarks} to pass`   },
        ].map((item, i) => {
          const I = item.icon;
          return (
            <div key={i} className="flex items-center gap-1.5">
              <I className="w-3 h-3 shrink-0 text-text-subtle" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Classes */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {eligible.slice(0, 3).map((c) => (
            <span key={c.id} className="badge badge-muted text-[10.5px]">{c.id}</span>
          ))}
          {eligible.length > 3 && (
            <span className="badge badge-muted text-[10.5px]">+{eligible.length - 3}</span>
          )}
        </div>
        <Button
          variant={active ? "success" : "primary"}
          size="sm"
          iconRight={<ChevronRight className="w-3.5 h-3.5" />}
        >
          {active ? "Monitor" : "Select"}
        </Button>
      </div>
    </motion.div>
  );
}

export default function InvigilatorExamsPage() {
  const router   = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = AVAILABLE_EXAMS_LIST.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || (e.status ?? "scheduled") === status;
    return matchSearch && matchStatus;
  });

  const activeExams    = AVAILABLE_EXAMS_LIST.filter((e) => e.status === "active");
  const scheduledExams = AVAILABLE_EXAMS_LIST.filter((e) => e.status === "scheduled");

  const handleSelectExam = (exam: AvailableExam) => {
    sessionStorage.setItem("invSelectedExam", JSON.stringify(exam));
    router.push("/invigilator/classes");
  };

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Assigned Exams"
          description="Select an exam to start or monitor a session"
          actions={
            <Button
              variant="primary"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={() => router.push("/invigilator/classes")}
            >
              Quick Start
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Assigned", value: AVAILABLE_EXAMS_LIST.length, color: "text-text-primary", bg: "bg-surface-2 border-white/6"    },
            { label: "Active Now",     value: activeExams.length,           color: "text-success",      bg: "bg-success/8 border-success/15" },
            { label: "Scheduled",      value: scheduledExams.length,        color: "text-primary",      bg: "bg-primary/8 border-primary/15" },
          ].map((s) => (
            <div key={s.label} className={cn("flex items-center justify-between px-5 py-4 rounded-2xl border", s.bg)}>
              <span className="text-[13px] text-text-muted">{s.label}</span>
              <span className={cn("text-[28px] font-bold font-feature", s.color)}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams…"
              className="input-premium pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl border border-white/5">
            {["all", "active", "scheduled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-all",
                  status === s
                    ? "bg-surface text-text-primary border border-white/6 shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="icon-btn">
            <Filter className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>

        {/* Exam Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((exam) => (
            <motion.div
              key={exam.id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
            >
              <ExamCard exam={exam} onSelect={() => handleSelectExam(exam)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppShell>
  );
}
