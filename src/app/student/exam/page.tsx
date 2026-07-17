"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ASSESSMENTS, EXAM_QUESTIONS } from "@/data/studentData";
import { cn } from "@/lib/utils";
import {
  Shield, Clock, ChevronLeft, ChevronRight,
  CheckCircle2, AlertTriangle, Flag, Send,
  Circle, CheckCircle, Wifi, Monitor, Camera, Activity,
} from "lucide-react";

type QStatus = "unanswered" | "answered" | "flagged";

function StatusBar() {
  const [networkOk,  setNetworkOk]  = useState(true);
  const [cameraOk,   setCameraOk]   = useState(true);
  const [idle,       setIdle]       = useState(false);
  const [clipboard,  setClipboard]  = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setNetworkOk(Math.random() > 0.08);
      setCameraOk(Math.random() > 0.05);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const items = [
    { icon: Wifi,     label: "Network",   ok: networkOk, okLabel: "Stable",       badLabel: "Weak"      },
    { icon: Camera,   label: "Camera",    ok: cameraOk,  okLabel: "Active",       badLabel: "Offline"   },
    { icon: Monitor,  label: "Screen",    ok: true,      okLabel: "Monitored",    badLabel: "Disabled"  },
    { icon: Activity, label: "Clipboard", ok: !clipboard, okLabel: "Blocked",     badLabel: "Active"    },
  ];

  return (
    <div className="hidden sm:flex items-center gap-3">
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
          <div key={item.label} className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-medium",
            item.ok ? "text-success/80" : "text-warning/80"
          )}>
            <ItemIcon className="w-3 h-3" />
            <span>{item.ok ? item.okLabel : item.badLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

function ExamContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const examId       = searchParams.get("id") ?? "EXAM001";
  const exam         = MOCK_ASSESSMENTS.find((e) => e.id === examId) ?? MOCK_ASSESSMENTS[0];
  const questions    = EXAM_QUESTIONS[examId] ?? EXAM_QUESTIONS["EXAM001"];

  const [timeLeft,    setTimeLeft]    = useState(exam.duration * 60);
  const [current,     setCurrent]     = useState(0);
  const [answers,     setAnswers]     = useState<Record<number, number>>({});
  const [statuses,    setStatuses]    = useState<Record<number, QStatus>>({});
  const [submitted,   setSubmitted]   = useState(false);
  const [showSubmit,  setShowSubmit]  = useState(false);

  /* Timer */
  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); setSubmitted(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [submitted]);

  /* Auto-redirect on submit */
  useEffect(() => {
    if (!submitted) return;
    const score = Object.entries(answers).filter(
      ([qi, ai]) => questions[Number(qi)]?.correct === ai
    ).length;
    const t = setTimeout(() => {
      router.push(`/student/completed?score=${score}&total=${questions.length}&exam=${encodeURIComponent(exam.title)}&examId=${examId}`);
    }, 200);
    return () => clearTimeout(t);
  }, [submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const mm  = Math.floor(timeLeft / 60);
  const ss  = timeLeft % 60;
  const tStr = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  const warn   = timeLeft < 300;
  const danger = timeLeft < 60;

  const selectAnswer = useCallback((qi: number, oi: number) => {
    setAnswers((p)  => ({ ...p, [qi]: oi }));
    setStatuses((p) => ({ ...p, [qi]: "answered" }));
  }, []);

  const toggleFlag = useCallback((qi: number) => {
    setStatuses((p) => ({
      ...p,
      [qi]: p[qi] === "flagged"
        ? answers[qi] !== undefined ? "answered" : "unanswered"
        : "flagged",
    }));
  }, [answers]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const q            = questions[current];
  const answered     = Object.keys(answers).length;
  const flagged      = Object.values(statuses).filter((s) => s === "flagged").length;
  const unanswered   = questions.length - answered;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-12 border-b border-white/5 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px] font-bold text-text-primary">LMSGuard</span>
          <div className="w-px h-3.5 bg-white/10" />
          <span className="text-[12px] text-text-muted truncate max-w-[200px]">{exam.title}</span>
          <span className="badge badge-danger text-[9px] px-1.5 py-0.5 animate-pulse">LIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <StatusBar />
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-lg border font-feature tabular-nums",
            danger ? "bg-danger/10 border-danger/25 text-danger" :
            warn   ? "bg-warning/10 border-warning/25 text-warning" :
            "bg-surface-2 border-white/6 text-text-secondary"
          )}>
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[13px] font-semibold">{tStr}</span>
          </div>
          <Badge variant={answered === questions.length ? "success" : "primary"}>
            {answered}/{questions.length}
          </Badge>
          <button onClick={() => setShowSubmit(true)} className="btn btn-primary text-[12px] py-1.5 px-3 gap-1">
            <Send className="w-3.5 h-3.5" /> Submit
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-muted">
                Q{current + 1} <span className="text-text-subtle">of</span> {questions.length}
              </span>
              <div className="flex items-center gap-2">
                {statuses[current] === "flagged" && <Badge variant="warning" dot>Flagged</Badge>}
                {answers[current] !== undefined && statuses[current] !== "flagged" && (
                  <Badge variant="success" dot>Answered</Badge>
                )}
              </div>
            </div>

            <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="card p-6">
                  <p className="text-[15px] font-medium text-text-primary leading-relaxed">
                    <span className="text-primary font-bold mr-2">Q{current + 1}.</span>
                    {q.text}
                  </p>
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, oi) => {
                    const selected = answers[current] === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(current, oi)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150",
                          selected
                            ? "border-primary/50 bg-primary/10 shadow-glow"
                            : "border-white/6 bg-surface hover:border-primary/25 hover:bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[12px] font-bold border transition-all",
                          selected ? "bg-primary text-white border-primary" : "bg-surface-2 text-text-muted border-white/8"
                        )}>
                          {String.fromCharCode(65 + oi)}
                        </div>
                        <span className={cn(
                          "text-[13.5px] font-medium leading-relaxed flex-1",
                          selected ? "text-text-primary" : "text-text-secondary"
                        )}>
                          {opt}
                        </span>
                        {selected
                          ? <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          : <Circle      className="w-4 h-4 text-text-subtle shrink-0" />
                        }
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="btn btn-secondary gap-1.5 disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => toggleFlag(current)}
                className={cn("btn gap-1.5", statuses[current] === "flagged" ? "btn-warning" : "btn-ghost")}
              >
                <Flag className="w-3.5 h-3.5" />
                {statuses[current] === "flagged" ? "Unflag" : "Flag"}
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                disabled={current === questions.length - 1}
                className="btn btn-secondary gap-1.5 disabled:opacity-30"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Palette Sidebar */}
        <div className="w-60 border-l border-white/5 bg-surface/50 p-4 overflow-y-auto no-scrollbar shrink-0">
          <p className="text-[11.5px] font-semibold text-text-primary mb-3">Question Palette</p>
          <div className="space-y-1.5 mb-4">
            {[
              { color: "bg-primary",   label: "Current"    },
              { color: "bg-success",   label: "Answered"   },
              { color: "bg-warning",   label: "Flagged"    },
              { color: "bg-surface-3", label: "Unanswered" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-[10.5px] text-text-muted">
                <div className={`w-3 h-3 rounded ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((_, qi) => {
              const isCurr = qi === current;
              const isAns  = answers[qi] !== undefined;
              const isFlag = statuses[qi] === "flagged";
              return (
                <button
                  key={qi}
                  onClick={() => setCurrent(qi)}
                  className={cn(
                    "w-9 h-9 rounded-lg text-[11px] font-semibold transition-all border",
                    isCurr  ? "bg-primary text-white border-primary scale-105" :
                    isFlag  ? "bg-warning/20 text-warning border-warning/30" :
                    isAns   ? "bg-success/15 text-success border-success/25" :
                    "bg-surface-2 text-text-muted border-white/6 hover:border-white/12"
                  )}
                >
                  {qi + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 pt-4 border-t border-white/5">
            {[
              { label: "Answered",   value: answered,                 color: "text-success"    },
              { label: "Unanswered", value: unanswered,               color: "text-text-muted" },
              { label: "Flagged",    value: flagged,                  color: "text-warning"    },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[11.5px]">
                <span className="text-text-muted">{s.label}</span>
                <span className={`font-semibold font-feature ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSubmit(true)}
            className="btn btn-primary w-full justify-center mt-4 text-[12.5px]"
          >
            <Send className="w-3.5 h-3.5" /> Submit Exam
          </button>
        </div>
      </div>

      {/* Submit Dialog */}
      <AnimatePresence>
        {showSubmit && (
          <>
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSubmit(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="pointer-events-auto w-full max-w-sm glass rounded-2xl border border-white/8 p-6 shadow-xl"
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-text-primary mb-1">Submit Exam?</h2>
                    <p className="text-[13px] text-text-muted">
                      Answered <strong className="text-text-primary">{answered}</strong> of{" "}
                      <strong className="text-text-primary">{questions.length}</strong> questions.
                    </p>
                    {unanswered > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                        <p className="text-[12px] text-warning">{unanswered} questions unanswered</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setShowSubmit(false)} className="btn btn-secondary flex-1 justify-center">
                      Continue
                    </button>
                    <button onClick={handleSubmit} className="btn btn-primary flex-1 justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudentExamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ExamContent />
    </Suspense>
  );
}
