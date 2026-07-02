"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ViolationTrendChart, ViolationTypesChart, RiskPieChart } from "@/components/Charts";
import {
  FileText, Download, Users, AlertTriangle, CheckCircle,
  Zap, Printer, Share2, BarChart3, Shield, BookOpen,
  Calendar, Clock, AlertCircle
} from "lucide-react";
import { CLASS_STUDENTS, CLASS_VIOLATIONS } from "@/data/invigilatorData";

export default function ReportsPage() {
  const router = useRouter();
  const [sessionClass,  setSessionClass]  = useState(null);
  const [sessionExam,   setSessionExam]   = useState(null);
  const [students,      setStudents]      = useState([]);
  const [violations,    setViolations]    = useState([]);
  const [generating,    setGenerating]    = useState(false);
  const [reportReady,   setReportReady]   = useState(false);
  const [ready,         setReady]         = useState(false);

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
      setStudents(CLASS_STUDENTS[cls.id]   || []);
      setViolations(CLASS_VIOLATIONS[cls.id] || []);
      setReady(true);
    }
  }, []);

  async function handleGenerate() {
    setReportReady(false);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    setGenerating(false);
    setReportReady(true);
  }

  if (!ready) {
    return (
      <DashboardLayout title="Reports" subtitle="No active session">
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

  const totalStudents   = students.length;
  const totalViolations = violations.length;
  const criticalCount   = violations.filter(v => v.severity==="critical").length;
  const mediumCount     = violations.filter(v => v.severity==="medium").length;
  const warningCount    = violations.filter(v => v.severity==="warning").length;
  const safeCount       = students.filter(s => s.status==="safe").length;
  const atRiskCount     = students.filter(s => s.status!=="safe").length;

  const REPORT_STATS = [
    { label:"Total Students",   value:totalStudents,   color:"var(--primary)",  icon:Users         },
    { label:"Total Violations", value:totalViolations, color:"var(--danger)",   icon:AlertTriangle },
    { label:"Critical",         value:criticalCount,   color:"var(--danger)",   icon:AlertTriangle },
    { label:"Medium",           value:mediumCount,     color:"var(--warning)",  icon:AlertTriangle },
    { label:"Low / Warning",    value:warningCount,    color:"var(--warning)",  icon:AlertTriangle },
    { label:"Safe Students",    value:safeCount,       color:"var(--success)",  icon:CheckCircle   },
    { label:"At-Risk Students", value:atRiskCount,     color:"var(--danger)",   icon:Shield        },
    { label:"AI Accuracy",      value:"98.5%",         color:"var(--success)",  icon:Zap           },
  ];

  return (
    <DashboardLayout title="Reports"
      subtitle={`${sessionClass?.label} · ${sessionExam?.title}`}>

      {/* Scope banner */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex flex-wrap items-center gap-3 p-4 rounded-2xl mb-6"
        style={{ background:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.04))",
                 border:"1px solid rgba(37,99,235,0.2)" }}>
        <Shield size={14} style={{ color:"var(--primary)" }}/>
        <div>
          <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
            Report scope:{" "}
            <span style={{ color:"var(--primary)" }}>{sessionClass?.label}</span>
            {" "}·{" "}
            <span style={{ color:"var(--primary)" }}>{sessionExam?.title}</span>
          </p>
          <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
            Restricted to your selected class and exam only
          </p>
        </div>
      </motion.div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Students",    value:totalStudents,   color:"var(--primary)", border:"rgba(37,99,235,0.18)", icon:Users         },
          { label:"Violations",  value:totalViolations, color:"var(--danger)",  border:"rgba(220,38,38,0.18)", icon:AlertTriangle },
          { label:"Critical",    value:criticalCount,   color:"var(--danger)",  border:"rgba(220,38,38,0.18)", icon:AlertTriangle },
          { label:"AI Accuracy", value:"98.5%",         color:"var(--success)", border:"rgba(22,163,74,0.18)", icon:Zap           },
        ].map(({ label, value, color, border, icon:Icon }, i) => (
          <motion.div key={label}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            className="rounded-2xl p-4"
            style={{ background:"var(--card)", border:`1px solid ${border}`, boxShadow:"var(--shadow)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider" style={{ color:"var(--text-muted)" }}>{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                   style={{ background:`${color}20` }}>
                <Icon size={12} style={{ color }}/>
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color:"var(--text-primary)" }}>{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Generate card */}
        <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="px-5 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-deep)" }}>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:"var(--text-primary)" }}>
              <FileText size={14} style={{ color:"var(--primary)" }}/> Generate Exam Report
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color:"var(--text-muted)" }}>
              Report is scoped to your selected class and exam only
            </p>
          </div>
          <div className="p-5">
            {/* Session info */}
            <div className="rounded-xl p-4 mb-4 space-y-2.5"
                 style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
              {[
                { label:"Class",      value:sessionClass?.label,              color:"var(--primary)"        },
                { label:"Department", value:sessionClass?.dept,               color:"var(--text-secondary)" },
                { label:"Exam",       value:sessionExam?.title,               color:"var(--primary)"        },
                { label:"Date",       value:sessionExam?.date,                color:"var(--text-secondary)" },
                { label:"Time",       value:`${sessionExam?.startTime} – ${sessionExam?.endTime}`,
                                                                              color:"var(--text-secondary)" },
                { label:"Students",   value:totalStudents,                    color:"var(--text-primary)"   },
                { label:"Violations", value:totalViolations,                  color:"var(--danger)"         },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span style={{ color:"var(--text-muted)" }}>{label}</span>
                  <span className="font-semibold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Violation breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label:"Critical", value:criticalCount, color:"var(--danger)",  bg:"var(--danger-muted)"  },
                { label:"Medium",   value:mediumCount,   color:"var(--warning)", bg:"var(--warning-muted)" },
                { label:"Low",      value:warningCount,  color:"var(--success)", bg:"var(--success-muted)" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className="rounded-xl p-2.5 text-center"
                  style={{ background:bg, border:`1px solid ${color}30` }}>
                  <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-[10px] font-medium" style={{ color }}>{label}</p>
                </div>
              ))}
            </div>

            <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
              onClick={handleGenerate} disabled={generating}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
                       boxShadow:"0 4px 12px rgba(37,99,235,0.25)" }}>
              {generating ? (
                <>
                  <motion.div animate={{ rotate:360 }}
                    transition={{ duration:0.7, repeat:Infinity, ease:"linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"/>
                  Generating…
                </>
              ) : (
                <><FileText size={13}/> Generate Report</>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.28 }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color:"var(--text-muted)" }}>Report Preview</h3>
          <AnimatePresence mode="wait">
            {!reportReady && !generating && (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="rounded-2xl p-10 flex flex-col items-center text-center"
                style={{ background:"var(--card)", border:"2px dashed var(--border)" }}>
                <FileText size={32} className="mb-3" style={{ color:"var(--border)" }}/>
                <p className="font-medium" style={{ color:"var(--text-secondary)" }}>No report generated</p>
                <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
                  Click Generate to create report for<br/>
                  <strong>{sessionClass?.label}</strong>
                </p>
              </motion.div>
            )}
            {generating && (
              <motion.div key="gen" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="rounded-2xl p-10 flex flex-col items-center justify-center"
                style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <motion.div animate={{ rotate:360 }}
                  transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                  className="w-12 h-12 rounded-full mb-4"
                  style={{ border:"3px solid var(--border)", borderTopColor:"var(--primary)" }}/>
                <p className="font-semibold" style={{ color:"var(--text-primary)" }}>Generating Report</p>
                <p className="text-sm mt-1" style={{ color:"var(--text-muted)" }}>
                  Analysing {totalStudents} students from {sessionClass?.label}…
                </p>
              </motion.div>
            )}
            {reportReady && (
              <motion.div key="report" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                className="rounded-2xl overflow-hidden"
                style={{ background:"var(--card)", border:"1px solid rgba(37,99,235,0.25)",
                         boxShadow:"var(--shadow)" }}>
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ background:"var(--primary-muted)", borderBottom:"1px solid var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <FileText size={14} style={{ color:"var(--primary)" }}/>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>
                        Exam Report — Ready
                      </h4>
                      <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                        {sessionExam?.title} · {sessionClass?.label} · {sessionExam?.date}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success"><CheckCircle size={9}/> Ready</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {REPORT_STATS.map(({ label, value, color, icon:Icon }) => (
                      <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl"
                        style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                        <Icon size={11} style={{ color }}/>
                        <div className="min-w-0">
                          <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>{label}</p>
                          <p className="text-sm font-bold truncate" style={{ color }}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3"
                    style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-2"
                       style={{ color:"var(--text-muted)" }}>Violation Breakdown</p>
                    <ViolationTypesChart/>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white rounded-xl"
                      style={{ background:"var(--danger)" }}>
                      <Download size={12}/> Download PDF
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white rounded-xl"
                      style={{ background:"var(--success)" }}>
                      <Download size={12}/> Download CSV
                    </button>
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
        </motion.div>
      </div>

      {/* Analytics */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
        className="rounded-2xl p-5"
        style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color:"var(--text-primary)" }}>
              Analytics — {sessionClass?.label}
            </h3>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              {sessionExam?.title} only
            </p>
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
              <p className="text-[11px] uppercase tracking-wider mb-2"
                 style={{ color:"var(--text-muted)" }}>{title}</p>
              {chart}
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
