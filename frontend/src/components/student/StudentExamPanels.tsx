"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Bell, CheckCircle2, Code2, KeyRound, Play, Timer } from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { isFirebaseConfigured } from "@/firebase/config";
import { firestore } from "@/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { collections } from "@/lib/proctoringSchema";
import { exams } from "@/mock/platform";

const ACTIVE_EXAM_START_PASSWORD_ID = "active";

function studentQuitDocId(value: string) {
  return value.trim().toUpperCase().replaceAll("/", "-");
}

const quizzes = [
  { name: "Distributed Systems Quiz", subject: "CSE", duration: "45 min", questions: 30, marks: 60, status: "Ready" },
  { name: "Cloud Security Quiz", subject: "IT", duration: "30 min", questions: 20, marks: 40, status: "Upcoming" },
];

const codingTests = [
  { title: "Graph Traversal Lab", language: "Python / C++ / Java", time: "60 min", marks: 100, status: "Ready" },
  { title: "API Validation Task", language: "JavaScript", time: "45 min", marks: 80, status: "Upcoming" },
];

export function StudentWaitingRoomPanel() {
  const { userProfile } = useAuth();
  const [started, setStarted] = useState(false);
  const [password, setPassword] = useState("");
  const [publishedPassword, setPublishedPassword] = useState("");
  const [examEntered, setExamEntered] = useState(false);
  const [quitApproved, setQuitApproved] = useState(false);
  const studentId = userProfile?.managedId || userProfile?.studentID || userProfile?.registerNumber || "";
  const canStartExam = started && Boolean(publishedPassword) && password.trim().toUpperCase() === publishedPassword;

  useEffect(() => {
    if (!isFirebaseConfigured() || !firestore) {
      return;
    }

    return onSnapshot(doc(firestore, collections.startPasswords, ACTIVE_EXAM_START_PASSWORD_ID), (snapshot) => {
      const data = snapshot.data() as { password?: string; status?: string } | undefined;
      const nextPassword = String(data?.password ?? "").trim().toUpperCase();
      const isRunning = data?.status === "Running" && Boolean(nextPassword);

      setStarted(isRunning);
      setPublishedPassword(isRunning ? nextPassword : "");
      setPassword(isRunning ? nextPassword : "");
      setExamEntered(false);
      setQuitApproved(false);
    });
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !firestore || !studentId) {
      return;
    }

    return onSnapshot(doc(firestore, collections.quitPasswords, studentQuitDocId(studentId)), (snapshot) => {
      const data = snapshot.data() as { sessionPassword?: string; status?: string } | undefined;
      const approvedForCurrentSession = data?.sessionPassword && data.sessionPassword === publishedPassword;
      if (data?.status === "Approved" && approvedForCurrentSession) {
        setQuitApproved(true);
        setExamEntered(false);
        setStarted(false);
        setPublishedPassword("");
        setPassword("");
      }
    });
  }, [publishedPassword, studentId]);

  return (
    <section className="aurora-card p-6">
      <StatusBadge tone={quitApproved ? "online" : examEntered ? "online" : started ? "review" : "neutral"}>
        {quitApproved ? "Exam closed" : examEntered ? "Exam opened" : started ? "Password received" : "Waiting room"}
      </StatusBadge>
      <h2 className="mt-4 text-2xl font-semibold text-zinc-50">
        {quitApproved ? "You have been released from the exam." : examEntered ? "Your examination is open." : started ? "Your examination is ready." : "Waiting for Invigilator"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        {quitApproved
          ? "The invigilator approved your quit request. Your active exam session is now closed."
          : examEntered
            ? "You can continue into the active exam workspace."
            : started
              ? "The invigilator has published the start password. It has been applied automatically; click Start Exam."
              : "Please wait until the invigilator starts the examination. Keep your camera on and do not refresh."}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-sm text-zinc-400">Start password</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
            <KeyRound className="size-4 text-zinc-500" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value.toUpperCase())}
              className="min-w-0 flex-1 bg-transparent text-sm uppercase tracking-[0.24em] text-zinc-100 outline-none"
              readOnly={started}
            />
          </div>
        </label>
        <div className="flex items-end gap-2">
          <Button
            disabled={!canStartExam}
            onClick={() => setExamEntered(true)}
            className="bg-emerald-500 hover:bg-emerald-400"
          >
            <Play className="size-4" /> Start Exam
          </Button>
        </div>
      </div>
    </section>
  );
}

export function StudentQuizPanel() {
  return (
    <section className="aurora-card p-6">
      <h2 className="text-2xl font-semibold text-zinc-50">Assigned quizzes</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <article key={quiz.name} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
            <StatusBadge tone={quiz.status === "Ready" ? "online" : "neutral"}>{quiz.status}</StatusBadge>
            <p className="mt-4 font-medium text-zinc-100">{quiz.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{quiz.subject} | {quiz.duration} | {quiz.questions} questions | {quiz.marks} marks</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-400" disabled={quiz.status !== "Ready"}>Start Quiz</Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudentCodingPanel() {
  return (
    <section className="aurora-card p-6">
      <h2 className="text-2xl font-semibold text-zinc-50">Coding tests</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {codingTests.map((test) => (
          <article key={test.title} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
            <Code2 className="size-5 text-cyan-200" />
            <p className="mt-4 font-medium text-zinc-100">{test.title}</p>
            <p className="mt-1 text-sm text-zinc-500">{test.language} | {test.time} | {test.marks} marks</p>
            <div className="mt-4 rounded-2xl bg-slate-950/70 p-3 font-mono text-xs text-cyan-100">
              Monaco editor workspace: Run Code | Submit Code | Sample Tests | Hidden Tests
            </div>
            <Button className="mt-4 bg-violet-500 hover:bg-violet-400" disabled={test.status !== "Ready"}>Start Coding Test</Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudentExamSummary({ mode = "upcoming" }: { mode?: "upcoming" | "completed" | "results" }) {
  const visible = useMemo(() => exams.slice(0, mode === "upcoming" ? 3 : 4), [mode]);
  return (
    <section className="aurora-card p-6">
      <h2 className="text-2xl font-semibold text-zinc-50">
        {mode === "upcoming" ? "Upcoming exams" : mode === "completed" ? "Completed exams" : "Latest results"}
      </h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {visible.map((exam, index) => (
          <article key={exam.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
            {mode === "results" ? <CheckCircle2 className="size-5 text-emerald-200" /> : <Timer className="size-5 text-cyan-200" />}
            <p className="mt-4 font-medium text-zinc-100">{exam.title}</p>
            <p className="mt-1 text-sm text-zinc-500">{mode === "results" ? `${82 - index * 4}% score` : exam.startsAt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudentNotificationsPanel() {
  return (
    <section className="aurora-card p-6">
      <h2 className="text-2xl font-semibold text-zinc-50">Notifications</h2>
      <div className="mt-5 space-y-3">
        {["Please keep your camera on.", "Waiting room opens 15 minutes before the exam.", "Your latest result is ready."].map((message) => (
          <div key={message} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3 text-sm text-zinc-300">
            <Bell className="mt-0.5 size-4 text-cyan-200" />
            {message}
          </div>
        ))}
      </div>
    </section>
  );
}
