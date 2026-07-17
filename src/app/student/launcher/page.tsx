"use client";

import { useState } from "react";
import { PlayCircle, ShieldCheck, Wifi, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentLauncherPage() {
  const router = useRouter();
  const [examId] = useState("EX001");
  const [rollNumber] = useState("student1");

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-3xl font-semibold">LMSGuard Student Agent</h1>
        <p className="mt-3 max-w-xl text-center text-sm text-slate-400">
          Launch Safe Exam Browser from this simple student portal. No monitoring dashboard or teacher controls are shown here.
        </p>

        <div className="mt-8 grid w-full gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400"><ShieldCheck size={16} className="text-emerald-400" /> Agent Status</div>
            <p className="mt-2 text-lg font-semibold text-white">Ready</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400"><BookOpen size={16} className="text-blue-400" /> Exam ID</div>
            <p className="mt-2 text-lg font-semibold text-white">{examId}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400"><Wifi size={16} className="text-violet-400" /> Connection Status</div>
            <p className="mt-2 text-lg font-semibold text-white">Online</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-sm text-slate-400">
          <p><span className="font-semibold text-white">Roll Number:</span> {rollNumber}</p>
        </div>

        <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500" onClick={() => router.push(`/seb/gateway?exam_id=${examId}&roll_number=${rollNumber}`)}>
          <PlayCircle size={18} /> Launch Safe Exam Browser
        </button>
      </div>
    </div>
  );
}
