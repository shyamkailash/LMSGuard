"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardCheck,
  Expand,
  Filter,
  Grid3X3,
  Keyboard,
  MousePointer2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { StudentCard } from "@/components/cards/StudentCard";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import type { StudentMonitor } from "@/mock/platform";
import { students } from "@/mock/platform";

const riskOptions = ["all", "elevated", "stable"] as const;

export function MonitoringWorkspace() {
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<(typeof riskOptions)[number]>("all");
  const [selected, setSelected] = useState<StudentMonitor | null>(students[1]);

  const visibleStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students
      .filter((student) => {
        const matchesQuery =
          !normalized ||
          `${student.name} ${student.registerNumber} ${student.department} ${student.exam}`.toLowerCase().includes(normalized);
        const matchesRisk =
          riskFilter === "all" ||
          (riskFilter === "elevated" ? student.riskScore >= 66 : student.riskScore < 66);
        return matchesQuery && matchesRisk;
      })
      .slice(0, 18);
  }, [query, riskFilter]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm text-violet-200">Live Monitoring</p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Student signal grid</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Live screenshots, application focus, connection quality, and AI risk status in one calm operational surface.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Filter className="size-4" /> Filters</Button>
          <Button variant="outline"><Grid3X3 className="size-4" /> Grid</Button>
          <Button variant="outline"><RefreshCw className="size-4" /> Refresh</Button>
          <Button className="bg-violet-500 hover:bg-violet-400"><Expand className="size-4" /> Fullscreen</Button>
        </div>
      </section>

      <div className="aurora-panel flex flex-col gap-3 rounded-3xl p-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
          <Search className="size-4 text-zinc-500" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
            placeholder="Search by name, register number, department, exam"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {riskOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRiskFilter(option)}
              className={`rounded-2xl px-3 py-2 text-sm capitalize transition ${
                riskFilter === option
                  ? "bg-violet-400/15 text-violet-100 ring-1 ring-violet-300/20"
                  : "text-zinc-500 hover:bg-white/[0.055] hover:text-zinc-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <StatusBadge tone="online">{visibleStudents.length} visible</StatusBadge>
      </div>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {visibleStudents.map((student, index) => (
          <StudentCard key={student.id} student={student} index={index} onView={setSelected} />
        ))}
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.aside
            className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="aurora-panel ml-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-[2rem]"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/8 p-5">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-50">{selected.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{selected.registerNumber} | {selected.exam}</p>
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge score={selected.riskScore} />
                  <Button variant="ghost" size="icon" aria-label="Close drawer" onClick={() => setSelected(null)}>
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                  <div className="aspect-video rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgb(124_58_237/0.22),transparent_13rem),#101018] p-4">
                    <div className="h-full rounded-2xl border border-white/8 bg-white/[0.025]" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-4">
                    {[
                      [Keyboard, "Keyboard", "Normal"],
                      [MousePointer2, "Mouse", "High travel"],
                      [ClipboardCheck, "Clipboard", "Blocked"],
                      [RefreshCw, "Network", `${selected.connection}%`],
                    ].map(([Icon, label, value]) => {
                      const TileIcon = Icon as typeof Keyboard;
                      return (
                        <div key={label as string} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                          <TileIcon className="size-4 text-violet-200" />
                          <p className="mt-3 text-xs text-zinc-500">{label as string}</p>
                          <p className="mt-1 text-sm font-medium text-zinc-100">{value as string}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <h3 className="font-semibold text-zinc-50">AI analysis</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      The student shows {selected.aiStatus.toLowerCase()} risk posture. Current application focus is {selected.currentApplication}, with {selected.violations} policy events in this session.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <h3 className="font-semibold text-zinc-50">Violation history</h3>
                    <div className="mt-4 space-y-3">
                      {["Window focus changed", "Application policy recovered", "Identity confidence refreshed"].map((event, index) => (
                        <div key={event} className="rounded-2xl border border-white/8 bg-black/15 p-3">
                          <p className="text-sm text-zinc-200">{event}</p>
                          <p className="mt-1 text-xs text-zinc-500">{index * 4 + 2} min ago</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
