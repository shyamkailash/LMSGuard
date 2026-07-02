"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Shield, Monitor, Cpu, Save, X, Plus, Users, BookOpen } from "lucide-react";

function Toggle({ on, onToggle }) {
  return (
    <motion.button whileTap={{ scale:0.92 }} onClick={onToggle}
      className="relative w-10 h-5 rounded-full transition-colors shrink-0"
      style={{ background: on ? "var(--primary)" : "var(--border)" }}>
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type:"spring", stiffness:500, damping:30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </motion.button>
  );
}

const DEFAULT_BLOCKED = ["VS Code", "Discord", "Telegram"];

export default function SettingsPage() {
  const [sessionClass,  setSessionClass]  = useState(null);
  const [sessionExam,   setSessionExam]   = useState(null);

  const [settings, setSettings] = useState({
    autoAlerts:    true,
    soundAlerts:   true,
    browserDetect: true,
    faceDetect:    true,
    idleDetect:    true,
    aiAnalysis:    true,
    screenCapture: true,
    autoReport:    false,
  });
  const [blocked,       setBlocked]       = useState(DEFAULT_BLOCKED);
  const [newApp,        setNewApp]        = useState("");
  const [idleTime,      setIdleTime]      = useState(60);
  const [shotInterval,  setShotInterval]  = useState(2);
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [saved,         setSaved]         = useState(false);

  useEffect(() => {
    try {
      const clsRaw  = sessionStorage.getItem("invSelectedClass");
      const examRaw = sessionStorage.getItem("invSelectedExam");
      if (clsRaw)  { const c = JSON.parse(clsRaw);  if (c?.id)  setSessionClass(c); }
      if (examRaw) { const e = JSON.parse(examRaw); if (e?.id)  setSessionExam(e);  }
    } catch { /* ignore */ }
  }, []);

  const toggle   = k  => setSettings(s => ({ ...s, [k]: !s[k] }));
  const removeApp = a => setBlocked(b => b.filter(x => x !== a));
  function addApp(e) {
    e.preventDefault();
    const v = newApp.trim();
    if (v && !blocked.includes(v)) { setBlocked(b => [...b, v]); setNewApp(""); }
  }
  async function handleSave() {
    setSaved(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaved(false);
  }

  const className = sessionClass?.label || "No class selected";
  const examTitle = sessionExam?.title  || "No exam selected";

  const SECTIONS = [
    {
      title:"Alert Settings", icon:Bell, color:"var(--warning)",
      items:[
        { key:"autoAlerts",  label:"Automatic Alerts",    desc:"Trigger alerts on violation detection for your class" },
        { key:"soundAlerts", label:"Sound Notifications", desc:"Audio alert on critical events"                       },
      ],
    },
    {
      title:"Detection Modules", icon:Shield, color:"var(--primary)",
      items:[
        { key:"browserDetect", label:"Browser Switch Detection", desc:"Detect tab and window changes"   },
        { key:"faceDetect",    label:"Face Detection",           desc:"Detect multiple or absent faces" },
        { key:"idleDetect",    label:"Idle Detection",           desc:"Flag inactive sessions"          },
        { key:"aiAnalysis",    label:"AI Behaviour Analysis",    desc:"Deep learning anomaly detection" },
      ],
    },
    {
      title:"Recording & Reports", icon:Monitor, color:"var(--primary)",
      items:[
        { key:"screenCapture", label:"Screen Capture",        desc:"Periodic screenshot capture"              },
        { key:"autoReport",    label:"Auto-generate Reports", desc:"Auto-report on exam completion for class" },
      ],
    },
  ];

  return (
    <DashboardLayout title="Settings" subtitle={`${className} · ${examTitle}`}>
      <div className="max-w-2xl space-y-5">

        {/* Scope banner */}
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex flex-wrap items-center gap-3 p-4 rounded-2xl"
          style={{ background:"var(--primary-muted)", border:"1px solid rgba(37,99,235,0.2)" }}>
          <Shield size={14} style={{ color:"var(--primary)" }}/>
          <div>
            <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
              Settings apply to your current session only
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs" style={{ color:"var(--primary)" }}>
                <Users size={10}/> {className}
              </span>
              <span className="text-xs" style={{ color:"var(--text-muted)" }}>·</span>
              <span className="flex items-center gap-1 text-xs" style={{ color:"var(--primary)" }}>
                <BookOpen size={10}/> {examTitle}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Toggle sections */}
        {SECTIONS.map(({ title, icon:Icon, color, items }, si) => (
          <motion.div key={title}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:si*0.09 }}
            className="rounded-2xl overflow-hidden"
            style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
            <div className="flex items-center gap-2 px-5 py-4"
                 style={{ borderBottom:"1px solid var(--border)" }}>
              <Icon size={14} style={{ color }}/>
              <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>{title}</h3>
            </div>
            <div className="p-3 space-y-0.5">
              {items.map(({ key, label, desc }) => (
                <div key={key}
                  className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors cursor-default"
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-deep)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div className="mr-3">
                    <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>{label}</p>
                    <p className="text-xs" style={{ color:"var(--text-muted)" }}>{desc}</p>
                  </div>
                  <Toggle on={settings[key]} onToggle={() => toggle(key)}/>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Blocked Applications */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center gap-2 px-5 py-4"
               style={{ borderBottom:"1px solid var(--border)" }}>
            <Shield size={14} style={{ color:"var(--danger)" }}/>
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
              Blocked Applications
            </h3>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {blocked.map(app => (
                <motion.div key={app} initial={{ scale:0 }} animate={{ scale:1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
                  style={{ background:"var(--danger-muted)", border:"1px solid rgba(220,38,38,0.2)",
                           color:"var(--danger)" }}>
                  <button onClick={() => removeApp(app)} className="shrink-0">
                    <X size={10}/>
                  </button>
                  {app}
                </motion.div>
              ))}
            </div>
            <form onSubmit={addApp} className="flex gap-2">
              <input value={newApp} onChange={e => setNewApp(e.target.value)}
                placeholder="Add blocked application…"
                className="input-field flex-1 text-sm"/>
              <button type="submit" className="btn-primary px-3 py-2 text-xs">
                <Plus size={13}/>
              </button>
            </form>
          </div>
        </motion.div>

        {/* Thresholds */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}
          className="rounded-2xl overflow-hidden"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center gap-2 px-5 py-4"
               style={{ borderBottom:"1px solid var(--border)" }}>
            <Cpu size={14} style={{ color:"var(--success)" }}/>
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
              Thresholds &amp; Timing
            </h3>
          </div>
          <div className="p-5 space-y-5">
            {[
              { label:"Idle Time",            unit:"sec", value:idleTime,      set:setIdleTime,      min:10, max:300, step:10 },
              { label:"Screenshot Interval",  unit:"sec", value:shotInterval,  set:setShotInterval,  min:1,  max:30,  step:1  },
              { label:"Risk Alert Threshold", unit:"%",   value:riskThreshold, set:setRiskThreshold, min:10, max:100, step:5  },
            ].map(({ label, unit, value, set, min, max, step }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm" style={{ color:"var(--text-secondary)" }}>{label}</label>
                  <span className="text-sm font-bold" style={{ color:"var(--text-primary)" }}>
                    {value}{unit}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor:"var(--primary)", background:"var(--border)" }}/>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
          onClick={handleSave}
          className="w-full py-3 font-bold text-sm rounded-2xl text-white flex items-center justify-center gap-2 transition-all"
          style={{
            background: saved ? "var(--success)" : "var(--primary)",
            boxShadow: "0 4px 15px rgba(37,99,235,0.25)",
          }}>
          {saved ? <>✓ Settings Saved</> : <><Save size={14}/> Save Settings</>}
        </motion.button>

      </div>
    </DashboardLayout>
  );
}
