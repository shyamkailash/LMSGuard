"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, AlertTriangle, Wifi, WifiOff, Zap, Activity } from "lucide-react";
import type { MonitoringStudent, NetworkStatus, StudentStatus } from "@/types";

interface RiskPalette { color:string; bar:string; border:string; badge:string; label:string; }
type RiskLevel = "safe"|"warn"|"danger";

const RISK_P: Record<RiskLevel, RiskPalette> = {
  safe:   { color:"#16A34A", bar:"risk-bar-safe",    border:"rgba(22,163,74,0.18)",  badge:"badge-success", label:"Safe"     },
  warn:   { color:"#D97706", bar:"risk-bar-warning", border:"rgba(217,119,6,0.18)",  badge:"badge-warning", label:"Warning"  },
  danger: { color:"#DC2626", bar:"risk-bar-danger",  border:"rgba(220,38,38,0.2)",   badge:"badge-danger",  label:"Critical" },
};

const NET_P: Record<NetworkStatus, { icon:typeof Wifi|typeof WifiOff; label:string; color:string }> = {
  stable:       { icon:Wifi,    label:"Stable",  color:"#16A34A" },
  weak:         { icon:Wifi,    label:"Weak",    color:"#D97706" },
  disconnected: { icon:WifiOff, label:"Offline", color:"#DC2626" },
};

function riskLevel(risk:number, status:StudentStatus): RiskLevel {
  if (status==="violation" || risk>=70) return "danger";
  if (status==="warning"   || risk>=35) return "warn";
  return "safe";
}

interface Props {
  student:       MonitoringStudent;
  index?:        number;
  onViewStudent?:(s:MonitoringStudent) => void;
}

export default function StudentCard({ student, index=0, onViewStudent }: Props) {
  const [hovered, setHovered] = useState(false);
  const risk    = student.risk ?? 0;
  const lvl     = riskLevel(risk, student.status);
  const rp      = RISK_P[lvl];
  const net     = (student.networkStatus ?? "stable") as NetworkStatus;
  const np      = NET_P[net];
  const NetIcon = np.icon;
  const offline = net === "disconnected";

  return (
    <motion.div
      initial={{ opacity:0, y:20, scale:0.96 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ duration:0.35, delay:index*0.04, ease:[0.4,0,0.2,1] as any }}
      whileHover={{ y:-4, transition:{ duration:0.2 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background:"var(--card)",
        border:`1px solid ${rp.border}`,
        boxShadow: hovered ? "var(--card-glow)" : "var(--shadow)",
        transition:"box-shadow 0.25s ease",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5"
           style={{ background:`linear-gradient(90deg,${rp.color},${rp.color}60)` }}/>

      {/* Screen preview */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50"
           style={{ aspectRatio:"16/9" }}>
        {offline ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background:"#FFF1F2" }}>
            <WifiOff size={22} style={{ color:"#EF4444", opacity:0.7 }}/>
            <p className="text-[10px] font-bold" style={{ color:"#DC2626" }}>Connection Lost</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 p-4 space-y-2 opacity-20">
              {[75,90,55,80,65].map((w,i) => (
                <div key={i} className="rounded-full bg-blue-200" style={{ width:`${w}%`, height:6 }}/>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity size={24} className="text-blue-200"/>
            </div>
          </div>
        )}

        {!offline && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EF4444]">
            <span className="w-1.5 h-1.5 rounded-full bg-white live-blink"/>
            <span className="text-white text-[9px] font-bold tracking-wider">LIVE</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 badge ${rp.badge} text-[10px]`}>
          {lvl==="safe" ? <CheckCircle size={9}/> : <AlertTriangle size={9}/>}
          {rp.label}
        </div>
        <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md"
          style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)", border:"2px solid white" }}>
          {student.avatar}
        </div>

        {/* Hover overlay */}
        <motion.div animate={{ opacity:hovered?1:0 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background:"rgba(15,23,42,0.45)" }}>
          <motion.button animate={{ scale:hovered?1:0.85 }}
            onClick={() => onViewStudent?.(student)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-lg"
            style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
            <Eye size={12}/> View
          </motion.button>
        </motion.div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color:"var(--text-primary)" }}>{student.name}</p>
            <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>{student.regno}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <motion.span animate={offline ? { scale:[1,1.3,1] } : {}}
              transition={{ duration:1.2, repeat:Infinity }}
              className="w-1.5 h-1.5 rounded-full" style={{ background:np.color }}/>
            <NetIcon size={10} style={{ color:np.color }}/>
            <span className="text-[10px] font-medium" style={{ color:np.color }}>{np.label}</span>
          </div>
        </div>
        <p className="text-[11px] truncate mb-2" style={{ color:"var(--text-secondary)" }}>{student.exam}</p>

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Zap size={9} style={{ color:rp.color }}/>
            <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>Risk</span>
          </div>
          <span className="text-xs font-bold" style={{ color:offline?"var(--text-muted)":rp.color }}>
            {offline ? "—" : `${risk}%`}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"var(--bg-subtle)" }}>
          <motion.div initial={{ width:0 }} animate={{ width:offline?"100%":`${risk}%` }}
            transition={{ duration:0.7, ease:"easeOut", delay:index*0.04+0.2 }}
            className={`h-full rounded-full ${offline ? "" : rp.bar}`}
            style={offline ? { background:"var(--border)" } : {}}/>
        </div>
        <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
          onClick={() => onViewStudent?.(student)}
          className="mt-3 w-full py-1.5 text-[11px] font-semibold rounded-xl"
          style={{ color:"var(--primary)", border:"1px solid var(--primary-border)", background:"var(--primary-soft)" }}>
          View Student
        </motion.button>
      </div>
    </motion.div>
  );
}
