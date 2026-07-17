"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, ChevronLeft, AlertTriangle, Clock, CheckCircle2,
  XCircle, Eye, Search, Filter,
} from "lucide-react";
import { MOCK_STUDENT_VIOLATIONS } from "@/data/studentData";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function StudentViolationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "recorded" | "reviewed" | "dismissed">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_STUDENT_VIOLATIONS.filter((v) => {
    const matchFilter = filter === "all" || v.status === filter;
    const matchSearch =
      v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.examTitle.toLowerCase().includes(search.toLowerCase()) ||
      v.detail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const severityConfig = {
    low:      { variant: "muted"   as const, color: "text-text-muted",  bg: "bg-surface-3"    },
    medium:   { variant: "warning" as const, color: "text-warning",     bg: "bg-warning/10"   },
    high:     { variant: "danger"  as const, color: "text-danger",      bg: "bg-danger/10"    },
    critical: { variant: "danger"  as const, color: "text-danger",      bg: "bg-danger/10"    },
  };

  const statusConfig = {
    recorded: { icon: AlertTriangle, label: "Recorded", color: "text-warning" },
    reviewed: { icon: Eye,           label: "Reviewed", color: "text-primary" },
    dismissed: { icon: CheckCircle2, label: "Dismissed", color: "text-success" },
  };

  const stats = {
    total:     MOCK_STUDENT_VIOLATIONS.length,
    recorded:  MOCK_STUDENT_VIOLATIONS.filter((v) => v.status === "recorded").length,
    reviewed:  MOCK_STUDENT_VIOLATIONS.filter((v) => v.status === "reviewed").length,
    dismissed: MOCK_STUDENT_VIOLATIONS.filter((v) => v.status === "dismissed").length,
  };

  return (
    <div className="min-h-screen bg-background mesh-bg">
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 h-[52px] flex items-center gap-3">
          <button onClick={() => router.back()} className="icon-btn">
            <ChevronLeft className="w-4 h-4 text-text-muted" />
          </button>
          <div className="w-px h-4 bg-white/8" />
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13.5px] font-bold text-text-primary">Violation History</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-7 space-y-5">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="grid grid-cols-4 gap-3"
        >
          {[
            { label: "Total",     value: stats.total,     color: "text-text-primary", bg: "bg-surface-2 border-white/6"  },
            { label: "Recorded",  value: stats.recorded,  color: "text-warning",      bg: "bg-warning/8 border-warning/15" },
            { label: "Reviewed",  value: stats.reviewed,  color: "text-primary",      bg: "bg-primary/8 border-primary/15" },
            { label: "Dismissed", value: stats.dismissed, color: "text-success",      bg: "bg-success/8 border-success/15" },
          ].map((s) => (
            <div key={s.label} className={cn("flex flex-col gap-1 p-3.5 rounded-xl border", s.bg)}>
              <span className={cn("text-[22px] font-bold font-feature", s.color)}>{s.value}</span>
              <span className="text-[11.5px] text-text-muted">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search violations…"
              className="input-premium pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl">
            {(["all", "recorded", "reviewed", "dismissed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11.5px] font-medium transition-all capitalize",
                  filter === f
                    ? "bg-surface text-text-primary border border-white/6"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}
          className="card overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 bg-surface-2/40">
            {["Violation Type", "Exam", "Time", "Risk", "Status"].map((h) => (
              <span key={h} className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-success/40" />
              <p className="text-[13px] text-text-muted">No violations found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {filtered.map((v, idx) => {
                const sev    = severityConfig[v.severity];
                const status = statusConfig[v.status];
                const SIcon  = status.icon;

                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 hover:bg-surface-2/30 transition-colors items-center"
                  >
                    {/* Type */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", sev.bg)}>
                        <AlertTriangle className={cn("w-3.5 h-3.5", sev.color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-medium text-text-primary truncate">{v.type}</p>
                        <p className="text-[11px] text-text-muted truncate">{v.detail}</p>
                      </div>
                    </div>

                    {/* Exam */}
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-text-secondary truncate">{v.examTitle}</p>
                      <p className="text-[11px] text-text-muted">{v.date}</p>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-[11.5px] text-text-muted whitespace-nowrap">
                      <Clock className="w-3 h-3" />{v.time}
                    </div>

                    {/* Risk */}
                    <div className={cn("text-[12.5px] font-bold font-feature whitespace-nowrap", sev.color)}>
                      {v.risk}%
                    </div>

                    {/* Status */}
                    <Badge variant={v.status === "dismissed" ? "success" : v.status === "reviewed" ? "primary" : "warning"}>
                      <SIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20"
        >
          <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-text-secondary">
            All violations are automatically recorded by LMSGuard AI and reviewed by your invigilator.
            Dismissed violations have no impact on your exam score.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
