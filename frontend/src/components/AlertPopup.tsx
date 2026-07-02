"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Eye, Minus, MessageSquare, Zap } from "lucide-react";
import type { WSViolationEvent, Severity } from "@/types";

interface SevConfig { bar:string; soft:string; border:string; text:string; label:string; }
const SEV: Record<Severity, SevConfig> = {
  critical:{ bar:"#EF4444", soft:"#FFF1F2", border:"rgba(239,68,68,0.2)",  text:"#DC2626", label:"CRITICAL" },
  warning: { bar:"#F59E0B", soft:"#FFFBEB", border:"rgba(245,158,11,0.2)", text:"#D97706", label:"WARNING"  },
  medium:  { bar:"#F59E0B", soft:"#FFFBEB", border:"rgba(245,158,11,0.15)",text:"#D97706", label:"MEDIUM"   },
};

interface AlertPopupProps {
  alert:         WSViolationEvent | null;
  onClose?:      () => void;
  onViewStudent?:(alert: WSViolationEvent) => void;
  onIgnore?:     (alert: WSViolationEvent) => void;
  onRemark?:     (alert: WSViolationEvent) => void;
}

export default function AlertPopup({ alert, onClose, onViewStudent, onIgnore, onRemark }: AlertPopupProps) {
  const [show, setShow] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!alert) return;
    setShow(true);
    const t = setTimeout(() => { setShow(false); setTimeout(() => onClose?.(), 300); }, 15000);
    return () => clearTimeout(t);
  }, [alert]);

  const close = (): void => { setShow(false); setTimeout(() => onClose?.(), 300); };
  const c = alert ? (SEV[alert.severity] ?? SEV.medium) : SEV.medium;

  return (
    <AnimatePresence>
      {show && alert && (
        <motion.div
          initial={{ opacity:0, y:-16, scale:0.94 }}
          animate={{ opacity:1, y:0,   scale:1    }}
          exit={{    opacity:0, y:-12,  scale:0.96 }}
          transition={{ type:"spring", stiffness:320, damping:26 }}
          className="fixed top-4 right-4 w-[340px] z-[100] rounded-2xl overflow-hidden"
          style={{
            background:"var(--card)",
            border:`1px solid ${c.border}`,
            boxShadow:"0 20px 60px rgba(15,23,42,0.15), 0 4px 16px rgba(15,23,42,0.08)",
          }}>
          <div className="h-1 w-full" style={{ background:c.bar }}/>
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <motion.div animate={{ rotate:[0,-8,8,-4,0] }} transition={{ duration:0.5, delay:0.2 }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:c.soft, border:`1px solid ${c.border}` }}>
                  <AlertTriangle size={15} style={{ color:c.bar }}/>
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>MALPRACTICE ALERT</p>
                    <motion.span animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.2, repeat:Infinity }}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background:c.soft, color:c.text, border:`1px solid ${c.border}` }}>
                      {c.label}
                    </motion.span>
                  </div>
                  <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>AI real-time detection</p>
                </div>
              </div>
              <button onClick={close}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background:"var(--bg-subtle)", color:"var(--text-muted)" }}>
                <X size={11}/>
              </button>
            </div>

            {/* Student */}
            <div className="rounded-xl p-3 mb-3" style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
                  {alert.studentName?.split(" ").map((n:string) => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>{alert.studentName}</p>
                  <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>{alert.regno}</p>
                </div>
              </div>
              <div className="space-y-1 pt-2" style={{ borderTop:"1px solid var(--border)" }}>
                {([["Violation",alert.type,"var(--text-primary)"],["Detail",alert.detail,c.text],["Time",alert.time,"var(--text-muted)"]] as [string,string|undefined,string][]).map(([k,v,col])=>(
                  <div key={k} className="flex justify-between text-[11px]">
                    <span style={{ color:"var(--text-muted)" }}>{k}</span>
                    <span className="font-medium" style={{ color:col }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap size={10} style={{ color:c.bar }}/>
                  <span className="text-[11px]" style={{ color:"var(--text-muted)" }}>Risk</span>
                </div>
                <span className="text-sm font-bold" style={{ color:c.bar }}>{alert.risk ?? 90}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"var(--border)" }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${alert.risk ?? 90}%` }}
                  transition={{ duration:0.8, ease:"easeOut", delay:0.3 }}
                  className="h-full rounded-full" style={{ background:c.bar }}/>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => { onViewStudent?.(alert); close(); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white rounded-xl"
                style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
                <Eye size={12}/> View Student
              </motion.button>
              <button onClick={() => { onRemark?.(alert); close(); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                <MessageSquare size={13}/>
              </button>
              <button onClick={() => { onIgnore?.(alert); close(); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                <Minus size={13}/>
              </button>
            </div>
          </div>
          <motion.div initial={{ width:"100%" }} animate={{ width:"0%" }}
            transition={{ duration:15, ease:"linear" }}
            className="h-0.5 opacity-40" style={{ background:c.bar }}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
