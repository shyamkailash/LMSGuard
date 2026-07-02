"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import {
  Shield, Bell, Monitor, Cpu, Save, X, Plus,
  Wifi, Lock, Eye, Zap, Server
} from "lucide-react";

function Toggle({ on, onToggle }) {
  return (
    <motion.button whileTap={{ scale:0.92 }} onClick={onToggle}
      className="relative w-10 h-5 rounded-full transition-colors shrink-0"
      style={{ background: on ? "var(--primary)" : "var(--border)" }}>
      <motion.div animate={{ x: on ? 20 : 2 }}
        transition={{ type:"spring", stiffness:500, damping:30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"/>
    </motion.button>
  );
}

const DEFAULT_BLOCKED = ["VS Code", "Discord", "Telegram", "WhatsApp", "Zoom"];

export default function AdminSettingsPage() {
  const [aiSettings, setAiSettings] = useState({
    aiEngine:         true,
    faceDetection:    true,
    browserDetection: true,
    idleDetection:    true,
    screenCapture:    true,
    autoReport:       true,
    emailAlerts:      true,
    networkMonitor:   true,
  });
  const [blocked,      setBlocked]      = useState(DEFAULT_BLOCKED);
  const [newApp,       setNewApp]       = useState("");
  const [riskThresh,   setRiskThresh]   = useState(70);
  const [shotInterval, setShotInterval] = useState(2);
  const [idleTime,     setIdleTime]     = useState(60);
  const [maxRetries,   setMaxRetries]   = useState(3);
  const [networkRules, setNetworkRules] = useState({
    autoExtraTime:    true,
    notifyOnDisconn:  true,
    graceSeconds:     30,
  });
  const [saved, setSaved] = useState(false);

  const toggle = k => setAiSettings(s => ({ ...s, [k]:!s[k] }));

  function removeApp(a) { setBlocked(b => b.filter(x => x !== a)); }
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

  const SECTIONS = [
    {
      title:"AI Detection Modules", icon:Zap, color:"var(--primary)",
      items:[
        { key:"aiEngine",         label:"AI Engine",              desc:"Core AI monitoring engine — global"               },
        { key:"faceDetection",    label:"Face Detection",         desc:"Detect multiple or absent faces system-wide"      },
        { key:"browserDetection", label:"Browser Switch",         desc:"Detect tab and window switching"                  },
        { key:"idleDetection",    label:"Idle Detection",         desc:"Flag inactive student sessions"                   },
        { key:"screenCapture",    label:"Screen Capture",         desc:"Periodic automated screenshots"                   },
      ],
    },
    {
      title:"Alert & Reports", icon:Bell, color:"var(--warning)",
      items:[
        { key:"autoReport",   label:"Auto-generate Reports", desc:"Auto-report when exam ends"                    },
        { key:"emailAlerts",  label:"Email Alerts",          desc:"Send email to invigilators on critical alerts"  },
      ],
    },
    {
      title:"Network Monitoring", icon:Wifi, color:"var(--primary)",
      items:[
        { key:"networkMonitor",  label:"Network Monitor",      desc:"Detect student network disconnections"        },
        { key:"notifyOnDisconn", label:"Notify on Disconnect",  desc:"Popup alert when student goes offline", isNet:true },
        { key:"autoExtraTime",   label:"Auto Extra Time Prompt",desc:"Prompt invigilator to grant extra time",  isNet:true },
      ],
    },
  ];

  return (
    <AdminLayout title="System Settings" subtitle="Admin-level system configuration — full control">

      {/* Admin scope banner */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="flex items-center gap-3 p-4 rounded-2xl mb-5"
        style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(27,77,30,0.2)" }}>
        <Shield size={15} style={{ color:"var(--primary)" }}/>
        <div>
          <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
            Admin System Settings
          </p>
          <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
            Changes apply to the entire platform — all classes, all invigilators
          </p>
        </div>
      </motion.div>

      <div className="max-w-2xl space-y-5">
        {/* Toggle Sections */}
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
              {items.map(({ key, label, desc, isNet }) => (
                <div key={key}
                  className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors cursor-default"
                  onMouseEnter={e => e.currentTarget.style.background="var(--bg-deep)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div className="mr-3">
                    <p className="text-sm font-medium" style={{ color:"var(--text-primary)" }}>{label}</p>
                    <p className="text-xs" style={{ color:"var(--text-muted)" }}>{desc}</p>
                  </div>
                  <Toggle
                    on={isNet ? networkRules[key] : aiSettings[key]}
                    onToggle={() => isNet
                      ? setNetworkRules(r => ({ ...r, [key]:!r[key] }))
                      : toggle(key)
                    }
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Blocked Applications */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center gap-2 px-5 py-4"
               style={{ borderBottom:"1px solid var(--border)" }}>
            <Lock size={14} style={{ color:"var(--danger)" }}/>
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
              Blocked Applications — System Wide
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
                placeholder="Add blocked application…" className="input-field flex-1 text-sm"/>
              <button type="submit" className="btn-primary px-3 py-2 text-xs">
                <Plus size={13}/>
              </button>
            </form>
          </div>
        </motion.div>

        {/* Threshold Sliders */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}
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
              { label:"AI Risk Threshold",     unit:"%",  value:riskThresh,   set:setRiskThresh,   min:10,  max:100, step:5  },
              { label:"Screenshot Interval",   unit:"sec",value:shotInterval, set:setShotInterval, min:1,   max:30,  step:1  },
              { label:"Idle Detection Time",   unit:"sec",value:idleTime,     set:setIdleTime,     min:10,  max:300, step:10 },
              { label:"Network Retry Attempts",unit:"",   value:maxRetries,   set:setMaxRetries,   min:1,   max:10,  step:1  },
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

        {/* Network Grace Period */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}
          className="rounded-2xl overflow-hidden"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center gap-2 px-5 py-4"
               style={{ borderBottom:"1px solid var(--border)" }}>
            <Wifi size={14} style={{ color:"var(--primary)" }}/>
            <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
              Network Grace Period
            </h3>
          </div>
          <div className="p-5">
            <div className="flex justify-between mb-2">
              <label className="text-sm" style={{ color:"var(--text-secondary)" }}>
                Grace seconds before flagging disconnect
              </label>
              <span className="text-sm font-bold" style={{ color:"var(--text-primary)" }}>
                {networkRules.graceSeconds}s
              </span>
            </div>
            <input type="range" min={5} max={120} step={5} value={networkRules.graceSeconds}
              onChange={e => setNetworkRules(r=>({...r,graceSeconds:Number(e.target.value)}))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor:"var(--primary)", background:"var(--border)" }}/>
            <p className="text-xs mt-2" style={{ color:"var(--text-muted)" }}>
              Student has {networkRules.graceSeconds}s to reconnect before invigilator is alerted
            </p>
          </div>
        </motion.div>

        {/* Save */}
        <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
          onClick={handleSave}
          className="w-full py-3 font-bold text-sm rounded-2xl text-white flex items-center justify-center gap-2 transition-all"
          style={{
            background: saved ? "var(--success)" : "linear-gradient(135deg,#1B4D1E,#0F2D12)",
            boxShadow: "0 4px 15px rgba(27,77,30,0.25)",
          }}>
          {saved ? <>✓ Settings Saved — Applied System Wide</> : <><Save size={14}/> Save System Settings</>}
        </motion.button>
      </div>
    </AdminLayout>
  );
}
