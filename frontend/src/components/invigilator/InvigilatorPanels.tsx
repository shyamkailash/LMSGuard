"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { BellRing, CheckCircle2, Clock, KeyRound, Pause, Play, Search, ShieldCheck, Square, UserCheck, UserX } from "lucide-react";

import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/Providers/ToastProvider";
import { isFirebaseConfigured } from "@/firebase/config";
import { firestore } from "@/firebase/firestore";
import { collections } from "@/lib/proctoringSchema";
import { exams, students } from "@/mock/platform";

const ACTIVE_EXAM_START_PASSWORD_ID = "active";

function makePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, (_, index) => alphabet[(Date.now() + index * 11) % alphabet.length]).join("");
}

export function InvigilatorExamControlPanel() {
  const { notify } = useToast();
  const [examStatus, setExamStatus] = useState<"Waiting" | "Running" | "Paused" | "Stopped">("Waiting");
  const [startPassword, setStartPassword] = useState("");
  const [quitStudentId, setQuitStudentId] = useState(students[0]?.registerNumber ?? "");

  useEffect(() => {
    if (!isFirebaseConfigured() || !firestore) {
      return;
    }

    return onSnapshot(doc(firestore, collections.startPasswords, ACTIVE_EXAM_START_PASSWORD_ID), (snapshot) => {
      const data = snapshot.data() as { password?: string; status?: typeof examStatus } | undefined;
      if (data?.password) {
        setStartPassword(data.password);
      }
      if (data?.status) {
        setExamStatus(data.status);
      }
    });
  }, []);

  function studentQuitDocId(studentId: string) {
    return studentId.trim().toUpperCase().replaceAll("/", "-");
  }

  async function publishStartPassword(password: string, status: typeof examStatus = "Running") {
    if (!isFirebaseConfigured() || !firestore) {
      notify({ tone: "warning", title: "Firebase is not configured", body: "Students cannot receive the start password in real time." });
      return;
    }

    await setDoc(
      doc(firestore, collections.startPasswords, ACTIVE_EXAM_START_PASSWORD_ID),
      {
        password,
        status,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  function updateStatus(status: typeof examStatus) {
    setExamStatus(status);
    notify({ tone: "success", title: `Exam ${status.toLowerCase()}`, body: "Students receive this update through the live session channel." });
  }

  async function generateStartPassword() {
    const nextPassword = makePassword();
    setStartPassword(nextPassword);
    setExamStatus("Running");

    try {
      await publishStartPassword(nextPassword, "Running");
      notify({ tone: "info", title: "Start password published", body: `Students can now click Start Exam. Password: ${nextPassword}` });
    } catch (error) {
      notify({
        tone: "error",
        title: "Could not publish password",
        body: error instanceof Error ? error.message : "Check Firestore permissions and try again.",
      });
    }
  }

  async function approveStudentQuit() {
    const normalizedStudentId = quitStudentId.trim().toUpperCase();
    if (!normalizedStudentId) {
      notify({ tone: "error", title: "Select or enter a student ID first" });
      return;
    }

    if (!startPassword) {
      notify({ tone: "error", title: "Generate the start password first", body: "Quit approvals are linked to the current exam session." });
      return;
    }

    if (!isFirebaseConfigured() || !firestore) {
      notify({ tone: "warning", title: "Firebase is not configured", body: "Student quit approval cannot sync in real time." });
      return;
    }

    try {
      await setDoc(
        doc(firestore, collections.quitPasswords, studentQuitDocId(normalizedStudentId)),
        {
          studentId: normalizedStudentId,
          sessionPassword: startPassword,
          status: "Approved",
          approvedAt: serverTimestamp(),
        },
        { merge: true },
      );

      notify({ tone: "success", title: "Student quit approved", body: `${normalizedStudentId} will be removed from the exam automatically.` });
    } catch (error) {
      notify({
        tone: "error",
        title: "Could not approve quit",
        body: error instanceof Error ? error.message : "Check Firestore permissions and try again.",
      });
    }
  }

  return (
    <section className="aurora-card p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-cyan-200">Exam control</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Start, pause, resume, lock, and notify</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Invigilator actions are modeled for Firestore sync so waiting rooms and active sessions react instantly.
          </p>
        </div>
        <StatusBadge tone={examStatus === "Running" ? "online" : examStatus === "Paused" ? "warning" : "neutral"}>
          {examStatus}
        </StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Button onClick={() => updateStatus("Running")} className="bg-emerald-500 hover:bg-emerald-400"><Play className="size-4" /> Start exam</Button>
        <Button variant="outline" onClick={() => updateStatus("Paused")}><Pause className="size-4" /> Pause</Button>
        <Button variant="outline" onClick={() => updateStatus("Running")}><Play className="size-4" /> Resume</Button>
        <Button variant="outline" onClick={() => updateStatus("Stopped")}><Square className="size-4" /> Stop</Button>
        <Button variant="outline" onClick={generateStartPassword}><KeyRound className="size-4" /> Start password</Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
          <p className="text-xs text-zinc-500">Start password</p>
          <p className="mt-2 text-2xl font-semibold tracking-[0.28em] text-zinc-50">{startPassword || "------"}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
          <p className="text-xs text-zinc-500">Waiting students</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">42</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
          <p className="text-xs text-zinc-500">Live notifications</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-100"><BellRing className="size-4 text-cyan-200" /> Ready</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.035] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="block min-w-0 flex-1">
            <span className="text-sm text-zinc-400">Student ID to quit</span>
            <input
              list="quit-student-ids"
              value={quitStudentId}
              onChange={(event) => setQuitStudentId(event.target.value)}
              className="aurora-input mt-2"
            />
            <datalist id="quit-student-ids">
              {students.slice(0, 30).map((student) => (
                <option key={student.id} value={student.registerNumber}>
                  {student.name}
                </option>
              ))}
            </datalist>
          </label>
          <Button type="button" variant="outline" onClick={approveStudentQuit}>
            <UserX className="size-4" />
            Quit student
          </Button>
        </div>
      </div>
    </section>
  );
}

export function InvigilatorAttendancePanel() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const departments = ["All", ...Array.from(new Set(students.map((student) => student.department)))];

  const visibleStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students
      .filter((student) => department === "All" || student.department === department)
      .filter((student) => `${student.name} ${student.registerNumber}`.toLowerCase().includes(normalized))
      .slice(0, 10);
  }, [department, query]);

  const totals = [
    ["Present", 168, UserCheck, "online"],
    ["Waiting", 42, Clock, "review"],
    ["Disconnected", 7, UserX, "warning"],
    ["Completed", 51, CheckCircle2, "neutral"],
  ] as const;

  return (
    <section className="aurora-card p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-medium text-violet-200">Attendance</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Real-time attendance panel</h2>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
            <Search className="size-4 text-zinc-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500" placeholder="Search student" />
          </div>
          <select value={department} onChange={(event) => setDepartment(event.target.value)} className="aurora-input md:w-40">
            {departments.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {totals.map(([label, value, Icon, tone]) => (
          <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
            <Icon className="size-5 text-cyan-200" />
            <p className="mt-3 text-2xl font-semibold text-zinc-50">{value}</p>
            <StatusBadge tone={tone}>{label}</StatusBadge>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {visibleStudents.map((student) => (
          <div key={student.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
            <p className="truncate text-sm font-medium text-zinc-100">{student.name}</p>
            <p className="mt-1 text-xs text-zinc-500">{student.registerNumber}</p>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge tone={student.connection > 82 ? "online" : "warning"}>{student.connection > 82 ? "Joined" : "Waiting"}</StatusBadge>
              <RiskBadge score={student.riskScore} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompletedStudentsQueue() {
  const { notify } = useToast();
  const completed = students.filter((_, index) => index % 9 === 0).slice(0, 6);

  return (
    <section className="aurora-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-200">Exit approval</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Completed students queue</h2>
        </div>
        <ShieldCheck className="size-5 text-emerald-200" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {completed.map((student) => (
          <article key={student.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
            <p className="font-medium text-zinc-100">{student.name}</p>
            <p className="mt-1 text-xs text-zinc-500">{student.registerNumber}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <RiskBadge score={student.riskScore} />
              <Button
                size="sm"
                variant="outline"
                onClick={() => notify({ tone: "success", title: "Student exit approved", body: `${student.name} session closed independently.` })}
              >
                Approve exit
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InvigilatorExamList({ mode = "assigned" }: { mode?: "today" | "running" | "assigned" }) {
  const filtered = exams.filter((exam) => mode !== "running" || exam.status === "Live");
  return (
    <section className="aurora-card p-6">
      <h2 className="text-2xl font-semibold text-zinc-50">
        {mode === "today" ? "Today's exams" : mode === "running" ? "Running exams" : "Assigned exams"}
      </h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((exam) => (
          <article key={exam.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
            <StatusBadge tone={exam.status === "Live" ? "online" : exam.status === "Review" ? "review" : "neutral"}>{exam.status}</StatusBadge>
            <p className="mt-4 font-medium text-zinc-100">{exam.title}</p>
            <p className="mt-1 text-sm text-zinc-500">{exam.students} students | {exam.department}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
