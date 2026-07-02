"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WifiOff, Wifi, X, Clock, User, BookOpen,
  Users, Plus, RotateCcw, Play, Clipboard, ChevronRight
} from "lucide-react";

/* ── Extra Time Modal ─────────────────────────────────────────────────── */
function ExtraTimeModal({ issue, onConfirm, onClose }) {
  const [preset,  setPreset]  = useState(null);  // 5 | 10 | 15
  const [custom,  setCustom]  = useState("");
  const minutes = preset ?? (Number(custom) || 0);

  function handleConfirm() {
    if (minutes < 1) return;
    onConfirm({ action:"extra_time", extraMinutes:minutes, issue });
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale:0.88, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.88, y:16 }}
        transition={{ type:"spring", stiffness:300, damping:24 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid rgba(22,163,74,0.3)",
                 boxShadow:"var(--shadow-xl)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom:"1px solid var(--border)",
                   background:"linear-gradient(135deg,rgba(22,163,74,0.1),rgba(22,163,74,0.04))" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)" }}>
              <Clock size={15} style={{ color:"var(--success)" }}/>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>Grant Extra Time</p>
              <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                {issue.studentName} · {issue.regno}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
            <X size={11}/>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Current remaining */}
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
            <span className="text-sm" style={{ color:"var(--text-secondary)" }}>
              Current Remaining Time
            </span>
            <span className="text-sm font-bold" style={{ color:"var(--primary)" }}>~10 Minutes</span>
          </div>

          {/* Preset chips */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2"
               style={{ color:"var(--text-muted)" }}>Add Extra Time</p>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map(m => (
                <motion.button key={m} whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                  onClick={() => { setPreset(m); setCustom(""); }}
                  className="py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: preset===m ? "var(--success)" : "var(--bg-deep)",
                    color:      preset===m ? "white"          : "var(--text-secondary)",
                    border:`1px solid ${preset===m ? "var(--success)" : "var(--border)"}`,
                  }}>
                  +{m} min
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2"
               style={{ color:"var(--text-muted)" }}>Custom Time</p>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={60} value={custom}
                onChange={e => { setCustom(e.target.value); setPreset(null); }}
                placeholder="Enter minutes…"
                className="input-field flex-1"
                style={{ fontSize:14 }}/>
              <span className="text-sm shrink-0" style={{ color:"var(--text-muted)" }}>min</span>
            </div>
          </div>

          {/* Selected summary */}
          {minutes > 0 && (
            <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.25)" }}>
              <span className="text-sm" style={{ color:"var(--success)" }}>Extra time to grant</span>
              <span className="text-lg font-bold" style={{ color:"var(--success)" }}>+{minutes} min</span>
            </motion.div>
          )}

          <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
            onClick={handleConfirm} disabled={minutes < 1}
            className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background:"linear-gradient(135deg,#16A34A,#15803D)",
                     boxShadow:"0 4px 12px rgba(22,163,74,0.25)" }}>
            <Clock size={14}/> Confirm Extra Time
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Retest Modal ─────────────────────────────────────────────────────── */
function RetestModal({ issue, onConfirm, onClose }) {
  const [attempt,  setAttempt]  = useState("same");    // "same" | "new"
  const [duration, setDuration] = useState("same");    // "same" | number

  function handleConfirm() {
    onConfirm({ action:"allow_retest", attempt, duration, issue });
  }

  const DURATIONS = [
    { label:"Same Duration", value:"same" },
    { label:"30 Minutes",    value:30     },
    { label:"45 Minutes",    value:45     },
    { label:"60 Minutes",    value:60     },
  ];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale:0.88, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.88, y:16 }}
        transition={{ type:"spring", stiffness:300, damping:24 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid rgba(37,99,235,0.3)",
                 boxShadow:"var(--shadow-xl)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom:"1px solid var(--border)",
                   background:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.04))" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)" }}>
              <RotateCcw size={15} style={{ color:"var(--primary)" }}/>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>Allow Retest</p>
              <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                {issue.studentName} · {issue.regno}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
            <X size={11}/>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Reason */}
          <div className="p-3 rounded-xl"
            style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
            <p className="text-[11px] uppercase tracking-wider mb-1"
               style={{ color:"var(--text-muted)" }}>Reason</p>
            <p className="text-sm font-medium" style={{ color:"var(--warning)" }}>
              Network Problem — {issue.issue}
            </p>
          </div>

          {/* Attempt type */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2"
               style={{ color:"var(--text-muted)" }}>Exam Attempt</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value:"same", label:"Same Exam",   icon:"📄" },
                { value:"new",  label:"New Attempt",  icon:"📝" },
              ].map(opt => (
                <motion.button key={opt.value} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  onClick={() => setAttempt(opt.value)}
                  className="py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 transition-all"
                  style={{
                    background: attempt===opt.value ? "var(--primary-muted)" : "var(--bg-deep)",
                    color:      attempt===opt.value ? "var(--primary)"       : "var(--text-secondary)",
                    border:`1px solid ${attempt===opt.value ? "rgba(37,99,235,0.35)" : "var(--border)"}`,
                  }}>
                  <span>{opt.icon}</span>
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2"
               style={{ color:"var(--text-muted)" }}>Retest Duration</p>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map(d => (
                <motion.button key={d.value} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  onClick={() => setDuration(d.value)}
                  className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: duration===d.value ? "var(--primary-muted)" : "var(--bg-deep)",
                    color:      duration===d.value ? "var(--primary)"       : "var(--text-muted)",
                    border:`1px solid ${duration===d.value ? "rgba(37,99,235,0.35)" : "var(--border)"}`,
                  }}>
                  {d.label}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
                     boxShadow:"0 4px 12px rgba(37,99,235,0.25)" }}>
            <RotateCcw size={14}/> Confirm Retest
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Network Issue Popup ─────────────────────────────────────────── */
export default function NetworkIssuePopup({
  issue, onClose, onAction,
}) {
  const [show,          setShow]          = useState(false);
  const [showExtraTime, setShowExtraTime] = useState(false);
  const [showRetest,    setShowRetest]    = useState(false);
  const [resolved,      setResolved]      = useState(false);

  useEffect(() => {
    if (!issue) return;
    setShow(true); setResolved(false);
    const t = setTimeout(() => close(), 60000); // 60 s auto-dismiss
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue]);

  function close() { setShow(false); setTimeout(() => onClose?.(), 280); }

  function handleAction(type) {
    if (type === "extra_time")   { setShowExtraTime(true); return; }
    if (type === "allow_retest") { setShowRetest(true);    return; }
    // immediate actions
    setResolved(true);
    onAction?.({ action:type, issue });
    setTimeout(close, 1200);
  }

  function handleExtraTimeConfirm(data) {
    setShowExtraTime(false);
    setResolved(true);
    onAction?.(data);
    setTimeout(close, 1200);
  }

  function handleRetestConfirm(data) {
    setShowRetest(false);
    setResolved(true);
    onAction?.(data);
    setTimeout(close, 1200);
  }

  const isDisconnected = issue?.networkStatus === "disconnected";

  const ACTIONS = [
    { type:"extra_time",    label:"Grant Extra Time", icon:Clock,      color:"var(--success)",
      bg:"var(--success-muted)", border:"rgba(22,163,74,0.25)" },
    { type:"allow_retest",  label:"Allow Retest",     icon:RotateCcw,  color:"var(--primary)",
      bg:"var(--primary-muted)", border:"rgba(37,99,235,0.25)" },
    { type:"continue_exam", label:"Continue Exam",    icon:Play,       color:"var(--warning)",
      bg:"var(--warning-muted)", border:"rgba(217,119,6,0.25)" },
    { type:"mark_issue",    label:"Mark Issue",        icon:Clipboard,  color:"var(--text-secondary)",
      bg:"var(--bg-deep)", border:"var(--border)" },
  ];

  return (
    <>
      <AnimatePresence>
        {show && issue && !showExtraTime && !showRetest && (
          <motion.div
            initial={{ opacity:0, x:90, scale:0.92 }}
            animate={{ opacity:1, x:0,  scale:1    }}
            exit={{    opacity:0, x:90, scale:0.92  }}
            transition={{ type:"spring", stiffness:280, damping:24 }}
            className="fixed top-5 right-5 w-[360px] z-[100] rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: `1px solid ${isDisconnected ? "rgba(220,38,38,0.35)" : "rgba(245,158,11,0.35)"}`,
              boxShadow: `var(--shadow-xl), 0 0 30px ${isDisconnected ? "rgba(220,38,38,0.15)" : "rgba(245,158,11,0.12)"}`,
            }}>
            {/* Top accent */}
            <div className="h-1.5 w-full"
              style={{ background: isDisconnected
                ? "linear-gradient(90deg,var(--danger),#dc2626)"
                : "linear-gradient(90deg,var(--warning),#d97706)" }}/>

            <div className="p-4">
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    animate={{ scale:[1,1.1,1] }}
                    transition={{ duration:1.5, repeat:Infinity }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isDisconnected ? "var(--danger-muted)" : "var(--warning-muted)",
                      border: `1px solid ${isDisconnected ? "rgba(220,38,38,0.3)" : "rgba(217,119,6,0.3)"}`,
                    }}>
                    <WifiOff size={16} style={{ color: isDisconnected ? "var(--danger)" : "var(--warning)" }}/>
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>
                        NETWORK ISSUE DETECTED
                      </p>
                      <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }}
                        className="badge text-[9px]"
                        style={{
                          background: isDisconnected ? "var(--danger-muted)" : "var(--warning-muted)",
                          color:      isDisconnected ? "var(--danger)"       : "var(--warning)",
                          borderColor:isDisconnected ? "rgba(220,38,38,0.25)" : "rgba(217,119,6,0.25)",
                        }}>
                        {isDisconnected ? "OFFLINE" : "WEAK"}
                      </motion.span>
                    </div>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                      ⚠️ Invigilator action required
                    </p>
                  </div>
                </div>
                <button onClick={close}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background:"var(--bg-deep)", color:"var(--text-muted)" }}>
                  <X size={11}/>
                </button>
              </div>

              {/* Student info card */}
              <div className="rounded-xl p-3 mb-3"
                style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                  flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {issue.studentName?.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
                      {issue.studentName}
                    </p>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                      {issue.regno}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 shrink-0">
                    {isDisconnected
                      ? <WifiOff size={12} style={{ color:"var(--danger)" }}/>
                      : <Wifi size={12} style={{ color:"var(--warning)" }}/>
                    }
                    <span className="text-[10px] font-semibold"
                      style={{ color: isDisconnected ? "var(--danger)" : "var(--warning)" }}>
                      {isDisconnected ? "Offline" : "Weak"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-2" style={{ borderTop:"1px solid var(--border)" }}>
                  {[
                    { label:"Class",     value:issue.classLabel,      icon:Users },
                    { label:"Exam",      value:issue.examTitle,       icon:BookOpen },
                    { label:"Issue",     value:issue.issue,           icon:WifiOff },
                    { label:"At",        value:issue.disconnectedAt,  icon:Clock },
                    { label:"Duration",  value:`${issue.durationMin} min`, icon:Clock },
                  ].map(({ label, value, icon:Icon }) => (
                    <div key={label} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1">
                        <Icon size={9} style={{ color:"var(--text-muted)" }}/>
                        <span style={{ color:"var(--text-muted)" }}>{label}</span>
                      </div>
                      <span className="font-medium font-mono truncate max-w-[55%] text-right"
                        style={{ color:"var(--text-primary)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolved state */}
              {resolved ? (
                <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl"
                  style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.25)" }}>
                  <span style={{ color:"var(--success)" }}>✓</span>
                  <span className="text-sm font-semibold" style={{ color:"var(--success)" }}>
                    Action applied successfully
                  </span>
                </motion.div>
              ) : (
                /* Action buttons */
                <div className="grid grid-cols-2 gap-2">
                  {ACTIONS.map(({ type, label, icon:Icon, color, bg, border }) => (
                    <motion.button key={type}
                      whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={() => handleAction(type)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{ background:bg, color, border:`1px solid ${border}` }}>
                      <Icon size={12}/> {label}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-dismiss progress */}
            <motion.div initial={{ width:"100%" }} animate={{ width:"0%" }}
              transition={{ duration:60, ease:"linear" }}
              className="h-0.5 opacity-25"
              style={{ background: isDisconnected ? "var(--danger)" : "var(--warning)" }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-modals */}
      <AnimatePresence>
        {showExtraTime && issue && (
          <ExtraTimeModal
            issue={issue}
            onConfirm={handleExtraTimeConfirm}
            onClose={() => setShowExtraTime(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRetest && issue && (
          <RetestModal
            issue={issue}
            onConfirm={handleRetestConfirm}
            onClose={() => setShowRetest(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
