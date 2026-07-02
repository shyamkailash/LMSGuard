"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle,
  CheckCircle, Circle, Send, BookOpen, GraduationCap
} from "lucide-react";
import { MOCK_ASSESSMENTS, EXAM_QUESTIONS } from "@/data/studentData";

function ExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("id") || "EXAM001";

  const exam = MOCK_ASSESSMENTS.find(e => e.id === examId) || MOCK_ASSESSMENTS[0];
  const questions = EXAM_QUESTIONS[examId] || EXAM_QUESTIONS.EXAM001;

  const [currentQ, setCurrentQ]     = useState(0);
  const [answers, setAnswers]       = useState({});
  const [flagged, setFlagged]       = useState(new Set());
  const [timeLeft, setTimeLeft]     = useState(exam.duration * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [showNav, setShowNav]       = useState(false);

  const answered = Object.keys(answers).length;
  const total    = questions.length;

  // Timer countdown
  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function selectAnswer(optionIndex) {
    if (submitted) return;
    setAnswers(a => ({ ...a, [currentQ]: optionIndex }));
  }

  function toggleFlag() {
    setFlagged(f => {
      const next = new Set(f);
      next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ);
      return next;
    });
  }

  function handleSubmit() {
    setShowConfirm(false);
    setSubmitted(true);
    sessionStorage.setItem("examAnswers",   JSON.stringify(answers));
    sessionStorage.setItem("examSubmitted", "true");
    setTimeout(() => router.push("/student/completed"), 400);
  }

  const timerDanger = timeLeft < 300;
  const timerWarn   = timeLeft < 600;

  const q = questions[currentQ];
  const OPTS = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* ── Top Bar ── */}
      <header
        className="h-14 flex items-center justify-between px-5 shrink-0 sticky top-0 z-20"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
      >
        {/* Exam info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: "linear-gradient(135deg, #16A34A, #2563EB)" }}>
            <BookOpen size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{exam.title}</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Q {currentQ + 1}/{total} · {answered} answered
            </p>
          </div>
        </div>

        {/* Timer + controls */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <motion.div
            animate={timerDanger ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm"
            style={{
              background: timerDanger ? "var(--danger-muted)" : timerWarn ? "var(--warning-muted)" : "var(--bg-deep)",
              border: `1px solid ${timerDanger ? "rgba(220,38,38,0.3)" : timerWarn ? "rgba(217,119,6,0.3)" : "var(--border)"}`,
              color: timerDanger ? "var(--danger)" : timerWarn ? "var(--warning)" : "var(--text-primary)",
            }}
          >
            <Clock size={13} />
            {formatTime(timeLeft)}
          </motion.div>

          {/* Question grid toggle */}
          <button
            onClick={() => setShowNav(v => !v)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: showNav ? "var(--primary-muted)" : "var(--bg-deep)", color: showNav ? "var(--primary)" : "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Questions
          </button>

          

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: "var(--primary)" }}
          >
            <Send size={12} /> Submit
          </motion.button>
        </div>
      </header>

      {/* ── Progress Bar ── */}
      <div className="h-1" style={{ background: "var(--border)" }}>
        <motion.div
          animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-full"
          style={{ background: "linear-gradient(90deg, #16A34A, #2563EB)" }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Question Panel ── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
              >
                {/* Question card */}
                <div className="rounded-2xl p-6 mb-5"
                     style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl"
                            style={{ background: "var(--primary-muted)", color: "var(--primary)" }}>
                        Q{currentQ + 1}
                      </span>
                      {flagged.has(currentQ) && (
                        <span className="badge badge-warning"><Flag size={9}/> Flagged</span>
                      )}
                    </div>
                    <button
                      onClick={toggleFlag}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: flagged.has(currentQ) ? "var(--warning-muted)" : "var(--bg-deep)",
                        color:      flagged.has(currentQ) ? "var(--warning)" : "var(--text-muted)",
                        border: `1px solid ${flagged.has(currentQ) ? "rgba(217,119,6,0.25)" : "var(--border)"}`,
                      }}
                    >
                      <Flag size={11}/> {flagged.has(currentQ) ? "Flagged" : "Flag"}
                    </button>
                  </div>

                  <p className="text-base font-semibold leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {q.text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {q.options.map((opt, idx) => {
                    const selected = answers[currentQ] === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ x: selected ? 0 : 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectAnswer(idx)}
                        className="w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all"
                        style={{
                          background:   selected ? "var(--primary-muted)" : "var(--card)",
                          border:       `1px solid ${selected ? "rgba(37,99,235,0.4)" : "var(--border)"}`,
                          boxShadow:    selected ? "0 0 0 2px rgba(37,99,235,0.12)" : "var(--shadow)",
                        }}
                      >
                        {/* Option letter bubble */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all"
                          style={{
                            background: selected ? "var(--primary)" : "var(--bg-deep)",
                            color:      selected ? "white"          : "var(--text-muted)",
                            border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                          }}
                        >
                          {OPTS[idx]}
                        </div>
                        {/* Option text */}
                        <span className="text-sm font-medium" style={{ color: selected ? "var(--primary)" : "var(--text-primary)" }}>
                          {opt}
                        </span>
                        {/* Check icon */}
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <CheckCircle size={16} style={{ color: "var(--primary)" }} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: "var(--card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                <ChevronLeft size={15} /> Previous
              </motion.button>

              {/* Answer status dots */}
              <div className="flex items-center gap-1">
                {[...Array(Math.min(total, 7))].map((_, i) => {
                  const qIdx = Math.max(0, currentQ - 3) + i;
                  if (qIdx >= total) return null;
                  const isAnswered = answers[qIdx] !== undefined;
                  const isCurrent  = qIdx === currentQ;
                  const isFlagged  = flagged.has(qIdx);
                  return (
                    <motion.button
                      key={qIdx}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setCurrentQ(qIdx)}
                      className="rounded-full transition-all"
                      style={{
                        width:      isCurrent ? 20 : 8,
                        height:     8,
                        background: isCurrent ? "var(--primary)" : isFlagged ? "var(--warning)" : isAnswered ? "var(--success)" : "var(--border)",
                      }}
                    />
                  );
                })}
              </div>

              {currentQ < total - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentQ(q => Math.min(total - 1, q + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "var(--primary)" }}
                >
                  Next <ChevronRight size={15} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
                >
                  Submit <Send size={13} />
                </motion.button>
              )}
            </div>
          </div>
        </main>

        {/* ── Side Nav Panel ── */}
        <AnimatePresence>
          {showNav && (
            <motion.aside
              initial={{ opacity: 0, x: 280 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 280 }}
              transition={{ duration: 0.22 }}
              className="w-64 overflow-y-auto p-4 shrink-0"
              style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Question Navigator
              </p>
              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { color:"var(--primary)", label:"Current"  },
                  { color:"var(--success)", label:"Answered" },
                  { color:"var(--warning)", label:"Flagged"  },
                  { color:"var(--border)",  label:"Skipped"  },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }}/>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</span>
                  </div>
                ))}
              </div>
              {/* Grid */}
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((_, idx) => {
                  const isCurrent  = idx === currentQ;
                  const isAnswered = answers[idx] !== undefined;
                  const isFlagged  = flagged.has(idx);
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentQ(idx)}
                      className="aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all"
                      style={{
                        background: isCurrent ? "var(--primary)" : isFlagged ? "var(--warning-muted)" : isAnswered ? "var(--success-muted)" : "var(--bg-deep)",
                        color:      isCurrent ? "white" : isFlagged ? "var(--warning)" : isAnswered ? "var(--success)" : "var(--text-muted)",
                        border: `1px solid ${isCurrent ? "var(--primary)" : isFlagged ? "rgba(217,119,6,0.3)" : isAnswered ? "rgba(22,163,74,0.3)" : "var(--border)"}`,
                        boxShadow: isCurrent ? "0 0 0 2px rgba(37,99,235,0.2)" : "none",
                      }}
                    >
                      {idx + 1}
                    </motion.button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-4 p-3 rounded-xl space-y-2" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                {[
                  { label:"Answered", value:answered,       color:"var(--success)" },
                  { label:"Skipped",  value:total-answered, color:"var(--warning)" },
                  { label:"Flagged",  value:flagged.size,   color:"var(--danger)"  },
                  { label:"Total",    value:total,          color:"var(--primary)" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span className="font-bold" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Submit Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 16 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.88, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                       style={{ background: "var(--warning-muted)", border: "1px solid rgba(217,119,6,0.2)" }}>
                    <AlertTriangle size={18} style={{ color: "var(--warning)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Submit Exam?</h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>This action cannot be undone</p>
                  </div>
                </div>

                <div className="rounded-xl p-3 mb-5 space-y-1.5" style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}>
                  {[
                    ["Answered",      `${answered} / ${total}`,  "var(--success)"],
                    ["Unanswered",    `${total - answered}`,      "var(--warning)"],
                    ["Flagged",       `${flagged.size}`,          "var(--danger)"  ],
                    ["Time Remaining",formatTime(timeLeft),       "var(--primary)" ],
                  ].map(([l, v, c]) => (
                    <div key={l} className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-secondary)" }}>{l}</span>
                      <span className="font-bold" style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>

                {total - answered > 0 && (
                  <div className="flex items-start gap-2 mb-4 p-3 rounded-xl"
                       style={{ background: "var(--warning-muted)", border: "1px solid rgba(217,119,6,0.2)" }}>
                    <AlertTriangle size={13} style={{ color: "var(--warning)", marginTop: 1 }} />
                    <p className="text-xs" style={{ color: "var(--warning)" }}>
                      You have {total - answered} unanswered question{total - answered !== 1 ? "s" : ""}.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-secondary"
                  >
                    Review
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
                  >
                    <Send size={13} /> Submit Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-t-[#16A34A]"
          style={{ borderColor: "var(--border)", borderTopColor: "#16A34A" }} />
      </div>
    }>
      <ExamContent />
    </Suspense>
  );
}
