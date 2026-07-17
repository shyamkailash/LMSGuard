"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, ShieldAlert, Clock3 } from "lucide-react";

type GatewayState = "loading" | "allowed" | "blocked" | "invalid";

const reasonCopy: Record<string, string> = {
  AGENT_OFFLINE: "LMSGuard Monitoring Agent is not connected. Please start the agent and try again.",
  WAITING_FOR_INVIGILATOR: "Waiting for invigilator to start the exam.",
  NO_CONFIG: "Exam configuration is not ready. Contact invigilator.",
};

export default function SebGatewayPage() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam_id") ?? "";
  const rollNumber = searchParams.get("roll_number") ?? "";
  const [state, setState] = useState<GatewayState>("loading");
  const [message, setMessage] = useState("Checking access...");

  useEffect(() => {
    if (!examId || !rollNumber) {
      setState("invalid");
      setMessage("Invalid exam link.");
      return;
    }

    let cancelled = false;

    const verifyAccess = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/seb/gateway/status/${encodeURIComponent(examId)}/${encodeURIComponent(rollNumber)}`);
        if (!res.ok) {
          throw new Error(`Request failed with ${res.status}`);
        }

        const data = await res.json();
        if (cancelled) return;

        if (data.allowed) {
          setState("allowed");
          setMessage("Access verified. Redirecting to exam...");
          window.setTimeout(() => {
            if (data.moodle_quiz_url) {
              window.location.replace(data.moodle_quiz_url);
            }
          }, 1000);
          return;
        }

        const reason = data.reason ?? "NO_CONFIG";
        setState("blocked");
        setMessage(reasonCopy[reason] ?? "Exam configuration is not ready. Contact invigilator.");
      } catch (error) {
        if (cancelled) return;
        setState("blocked");
        setMessage("Unable to verify access right now. Please try again in a moment.");
        console.error(error);
      }
    };

    verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [examId, rollNumber]);

  const renderCard = () => {
    if (state === "allowed") {
      return (
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Access verified</h1>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      );
    }

    if (state === "invalid") {
      return (
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <AlertCircle size={30} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Invalid exam link</h1>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      );
    }

    if (state === "blocked") {
      return (
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <ShieldAlert size={30} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Access blocked</h1>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <Clock3 size={30} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Preparing your exam access</h1>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {renderCard()}
      </div>
    </main>
  );
}
