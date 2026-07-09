"use client";

import { useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { CheckCircle2, Search, UserRoundCog, UsersRound } from "lucide-react";

import { useToast } from "@/Providers/ToastProvider";
import { useAuth } from "@/hooks/useAuth";
import { isFirebaseConfigured } from "@/firebase/config";
import { firestore } from "@/firebase/firestore";
import { Button } from "@/components/ui/button";
import { students } from "@/mock/platform";

function toAssignmentId(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `exam-${Date.now()}`;
}

export function ExamAssignmentPanel() {
  const { userProfile } = useAuth();
  const { notify } = useToast();
  const [examTitle, setExamTitle] = useState("");
  const [invigilatorName, setInvigilatorName] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>(
    students.slice(0, 8).map((student) => student.id),
  );
  const [saving, setSaving] = useState(false);

  const canAssign = userProfile?.role === "Admin";

  const visibleStudents = useMemo(() => {
    const normalized = studentQuery.trim().toLowerCase();
    return students
      .filter((student) =>
        `${student.name} ${student.registerNumber} ${student.department}`.toLowerCase().includes(normalized),
      )
      .slice(0, 10);
  }, [studentQuery]);

  function toggleStudent(studentId: string) {
    setAssignedStudentIds((items) =>
      items.includes(studentId)
        ? items.filter((item) => item !== studentId)
        : [...items, studentId],
    );
  }

  async function saveAssignment() {
    const trimmedExamTitle = examTitle.trim();
    const trimmedInvigilatorName = invigilatorName.trim();

    if (!trimmedExamTitle) {
      notify({ tone: "error", title: "Enter an exam name first" });
      return;
    }

    if (!trimmedInvigilatorName) {
      notify({ tone: "error", title: "Enter an invigilator name or ID" });
      return;
    }

    setSaving(true);
    try {
      const assignmentId = toAssignmentId(trimmedExamTitle);
      const payload = {
        examId: assignmentId,
        examTitle: trimmedExamTitle,
        invigilatorName: trimmedInvigilatorName,
        studentIds: assignedStudentIds,
        department: "",
        startsAt: "",
        status: "assigned",
        updatedBy: userProfile?.uid ?? null,
        updatedAt: serverTimestamp(),
      };

      if (isFirebaseConfigured() && firestore) {
        await setDoc(doc(firestore, "examAssignments", assignmentId), payload, { merge: true });
      }

      notify({
        tone: "success",
        title: isFirebaseConfigured() ? "Exam assignment saved" : "Assignment staged locally",
        body: `${trimmedInvigilatorName} assigned with ${assignedStudentIds.length} students for ${trimmedExamTitle}.`,
      });
    } catch (error) {
      notify({
        tone: "error",
        title: "Assignment save failed",
        body: error instanceof Error ? error.message : "Check Firestore rules and Firebase configuration.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="aurora-card p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-cyan-200">Admin assignment desk</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Assign students and invigilators</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Type the exam name, type the invigilator name or ID, then choose the students allowed into that exam.
          </p>
        </div>
        <Button disabled={!canAssign || saving} onClick={saveAssignment} className="bg-blue-500 hover:bg-blue-400">
          <CheckCircle2 className="size-4" />
          {saving ? "Saving..." : "Save assignment"}
        </Button>
      </div>

      {!canAssign ? (
        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          Only Admin accounts can assign students and invigilators.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_0.8fr_1.4fr]">
        <label className="block">
          <span className="text-sm text-zinc-400">Exam</span>
          <input
            value={examTitle}
            onChange={(event) => setExamTitle(event.target.value)}
            disabled={!canAssign}
            className="aurora-input mt-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400">Invigilator name or ID</span>
          <input
            value={invigilatorName}
            onChange={(event) => setInvigilatorName(event.target.value)}
            disabled={!canAssign}
            className="aurora-input mt-2"
          />
        </label>

        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <UserRoundCog className="size-4 text-cyan-200" />
              Current assignment
            </div>
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
              {assignedStudentIds.length} students
            </span>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-3">
            <span>{examTitle || "No exam typed"}</span>
            <span>{invigilatorName || "No invigilator typed"}</span>
            <span>{assignedStudentIds.length} selected</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.035] p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
            <UsersRound className="size-4 text-violet-200" />
            Student roster
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 md:w-80">
            <Search className="size-4 text-zinc-500" />
            <input
              value={studentQuery}
              onChange={(event) => setStudentQuery(event.target.value)}
              disabled={!canAssign}
              className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
              placeholder="Search student ID, name, department"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {visibleStudents.map((student) => {
            const assigned = assignedStudentIds.includes(student.id);
            return (
              <button
                key={student.id}
                type="button"
                disabled={!canAssign}
                onClick={() => toggleStudent(student.id)}
                className={`rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  assigned
                    ? "border-cyan-300/35 bg-cyan-400/10"
                    : "border-white/8 bg-white/[0.035] hover:border-cyan-300/25"
                }`}
              >
                <p className="truncate text-sm font-medium text-zinc-100">{student.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{student.registerNumber}</p>
                <p className="mt-2 text-xs text-zinc-400">{assigned ? "Assigned" : "Not assigned"}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
