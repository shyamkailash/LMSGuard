"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { ViolationTrendChart, RiskPieChart } from "@/components/Charts";
import {
  Users, Eye, BookOpen, AlertTriangle, Server,
  Wifi, Cpu, Shield, Activity, ChevronRight,
  GraduationCap, Building2, Zap, Monitor
} from "lucide-react";
import { SYSTEM_STATS, ALL_VIOLATIONS, ACTIVE_SESSIONS, ALL_STUDENTS, ALL_INVIGILATORS } from "@/data/adminData";

function StatCard({ title, value, icon:Icon, color, bg, border, subtitle, index=0 }) {
  return (
    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:index*0.07 }}
      whileHover={{ y:-3, transition:{ duration:0.18 } }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background:"var(--card)", border:`1px solid ${border}`, boxShadow:"var(--shadow)" }}>
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-40" style={{ background:bg }}/>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>
            {title}
          </p>
          <p className="text-3xl font-bold" style={{ color:"var(--text-primary)" }}>{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color:"var(--text-muted)" }}>{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background:bg, border:`1px solid ${border}` }}>
          <Icon size={17} style={{ color }}/>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    try { const r = sessionStorage.getItem("adminProfile"); if (r) setAdmin(JSON.parse(r)); } catch {}
  }, []);

  const recentViolations = ALL_VIOLATIONS.slice(0,5);
  const activeSessions   = ACTIVE_SESSIONS.filter(s => s.status==="active");

  const SEV = { critical:"badge-danger", medium:"badge-warning", warning:"badge-warning" };

  return (
    <AdminLayout title="Admin Dashboard" subtitle="System-wide overview — Full Control">
      {/* Welcome */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,rgba(27,77,30,0.12),rgba(37,99,235,0.08))",
                 border:"1px solid rgba(27,77,30,0.2)" }}>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-10 pointer-events-none"
             style={{ background:"var(--primary)" }}/>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color:"var(--primary)" }}>
            Admin Control Panel 🛡️
          </p>
          <h2 className="text-xl font-bold mb-1" style={{ color:"var(--text-primary)" }}>
            Welcome, {admin?.name || "Administrator"}
          </h2>
          <p className="text-sm" style={{ color:"var(--text-muted)" }}>
            {admin?.role} · Full system access · All departments and exams visible
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard title="Total Students"    value={SYSTEM_STATS.totalStudents}     icon={GraduationCap} color="var(--primary)" bg="var(--primary-muted)" border="rgba(37,99,235,0.18)"   subtitle="All departments" index={0}/>
        <StatCard title="Invigilators"      value={SYSTEM_STATS.totalInvigilators} icon={Eye}           color="var(--primary)"  bg="var(--purple-muted)"  border="rgba(124,58,237,0.18)"  subtitle="System-wide"     index={1}/>
        <StatCard title="Active Exams"      value={SYSTEM_STATS.activeExams}       icon={BookOpen}      color="var(--success)" bg="var(--success-muted)" border="rgba(22,163,74,0.18)"   subtitle="Ongoing now"     index={2}/>
        <StatCard title="Total Violations"  value={SYSTEM_STATS.totalViolations}   icon={AlertTriangle} color="var(--danger)"  bg="var(--danger-muted)"  border="rgba(220,38,38,0.18)"   subtitle="Today"           index={3}/>
      </div>

      {/* System status + active sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* System Status */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color:"var(--text-muted)" }}>System Status</h3>
          <div className="space-y-2.5">
            {[
              { label:"AI Engine",     value:"Running",   icon:Cpu,      color:"var(--success)" },
              { label:"Server",        value:"Stable",    icon:Server,   color:"var(--success)" },
              { label:"Network",       value:"Online",    icon:Wifi,     color:"var(--success)" },
              { label:"AI Accuracy",   value:SYSTEM_STATS.aiAccuracy,   icon:Zap,      color:"var(--primary)"  },
              { label:"Server Uptime", value:SYSTEM_STATS.serverUptime, icon:Activity, color:"var(--success)" },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} className="flex items-center justify-between py-1.5"
                   style={{ borderBottom:"1px solid var(--border-soft)" }}>
                <div className="flex items-center gap-2">
                  <Icon size={12} style={{ color:"var(--text-muted)" }}/>
                  <span className="text-sm" style={{ color:"var(--text-secondary)" }}>{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:color }}/>
                  <span className="text-sm font-semibold" style={{ color }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Monitoring Sessions */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.37 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider"
                style={{ color:"var(--text-muted)" }}>Active Monitoring Sessions</h3>
            <a href="/admin/monitoring" className="text-xs font-medium" style={{ color:"var(--primary)" }}>
              View all
            </a>
          </div>
          <div className="space-y-2">
            {activeSessions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.37+i*0.07 }}
                className="flex items-center justify-between p-2.5 rounded-xl"
                style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                <div className="flex items-center gap-2 min-w-0">
                  <Monitor size={12} style={{ color:"var(--primary)" }}/>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color:"var(--text-primary)" }}>
                      {s.class} · {s.exam}
                    </p>
                    <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                      {s.invigilator} · {s.students} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {s.violations > 0 && (
                    <span className="badge badge-danger text-[9px]">{s.violations}</span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:"var(--success)" }}/>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}
          className="lg:col-span-2 rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
                Violation Trend — System Wide
              </h3>
              <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>All departments combined</p>
            </div>
            <div className="flex gap-3">
              {[["Violations","var(--danger)"],["Safe","var(--success)"]].map(([l,c])=>(
                <div key={l} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background:c }}/>
                  <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ViolationTrendChart/>
        </motion.div>
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color:"var(--text-primary)" }}>Risk Distribution</h3>
          <p className="text-[11px] mb-2" style={{ color:"var(--text-muted)" }}>All students</p>
          <RiskPieChart/>
        </motion.div>
      </div>

      {/* Recent Violations + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Violations */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.56 }}
          className="lg:col-span-2 rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>
                Recent Violations — All Classes
              </h3>
              <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>System-wide detection</p>
            </div>
            <a href="/admin/violations"
               className="flex items-center gap-1 text-xs font-medium" style={{ color:"var(--primary)" }}>
              View all <ChevronRight size={11}/>
            </a>
          </div>
          <div className="space-y-2">
            {recentViolations.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4D1E] to-[#F5C800]
                                flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {v.studentName.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate" style={{ color:"var(--text-primary)" }}>
                      {v.studentName}
                    </p>
                    <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>{v.class}</span>
                    <span className={`badge ${SEV[v.severity]||"badge-warning"} text-[9px]`}>{v.severity}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color:"var(--text-muted)" }}>
                    {v.type} · {v.exam}
                  </p>
                </div>
                <span className="text-[11px] font-mono shrink-0" style={{ color:"var(--text-muted)" }}>
                  {v.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
          className="rounded-2xl p-4"
          style={{ background:"var(--card)", border:"1px solid var(--border)", boxShadow:"var(--shadow)" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color:"var(--text-primary)" }}>Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label:"Manage Students",    href:"/admin/students",     icon:GraduationCap, color:"var(--primary)",  bg:"var(--primary-muted)"  },
              { label:"Manage Invigilators",href:"/admin/invigilators", icon:Eye,           color:"var(--primary)",   bg:"var(--purple-muted)"   },
              { label:"Manage Exams",       href:"/admin/exams",        icon:BookOpen,      color:"var(--success)",  bg:"var(--success-muted)"  },
              { label:"View Classes",       href:"/admin/classes",      icon:Building2,     color:"var(--warning)",  bg:"var(--warning-muted)"  },
              { label:"Generate Reports",   href:"/admin/reports",      icon:Activity,      color:"var(--danger)",   bg:"var(--danger-muted)"   },
              { label:"System Settings",    href:"/admin/settings",     icon:Shield,        color:"var(--text-secondary)", bg:"var(--bg-deep)"   },
            ].map(({ label, href, icon:Icon, color, bg }) => (
              <a key={href} href={href}>
                <motion.div whileHover={{ x:3 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                  style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                       style={{ background:bg }}>
                    <Icon size={13} style={{ color }}/>
                  </div>
                  <span className="text-sm font-medium" style={{ color:"var(--text-secondary)" }}>{label}</span>
                  <ChevronRight size={12} className="ml-auto" style={{ color:"var(--text-muted)" }}/>
                </motion.div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
