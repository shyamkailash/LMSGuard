"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ALL_VIOLATIONS } from "@/data/adminData";
import { AlertTriangle, Search, Download, Eye, CheckCircle, Clock, Shield } from "lucide-react";

const SEV_CFG = {
  critical: { cls:"badge-danger",  label:"Critical", dot:"var(--danger)"  },
  medium:   { cls:"badge-warning", label:"Medium",   dot:"var(--warning)" },
  warning:  { cls:"badge-warning", label:"Warning",  dot:"var(--warning)" },
};

export default function AdminViolationsPage() {
  const [search,     setSearch]     = useState("");
  const [sevFilter,  setSevFilter]  = useState("all");
  const [sort,       setSort]       = useState("newest");
  const [dismissed,  setDismissed]  = useState(new Set());

  const rows = ALL_VIOLATIONS
    .filter(v => !dismissed.has(v.id))
    .filter(v => {
      const q = search.toLowerCase();
      return (v.studentName.toLowerCase().includes(q) || v.class.toLowerCase().includes(q) || v.type.toLowerCase().includes(q)) &&
             (sevFilter==="all" || v.severity===sevFilter);
    })
    .sort((a,b) => sort==="newest" ? b.timestamp-a.timestamp : a.timestamp-b.timestamp);

  const counts = {
    total:    ALL_VIOLATIONS.filter(v=>!dismissed.has(v.id)).length,
    critical: ALL_VIOLATIONS.filter(v=>!dismissed.has(v.id)&&v.severity==="critical").length,
    medium:   ALL_VIOLATIONS.filter(v=>!dismissed.has(v.id)&&(v.severity==="medium"||v.severity==="warning")).length,
  };

  return (
    <AdminLayout title="Violations" subtitle="System-wide violation records — all classes and departments">
      {/* Admin scope banner */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex items-center gap-3 p-3.5 rounded-2xl mb-5"
        style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(27,77,30,0.2)" }}>
        <Shield size={14} style={{ color:"var(--primary)" }}/>
        <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>
          Admin view: <span style={{ color:"var(--primary)" }}>All classes visible</span>
          {" "}— no department restriction
        </p>
        <span className="ml-auto badge text-[10px]"
          style={{ background:"rgba(27,77,30,0.12)", color:"var(--primary)", borderColor:"rgba(27,77,30,0.25)" }}>
          Full Access
        </span>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label:"Total",    value:counts.total,    color:"var(--primary)", border:"rgba(37,99,235,0.15)" },
          { label:"Critical", value:counts.critical, color:"var(--danger)",  border:"rgba(220,38,38,0.15)" },
          { label:"Medium",   value:counts.medium,   color:"var(--warning)", border:"rgba(217,119,6,0.15)" },
        ].map(({ label, value, color, border }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.07 }}
            className="rounded-2xl p-4"
            style={{ background:"var(--card)", border:`1px solid ${border}`, boxShadow:"var(--shadow)" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search student, class, or type…" className="input-field pl-8"/>
        </div>
        {["all","critical","medium"].map(s => (
          <button key={s} onClick={() => setSevFilter(s)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition-all"
            style={{
              background:  sevFilter===s ? (s==="critical"?"var(--danger-muted)":s==="all"?"var(--primary-muted)":"var(--warning-muted)") : "var(--card)",
              color:       sevFilter===s ? (s==="critical"?"var(--danger)":s==="all"?"var(--primary)":"var(--warning)") : "var(--text-secondary)",
              borderColor: sevFilter===s ? (s==="critical"?"rgba(220,38,38,0.3)":s==="all"?"rgba(37,99,235,0.3)":"rgba(217,119,6,0.3)") : "var(--border)",
            }}>{s==="all"?"All":s}</button>
        ))}
        <button onClick={() => setSort(v=>v==="newest"?"oldest":"newest")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium btn-secondary">
          <Clock size={11}/> {sort==="newest"?"Newest":"Oldest"}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
          <Download size={11}/> Export
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        className="rounded-2xl overflow-hidden"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="grid grid-cols-[2fr_1.2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-3 px-5 py-3"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
          {["Student","Class","Exam","Violation","Time","Severity","Action"].map(h=>(
            <p key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{h}</p>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {rows.map((v, i) => {
            const sc = SEV_CFG[v.severity] || SEV_CFG.medium;
            return (
              <motion.div key={v.id}
                initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:20, height:0 }} transition={{ delay:i*0.025 }}
                className="grid grid-cols-[2fr_1.2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-3 px-5 py-3.5 table-row"
                style={{ borderBottom:"1px solid var(--border-soft)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                  flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {v.studentName.split(" ").map((n: string) => n[0]).join("").slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color:"var(--text-primary)" }}>{v.studentName}</p>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{v.regno}</p>
                  </div>
                </div>
                <span className="text-xs flex items-center" style={{ color:"var(--text-secondary)" }}>{v.class}</span>
                <span className="text-xs flex items-center truncate" style={{ color:"var(--text-muted)" }}>{v.exam}</span>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={11} style={{ color:sc.dot }} className="shrink-0"/>
                  <span className="text-sm truncate" style={{ color:"var(--text-primary)" }}>{v.type}</span>
                </div>
                <span className="text-sm font-mono flex items-center" style={{ color:"var(--text-secondary)" }}>{v.time}</span>
                <div className="flex items-center">
                  <span className={`badge ${sc.cls} text-[9px]`}>{sc.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <a href="/admin/students"
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)", color:"var(--primary)" }}>
                    <Eye size={11}/>
                  </a>
                  <button onClick={() => setDismissed(d => new Set([...d, v.id]))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background:"var(--success-muted)", border:"1px solid rgba(22,163,74,0.2)", color:"var(--success)" }}>
                    <CheckCircle size={11}/>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14">
            <Shield size={28} className="mb-3" style={{ color:"var(--success)", opacity:0.6 }}/>
            <p style={{ color:"var(--text-secondary)" }}>No violations found</p>
          </div>
        )}
        {rows.length > 0 && (
          <div className="flex justify-between items-center px-5 py-3"
            style={{ borderTop:"1px solid var(--border)", background:"var(--bg-deep)" }}>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>{rows.length} violations · All classes</p>
            <button onClick={() => setDismissed(new Set(ALL_VIOLATIONS.map(v=>v.id)))}
              className="text-xs transition-colors" style={{ color:"var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color="var(--text-primary)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color="var(--text-muted)"}>
              Dismiss all
            </button>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
