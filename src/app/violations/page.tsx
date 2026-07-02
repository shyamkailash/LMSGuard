"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { onEvent } from "@/services/websocket";
import { CLASS_VIOLATIONS } from "@/data/invigilatorData";
import {
  AlertTriangle, Search, Download, Eye,
  CheckCircle, Clock, MessageSquare, Shield, AlertCircle
} from "lucide-react";

const SEV_CFG = {
  critical: { cls:"badge-danger",  label:"Critical", dot:"var(--danger)"  },
  warning:  { cls:"badge-warning", label:"Warning",  dot:"var(--warning)" },
  medium:   { cls:"badge-warning", label:"Medium",   dot:"var(--warning)" },
};

export default function ViolationsPage() {
  const router = useRouter();
  const [sessionClass, setSessionClass] = useState(null);
  const [sessionExam,  setSessionExam]  = useState(null);
  const [violations,   setViolations]   = useState([]);
  const [search,       setSearch]       = useState("");
  const [sevFilter,    setSevFilter]    = useState("all");
  const [sort,         setSort]         = useState("newest");
  const [dismissed,    setDismissed]    = useState(new Set());
  const [remarked,     setRemarked]     = useState({});
  const [remarkOpen,   setRemarkOpen]   = useState(null);
  const [ready,        setReady]        = useState(false);

  useEffect(() => {
    const clsRaw  = sessionStorage.getItem("invSelectedClass");
    const examRaw = sessionStorage.getItem("invSelectedExam");
    let cls  = null;
    let exam = null;
    try { if (clsRaw)  cls  = JSON.parse(clsRaw);  } catch {}
    try { if (examRaw) exam = JSON.parse(examRaw);  } catch {}
    setSessionClass(cls?.id  ? cls  : null);
    setSessionExam (exam?.id ? exam : null);
    if (cls?.id) {
      setViolations(CLASS_VIOLATIONS[cls.id] || []);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const assignedClass = sessionClass?.id;
    if (!assignedClass) return;
    const off = onEvent("violation_detected", data => {
      if (data.assignedClass && data.assignedClass !== assignedClass) return;
      setViolations(prev => [{
        id:`V${Date.now()}`, studentId:data.studentId, studentName:data.studentName,
        regno:data.regno, type:data.type, detail:data.detail,
        severity:data.severity, time:data.time, timestamp:data.timestamp,
      }, ...prev]);
    });
    return off;
  }, [sessionClass]);

  const rows = violations
    .filter(v => !dismissed.has(v.id))
    .filter(v => {
      const q = search.toLowerCase();
      return (
        (v.studentName.toLowerCase().includes(q) ||
         v.type.toLowerCase().includes(q) ||
         v.regno?.toLowerCase().includes(q)) &&
        (sevFilter === "all" || v.severity === sevFilter)
      );
    })
    .sort((a,b) => sort==="newest" ? b.timestamp-a.timestamp : a.timestamp-b.timestamp);

  const counts = {
    total:    violations.filter(v => !dismissed.has(v.id)).length,
    critical: violations.filter(v => !dismissed.has(v.id) && v.severity==="critical").length,
    medium:   violations.filter(v => !dismissed.has(v.id) && (v.severity==="warning"||v.severity==="medium")).length,
  };

  if (!ready) {
    return (
      <DashboardLayout title="Violations" subtitle="No active session">
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background:"var(--warning-muted)", border:"1px solid rgba(217,119,6,0.2)" }}>
            <AlertCircle size={28} style={{ color:"var(--warning)" }}/>
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color:"var(--text-primary)" }}>
            No Active Session
          </h2>
          <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>
            Select a class and exam from the Dashboard first.
          </p>
          <button onClick={() => router.push("/dashboard")} className="btn-primary px-6 py-2.5 text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Violations"
      subtitle={`${sessionClass?.label} · ${sessionExam?.title}`}>

      {/* Context banner */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl mb-5"
        style={{ background:"var(--danger-muted)", border:"1px solid rgba(220,38,38,0.18)" }}>
        <AlertTriangle size={14} style={{ color:"var(--danger)" }}/>
        <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>
          Violations for{" "}
          <span style={{ color:"var(--danger)" }}>{sessionClass?.label}</span>
          {" "}·{" "}
          <span style={{ color:"var(--text-secondary)" }}>{sessionExam?.title}</span>
        </p>
        <span className="ml-auto badge badge-danger">{counts.total} total</span>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label:"Total",    value:counts.total,    color:"var(--primary)", border:"rgba(37,99,235,0.15)" },
          { label:"Critical", value:counts.critical, color:"var(--danger)",  border:"rgba(220,38,38,0.15)" },
          { label:"Warnings", value:counts.medium,   color:"var(--warning)", border:"rgba(217,119,6,0.15)" },
        ].map(({ label, value, color, border }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.07 }}
            className="rounded-2xl p-4"
            style={{ background:"var(--card)", border:`1px solid ${border}`, boxShadow:"var(--shadow)" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>
              {label}
            </p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color:"var(--text-muted)" }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search student or violation type…"
            className="input-field pl-8"/>
        </div>
        {["all","critical","medium","warning"].map(sv => (
          <button key={sv} onClick={() => setSevFilter(sv)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize"
            style={{
              background:  sevFilter===sv
                ? sv==="critical" ? "var(--danger-muted)" : sv==="all" ? "var(--primary-muted)" : "var(--warning-muted)"
                : "var(--card)",
              color:       sevFilter===sv
                ? sv==="critical" ? "var(--danger)" : sv==="all" ? "var(--primary)" : "var(--warning)"
                : "var(--text-secondary)",
              borderColor: sevFilter===sv
                ? sv==="critical" ? "rgba(220,38,38,0.3)" : sv==="all" ? "rgba(37,99,235,0.3)" : "rgba(217,119,6,0.3)"
                : "var(--border)",
            }}>
            {sv === "all" ? "All" : sv}
          </button>
        ))}
        <button onClick={() => setSort(v => v==="newest"?"oldest":"newest")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium btn-secondary">
          <Clock size={11}/> {sort==="newest" ? "Newest" : "Oldest"}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
          <Download size={11}/> Export
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>

        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Student","Violation","Time","Severity","Actions"].map(h => (
            <p key={h} className="text-[11px] font-bold uppercase tracking-wider"
               style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {rows.map((v, i) => {
            const sc = SEV_CFG[v.severity] || SEV_CFG.medium;
            return (
              <motion.div key={v.id}
                initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:20, height:0 }}
                transition={{ delay:i*0.025 }}>
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 table-row"
                  style={{ borderBottom:"1px solid var(--border-soft)" }}>
                  {/* Student */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                    flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {v.studentName?.split(" ").map((n: string) => n[0]).join("").slice(0,2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color:"var(--text-primary)" }}>
                        {v.studentName}
                      </p>
                      <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{v.regno}</p>
                    </div>
                  </div>
                  {/* Violation */}
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertTriangle size={12} style={{ color:sc.dot, marginTop:2 }} className="shrink-0"/>
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>{v.type}</p>
                      <p className="text-[10px] truncate" style={{ color:"var(--text-muted)" }}>{v.detail}</p>
                    </div>
                  </div>
                  {/* Time */}
                  <div className="flex items-center">
                    <span className="text-sm font-mono" style={{ color:"var(--text-secondary)" }}>{v.time}</span>
                  </div>
                  {/* Severity */}
                  <div className="flex items-center">
                    <span className={`badge ${sc.cls}`}>
                      <span className="w-1 h-1 rounded-full" style={{ background:sc.dot }}/>
                      {sc.label}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <a href={`/monitoring?s=${v.studentId}`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)",
                               color:"var(--primary)" }} title="View">
                      <Eye size={12}/>
                    </a>
                    <button onClick={() => setRemarkOpen(remarkOpen===v.id ? null : v.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        background:  remarkOpen===v.id||remarked[v.id] ? "var(--warning-muted)" : "var(--bg-deep)",
                        border:     `1px solid ${remarkOpen===v.id||remarked[v.id] ? "rgba(217,119,6,0.25)" : "var(--border)"}`,
                        color:       remarked[v.id] ? "var(--warning)" : "var(--text-muted)",
                      }} title="Remark">
                      <MessageSquare size={12}/>
                    </button>
                    <button onClick={() => setDismissed(s => new Set([...s, v.id]))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)",
                               color:"var(--success)" }} title="Dismiss">
                      <CheckCircle size={12}/>
                    </button>
                  </div>
                </div>

                {/* Inline remark */}
                <AnimatePresence>
                  {remarkOpen===v.id && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                      exit={{ height:0, opacity:0 }} transition={{ duration:0.18 }}
                      className="overflow-hidden">
                      <div className="px-5 py-3 flex items-center gap-3"
                        style={{ background:"var(--warning-muted)", borderBottom:"1px solid var(--border)" }}>
                        <MessageSquare size={13} style={{ color:"var(--warning)" }} className="shrink-0"/>
                        <input autoFocus
                          placeholder="Add remark for this violation…"
                          value={remarked[v.id]||""}
                          onChange={e => setRemarked(r => ({ ...r, [v.id]:e.target.value }))}
                          className="flex-1 text-xs px-3 py-1.5 rounded-lg"
                          style={{ background:"var(--card)", border:"1px solid var(--border)",
                                   color:"var(--text-primary)", outline:"none" }}/>
                        <button onClick={() => setRemarkOpen(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shrink-0"
                          style={{ background:"var(--warning)" }}>
                          Save
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Shield size={32} className="mb-3" style={{ color:"var(--success)", opacity:0.6 }}/>
            <p className="font-semibold" style={{ color:"var(--text-secondary)" }}>
              {search || sevFilter!=="all" ? "No matching violations" : "No violations — all clear! 🎉"}
            </p>
            <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>{sessionClass?.label}</p>
          </div>
        )}

        {rows.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3"
            style={{ borderTop:"1px solid var(--border)", background:"var(--bg-deep)" }}>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              {rows.length} violation{rows.length!==1?"s":""} · {sessionClass?.label}
            </p>
            <button onClick={() => setDismissed(new Set(violations.map(v=>v.id)))}
              className="text-xs transition-colors" style={{ color:"var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color="var(--text-primary)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color="var(--text-muted)"}>
              Dismiss all
            </button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
