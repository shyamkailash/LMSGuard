"use client";

import { useMemo, useState } from "react";
import { Filter, Search, UserRoundCheck } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { students } from "@/mock/platform";

type ProfileAssignment = {
  exam: string;
  invigilator: string;
};

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [profileAssignments, setProfileAssignments] = useState<Record<string, ProfileAssignment>>({});

  function updateProfileAssignment(studentId: string, key: keyof ProfileAssignment, value: string) {
    setProfileAssignments((items) => ({
      ...items,
      [studentId]: {
        exam: items[studentId]?.exam ?? "",
        invigilator: items[studentId]?.invigilator ?? "",
        [key]: value,
      },
    }));
  }

  const visibleStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students
      .filter((student) => {
        const assignment = profileAssignments[student.id];
        const matchesQuery =
          !normalized ||
          `${student.name} ${student.registerNumber} ${student.department} ${assignment?.exam ?? ""} ${assignment?.invigilator ?? ""}`.toLowerCase().includes(normalized);
        const matchesRisk = !highRiskOnly || student.riskScore >= 66;
        return matchesQuery && matchesRisk;
      })
      .slice(0, 12);
  }, [highRiskOnly, profileAssignments, query]);

  return (
    <MainLayout allowedRoles={["Admin", "Invigilator"]}>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-cyan-200">Students</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Student integrity profiles</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Search, filter, and review student risk, exam history, and recent monitoring status.</p>
          </div>
          <Button asChild className="bg-blue-500 hover:bg-blue-400">
            <a href="/active-exams#assignments"><UserRoundCheck className="size-4" /> Assign students</a>
          </Button>
        </section>

        <section className="aurora-panel rounded-[2rem] p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
              <Search className="size-4 text-zinc-500" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
                placeholder="Search students, register numbers, departments"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Button variant={highRiskOnly ? "default" : "outline"} onClick={() => setHighRiskOnly((value) => !value)}>
              <Filter className="size-4" /> High risk
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleStudents.map((student) => (
              <article key={student.id} className="aurora-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-zinc-50">{student.name}</h2>
                    <p className="mt-1 text-xs text-zinc-500">{student.registerNumber} | {student.department}</p>
                  </div>
                  <RiskBadge score={student.riskScore} />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/[0.04] p-3">
                    <p className="text-xs text-zinc-500">Exam</p>
                    <input
                      aria-label={`Exam for ${student.name}`}
                      className="mt-2 h-9 w-full rounded-xl border border-white/8 bg-white/[0.045] px-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/35 focus:ring-4 focus:ring-cyan-500/10"
                      value={profileAssignments[student.id]?.exam ?? ""}
                      onChange={(event) => updateProfileAssignment(student.id, "exam", event.target.value)}
                    />
                  </div>
                  <div className="rounded-2xl bg-white/[0.04] p-3">
                    <p className="text-xs text-zinc-500">Invigilator</p>
                    <input
                      aria-label={`Invigilator for ${student.name}`}
                      className="mt-2 h-9 w-full rounded-xl border border-white/8 bg-white/[0.045] px-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-300/35 focus:ring-4 focus:ring-cyan-500/10"
                      value={profileAssignments[student.id]?.invigilator ?? ""}
                      onChange={(event) => updateProfileAssignment(student.id, "invigilator", event.target.value)}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500">Violations: {student.violations}</p>
                <div className="mt-5 flex items-center justify-between">
                  <StatusBadge tone={student.aiStatus === "Elevated" ? "warning" : student.aiStatus === "Reviewing" ? "review" : "online"}>
                    {student.aiStatus}
                  </StatusBadge>
                  <Button asChild variant="ghost" size="sm">
                    <a href={`/live-monitoring/${student.id}`}>Open profile</a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {visibleStudents.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-8 text-center text-sm text-zinc-500">
              No students match your search.
            </div>
          ) : null}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-zinc-500">
            <span>Showing {visibleStudents.length} of {students.length} students</span>
            <span>Page 1 / 17</span>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
