"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ViolationTrendChart, ViolationTypesChart, RiskPieChart } from "@/components/Charts";
import { DEPARTMENTS, ALL_CLASSES, ALL_EXAMS, SYSTEM_STATS } from "@/data/adminData";
import {
  FileText, Download, BarChart3, Building2,
  Layers, BookOpen, Globe, Printer, Share2,
  CheckCircle, Zap, Users, AlertTriangle
} from "lucide-react";

const REPORT_TYPES = [
  {
    id:"college",
    title:"College Report",
    desc:"All departments combined — institution-wide stats",
    icon:Globe,
    color:"var(--primary)",
    bg:"var(--primary-muted)",
    border:"rgba(37,99,235,0.2)",
    selector:null,
  },
  {
    id:"dept",
    title:"Department Report",
    desc:"Select a department to generate detailed report",
    icon:Building2,
    color:"var(--primary)",
    bg:"var(--purple-muted)",
    border:"rgba(27,77,30,0.2)",
    selector:"dept",
  },
  {
    id:"class",
    title:"Class Report",
    desc:"Generate report for a specific class",
    icon:Layers,
    color:"var(--success)",
    bg:"var(--success-muted)",
    border:"rgba(22,163,74,0.2)",
    selector:"class",
  },
  {
    id:"exam",
    title:"Exam Report",
    desc:"Generate report for a specific exam",
    icon:BookOpen,
    color:"var(--warning)",
    bg:"var(--warning-muted)",
    border:"rgba(217,119,6,0.2)",
    selector:"exam",
  },
];

export default function AdminReportsPage() {
  const [selections, setSelections]   = useState({ dept:"", class:"", exam:"" });
  const [generating,  setGenerating]  = useState(null);   // report type id
  const [generated,   setGenerated]   = useState(null);   // report type id
  const [genTime,     setGenTime]     = useState(null);

  async function handleGenerate(typeId) {
    setGenerating(typeId);
    setGenerated(null);
    await new Promise(r => setTimeout(r, 1700));
    setGenerating(null);
    setGenerated(typeId);
    setGenTime(new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
  }

  function getReportTitle(type) {
    if (type.id==="college") return "College — All Departments";
    if (type.id==="dept")    return selections.dept    || "All Departments";
    if (type.id==="class")   return selections.class   || "All Classes";
    if (type.id==="exam")    return selections.exam    || "All Exams";
    return "";
  }

  return (
    <AdminLayout title="Reports" subtitle="Generate college-level, department, class, and exam reports">

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {REPORT_TYPES.map((type, i) => {
          const Icon = type.icon;
          const isGen = generating === type.id;
          const isDone = generated === type.id;
          return (
            <motion.div key={type.id}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              className="rounded-2xl overflow-hidden"
              style={{ background:"var(--card)", border:`1px solid ${type.border}`, boxShadow:"var(--shadow)" }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom:`1px solid ${type.border}`, background:type.bg }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background:type.bg, border:`1px solid ${type.border}` }}>
                  <Icon size={18} style={{ color:type.color }}/>
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>{type.title}</h3>
                  <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>{type.desc}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Selector */}
                {type.selector === "dept" && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                           style={{ color:"var(--text-muted)" }}>Select Department</label>
                    <select value={selections.dept}
                      onChange={e => setSelections(s=>({...s,dept:e.target.value}))}
                      className="input-field text-sm">
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                )}
                {type.selector === "class" && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                           style={{ color:"var(--text-muted)" }}>Select Class</label>
                    <select value={selections.class}
                      onChange={e => setSelections(s=>({...s,class:e.target.value}))}
                      className="input-field text-sm">
                      <option value="">All Classes</option>
                      {ALL_CLASSES.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                {type.selector === "exam" && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                           style={{ color:"var(--text-muted)" }}>Select Exam</label>
                    <select value={selections.exam}
                      onChange={e => setSelections(s=>({...s,exam:e.target.value}))}
                      className="input-field text-sm">
                      <option value="">All Exams</option>
                      {ALL_EXAMS.map(e=><option key={e.id} value={e.title}>{e.title}</option>)}
                    </select>
                  </div>
                )}

                {/* Generate button */}
                <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                  onClick={() => handleGenerate(type.id)}
                  disabled={isGen}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: isDone ? "var(--success)" : `linear-gradient(135deg,${type.color},${type.color}cc)`,
                           boxShadow:`0 4px 12px ${type.color}30` }}>
                  {isGen ? (
                    <>
                      <motion.div animate={{ rotate:360 }}
                        transition={{ duration:0.7, repeat:Infinity, ease:"linear" }}
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"/>
                      Generating…
                    </>
                  ) : isDone ? (
                    <><CheckCircle size={14}/> Report Ready</>
                  ) : (
                    <><FileText size={13}/> Generate {type.title.split(" ")[0]} Report</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Report Preview */}
      <AnimatePresence mode="wait">
        {generated && (
          <motion.div key={generated}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:8 }}
            className="rounded-2xl overflow-hidden mb-6"
            style={{ background:"var(--card)", border:"1px solid rgba(37,99,235,0.25)", boxShadow:"var(--shadow)" }}>
            {/* Report header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom:"1px solid var(--border)", background:"var(--primary-muted)" }}>
              <div className="flex items-center gap-2">
                <FileText size={15} style={{ color:"var(--primary)" }}/>
                <div>
                  <h4 className="font-bold" style={{ color:"var(--text-primary)" }}>
                    {REPORT_TYPES.find(t=>t.id===generated)?.title} — Ready
                  </h4>
                  <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                    {getReportTitle(REPORT_TYPES.find(t=>t.id===generated))} · Generated {genTime}
                  </p>
                </div>
              </div>
              <span className="badge badge-success"><CheckCircle size={9}/> Ready</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label:"Students",   value:SYSTEM_STATS.totalStudents,    color:"var(--primary)", icon:Users         },
                  { label:"Violations", value:SYSTEM_STATS.totalViolations,  color:"var(--danger)",  icon:AlertTriangle },
                  { label:"Active Exams",value:SYSTEM_STATS.activeExams,     color:"var(--success)", icon:BookOpen      },
                  { label:"AI Accuracy",value:SYSTEM_STATS.aiAccuracy,       color:"var(--success)", icon:Zap           },
                ].map(({ label, value, color, icon:Icon }) => (
                  <div key={label} className="flex items-center gap-2 p-3 rounded-xl"
                    style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                    <Icon size={13} style={{ color }}/>
                    <div>
                      <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{label}</p>
                      <p className="text-sm font-bold" style={{ color }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title:"Violation Trend", chart:<ViolationTrendChart/> },
                  { title:"By Type",         chart:<ViolationTypesChart/> },
                  { title:"Risk Levels",     chart:<RiskPieChart/> },
                ].map(({ title, chart }) => (
                  <div key={title} className="rounded-xl p-3"
                    style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>
                      {title}
                    </p>
                    {chart}
                  </div>
                ))}
              </div>

              {/* Download buttons */}
              <div className="grid grid-cols-2 gap-2">
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white rounded-xl"
                  style={{ background:"var(--danger)" }}>
                  <Download size={12}/> Download PDF
                </motion.button>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white rounded-xl"
                  style={{ background:"var(--success)" }}>
                  <Download size={12}/> Download CSV
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 py-2 text-xs btn-secondary rounded-xl">
                  <Printer size={11}/> Print
                </button>
                <button className="flex items-center justify-center gap-2 py-2 text-xs btn-secondary rounded-xl">
                  <Share2 size={11}/> Share
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Analytics */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
        className="rounded-2xl p-5"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color:"var(--text-primary)" }}>
              Analytics Overview — All Departments
            </h3>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>Institution-wide combined data</p>
          </div>
          <BarChart3 size={15} style={{ color:"var(--text-muted)" }}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title:"Violation Trend",   chart:<ViolationTrendChart/> },
            { title:"By Type",           chart:<ViolationTypesChart/> },
            { title:"Risk Distribution", chart:<RiskPieChart/> },
          ].map(({ title, chart }) => (
            <div key={title}>
              <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color:"var(--text-muted)" }}>
                {title}
              </p>
              {chart}
            </div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
