"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import BackendLiveMonitoringPanel from "@/components/BackendLiveMonitoringPanel";
import { fetchJson } from "@/lib/api";
import {
  AlertTriangle, Shield, Activity, ChevronRight,
  GraduationCap, Eye, BookOpen, Zap, Monitor, Database, Wifi
} from "lucide-react";
import { ACTIVE_SESSIONS } from "@/data/adminData";

type DashboardSummary = {
  database: string;
  total_events: number;
  total_live_alerts: number;
  high_risk_alerts: number;
};

function StatCard({ title, value, icon: Icon, color, bg, border, subtitle = "", index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background: "var(--card)", border: `1px solid ${border}`, boxShadow: "var(--shadow)" }}>
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-40" style={{ background: bg }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: bg, border: `1px solid ${border}` }}>
          <Icon size={17} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchJson<DashboardSummary>("/api/dashboard-summary");
        setSummary(data);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    }
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <AdminLayout title="Admin Dashboard" subtitle="LMSGuard Live Console — System-Wide Overview">

      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(124,58,237,0.07))",
                 border: "1px solid rgba(37,99,235,0.2)" }}>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--primary)" }}>
              Admin Security Controls
            </p>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              LMSGuard Live Console
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Real-Time Exam Monitoring · Full System Access
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
               style={{
                 background: connected ? "var(--success-muted)" : "var(--danger-muted)",
                 color: connected ? "var(--success)" : "var(--danger)",
                 border: "1px solid var(--border)",
               }}>
            <Wifi size={14} />
            {connected ? "Backend Connected" : "Backend Disconnected"}
          </div>
        </div>
      </motion.div>

      {/* Real-time metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Events"     value={summary?.total_events ?? "—"}
          icon={Activity}      color="var(--primary)"  bg="var(--primary-muted)"  border="rgba(37,99,235,0.18)"  subtitle="Student agent events" index={0} />
        <StatCard title="Live Alerts"      value={summary?.total_live_alerts ?? "—"}
          icon={AlertTriangle} color="var(--warning)"  bg="var(--warning-muted)"  border="rgba(245,158,11,0.18)" subtitle="From monitoring engine" index={1} />
        <StatCard title="High Risk Alerts" value={summary?.high_risk_alerts ?? "—"}
          icon={Shield}        color="var(--danger)"   bg="var(--danger-muted)"   border="rgba(220,38,38,0.18)"  subtitle="Require attention" index={2} />
        <StatCard title="Database"         value={connected ? "Connected" : "Offline"}
          icon={Database}      color={connected ? "var(--success)" : "var(--danger)"}
          bg={connected ? "var(--success-muted)" : "var(--danger-muted)"}
          border={connected ? "rgba(22,163,74,0.18)" : "rgba(220,38,38,0.18)"}
          subtitle={summary?.database ?? "SQLite"} index={3} />
      </div>

      {/* Live monitoring panel (real backend data) */}
      <BackendLiveMonitoringPanel />

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-6 rounded-2xl p-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>
          Admin Security Controls
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: "Examination Security Panel", href: "/admin/monitoring",   icon: Monitor,       color: "var(--primary)",        bg: "var(--primary-muted)"  },
            { label: "Manage Students",             href: "/admin/students",    icon: GraduationCap, color: "var(--success)",        bg: "var(--success-muted)"  },
            { label: "Manage Invigilators",         href: "/admin/invigilators",icon: Eye,           color: "var(--purple)",         bg: "var(--purple-muted)"   },
            { label: "Manage Exams",                href: "/admin/exams",       icon: BookOpen,      color: "var(--warning)",        bg: "var(--warning-muted)"  },
            { label: "Violation Alerts",            href: "/admin/violations",  icon: AlertTriangle, color: "var(--danger)",         bg: "var(--danger-muted)"   },
            { label: "System Reports",              href: "/admin/reports",     icon: Activity,      color: "var(--text-secondary)", bg: "var(--bg-deep)"        },
          ].map(({ label, href, icon: Icon, color, bg }) => (
            <a key={href} href={href}>
              <motion.div whileHover={{ x: 3 }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all"
                style={{ background: "var(--bg-deep)", border: "1px solid var(--border)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
                <ChevronRight size={11} className="ml-auto" style={{ color: "var(--text-muted)" }} />
              </motion.div>
            </a>
          ))}
        </div>
      </motion.div>

    </AdminLayout>
  );
}
