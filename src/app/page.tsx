"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Eye, Shield, ArrowRight, Lock, CheckCircle } from "lucide-react";

const PORTALS = [
  {
    role:"Student", icon:GraduationCap, href:"/student/login",
    color:"#16A34A", border:"rgba(22,163,74,0.2)", soft:"#F0FDF4",
    desc:"Access your scheduled exams, attempt questions, and submit responses.",
    features:["View Assessments","Attempt Questions","Submit Exam"],
  },
  {
    role:"Invigilator", icon:Eye, href:"/login",
    color:"#2563EB", border:"rgba(37,99,235,0.2)", soft:"#EFF6FF",
    desc:"Monitor your assigned class live with AI alerts and network issue handling.",
    features:["Choose Class & Exam","Live AI Monitoring","Alerts & Reports"],
    highlight:true,
  },
  {
    role:"Admin", icon:Shield, href:"/admin/login",
    color:"#7C3AED", border:"rgba(124,58,237,0.2)", soft:"#F5F3FF",
    desc:"Full system control — users, departments, exams, and system-wide reports.",
    features:["Manage Users","Create Exams","System Reports"],
    badge:"",
  },
];

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background:"var(--bg)" }}>
      {/* Soft gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-80"
          style={{ background:"linear-gradient(180deg,#EFF6FF 0%,transparent 100%)" }}/>
        <div className="absolute top-16 right-16 w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{ background:"#BFDBFE" }}/>
        <div className="absolute bottom-16 left-16 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background:"#DDD6FE" }}/>
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-8 py-4"
        style={{ borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)" }}>
        <div className="flex items-center gap-3">
          {/* ── College logo placeholder — replace with actual logo ── */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
               style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
            <Shield size={17} className="text-white"/>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text-primary)" }}>LMSGuard AI</p>
            <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
              Examination Monitoring System
            </p>
          </div>
        </div>
        
      </div>

      {/* Hero */}
      <div className="relative max-w-5xl mx-auto px-8 pt-16 pb-12 text-center">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>
          {/* ── College logo placeholder — replace with actual logo ── */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                 style={{ background:"var(--bg-subtle)", border:"1.5px dashed var(--border)" }}
                 title="College logo placeholder">
              {/* Replace with: <img src="/college-logo.png" alt="College Logo" className="w-full h-full object-contain rounded-2xl"/> */}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background:"var(--primary-soft)", color:"var(--primary)", border:"1px solid var(--primary-border)" }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:"var(--success)" }}/>
            AI Powered · Real-time Monitoring · Secure
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight tracking-tight"
            style={{ color:"var(--text-primary)" }}>
            AI Examination
            <span className="block" style={{ color:"var(--primary)" }}>Monitoring System</span>
          </h1>
          <p className="text-base max-w-xl mx-auto mb-3" style={{ color:"var(--text-secondary)" }}>
            LMSGuard AI — AI-powered proctoring and live monitoring platform for online examinations.
            Select your portal to continue.
          </p>
        </motion.div>
      </div>

      {/* Portal cards */}
      <div className="relative max-w-5xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PORTALS.map(({ role, icon:Icon, href, color, border, soft, desc, features, badge, highlight }, i) => (
            <motion.div key={role}
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.15+i*0.1, duration:0.45, ease:[0.4,0,0.2,1] }}
              whileHover={{ y:-6, transition:{ duration:0.2 } }}>
              <Link href={href} className="block h-full">
                <div className="relative h-full rounded-2xl p-6 cursor-pointer overflow-hidden group"
                  style={{
                    background: highlight?"linear-gradient(135deg,#2563EB,#1D4ED8)":"var(--card)",
                    border:`1.5px solid ${highlight?"transparent":border}`,
                    boxShadow: highlight
                      ? "0 20px 60px rgba(37,99,235,0.3), 0 8px 24px rgba(37,99,235,0.2)"
                      : "var(--shadow-md)",
                  }}>
                  {/* Decorative */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                    style={{ background:highlight?"white":color }}/>

                  {badge && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{
                        background: highlight?"rgba(255,255,255,0.2)":soft,
                        color:      highlight?"white":color,
                        border:    `1px solid ${highlight?"rgba(255,255,255,0.3)":border}`,
                      }}>
                      <Lock size={8}/> {badge}
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{
                      background: highlight?"rgba(255,255,255,0.2)":soft,
                      border:    `1px solid ${highlight?"rgba(255,255,255,0.25)":border}`,
                    }}>
                    <Icon size={22} style={{ color:highlight?"white":color }}/>
                  </div>

                  <h2 className="text-lg font-bold mb-1"
                    style={{ color:highlight?"white":"var(--text-primary)" }}>
                    {role} Portal
                  </h2>
                  <p className="text-xs mb-5 leading-relaxed"
                    style={{ color:highlight?"rgba(255,255,255,0.75)":"var(--text-muted)" }}>
                    {desc}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    {features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle size={12} style={{ color:highlight?"rgba(255,255,255,0.8)":color, flexShrink:0 }}/>
                        <span className="text-xs"
                          style={{ color:highlight?"rgba(255,255,255,0.8)":"var(--text-secondary)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm"
                    style={{
                      background: highlight?"rgba(255,255,255,0.15)":soft,
                      color:      highlight?"white":color,
                      border:    `1px solid ${highlight?"rgba(255,255,255,0.2)":border}`,
                    }}>
                    <span>Enter Portal</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative text-center pb-8">
        <p className="text-xs" style={{ color:"var(--text-muted)" }}>
          LMSGuard AI v2.0 · Examination Monitoring Platform
        </p>
      </div>
    </div>
  );
}
