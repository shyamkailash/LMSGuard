"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, StatCard } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import {
  AlertTriangle, CheckCheck, Eye, Monitor, Wifi,
  Clock as ClockIcon, Activity, Clipboard, Camera, Search,
} from "lucide-react";
import { MOCK_SESSION_ALERTS } from "@/data/invigilatorData";
import type { SessionAlert } from "@/data/invigilatorData";
import { cn } from "@/lib/utils";

const ALERT_TYPE_CFG: Record<SessionAlert["type"], { icon: React.ElementType; label: string; color: string; bg: string }> = {
  clipboard:   { icon: Clipboard,     label: "Clipboard",   color: "text-warning",  bg: "bg-warning/10"  },
  network:     { icon: Wifi,          label: "Network",     color: "text-blue-400", bg: "bg-blue-400/10" },
  idle:        { icon: ClockIcon,     label: "Idle",        color: "text-text-muted", bg: "bg-surface-3" },
  application: { icon: Monitor,       label: "Application", color: "text-danger",   bg: "bg-danger/10"   },
  tab_switch:  { icon: Activity,      label: "Tab Switch",  color: "text-warning",  bg: "bg-warning/10"  },
  face:        { icon: Camera,        label: "Face",        color: "text-danger",   bg: "bg-danger/10"   },
  screen:      { icon: Eye,           label: "Screen",      color: "text-danger",   bg: "bg-danger/10"   },
};

export default function AlertsPage() {
  const [alerts,  setAlerts]  = useState(MOCK_SESSION_ALERTS);
  const [filter,  setFilter]  = useState<"all" | "open" | "done">("all");
  const [search,  setSearch]  = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = alerts.filter((a) => {
    const matchFilter = filter === "all" || (filter === "open" ? !a.acknowledged : a.acknowledged);
    const matchSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.regno.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchFilter && matchSearch && matchType;
  });

  const ack = (id: string) =>
    setAlerts((p) => p.map((a) => a.id === id ? { ...a, acknowledged: true } : a));

  const ackAll = () =>
    setAlerts((p) => p.map((a) => ({ ...a, acknowledged: true })));

  const openCount    = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Session Alerts"
          description="AI-detected suspicious activities and violations"
          badge={openCount > 0 ? <Badge variant="danger" dot>{openCount} Open</Badge> : undefined}
          actions={
            openCount > 0 ? (
              <Button
                variant="secondary"
                size="sm"
                icon={<CheckCheck className="w-3.5 h-3.5" />}
                onClick={ackAll}
              >
                Acknowledge All
              </Button>
            ) : undefined
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total Alerts"    value={alerts.length}  icon={<AlertTriangle className="w-4 h-4" />} color="warning" />
          <StatCard index={1} label="Open"            value={openCount}      icon={<Activity      className="w-4 h-4" />} color="danger"  />
          <StatCard index={2} label="Critical"        value={criticalCount}  icon={<AlertTriangle className="w-4 h-4" />} color="danger"  />
          <StatCard index={3} label="Acknowledged"    value={alerts.length - openCount} icon={<CheckCheck className="w-4 h-4" />} color="success" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts…"
              className="input-premium pl-9 w-full"
            />
          </div>
          <div className="flex gap-1 p-1 bg-surface-2 rounded-xl border border-white/5">
            {(["all", "open", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[11.5px] font-medium capitalize transition-all",
                  filter === f ? "bg-surface text-text-primary border border-white/6" : "text-text-muted hover:text-text-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-premium w-40 h-9 text-[12.5px]"
          >
            <option value="all">All Types</option>
            {Object.entries(ALERT_TYPE_CFG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Alert cards */}
        <div className="space-y-3">
          {filtered.map((alert, idx) => {
            const cfg  = ALERT_TYPE_CFG[alert.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className={cn(
                  "card p-4 transition-all",
                  !alert.acknowledged && alert.severity === "critical" && "border-danger/25 bg-danger/3",
                  !alert.acknowledged && alert.severity !== "critical" && "border-warning/20",
                  alert.acknowledged && "opacity-60"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Type icon */}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                    <Icon className={cn("w-4.5 h-4.5", cfg.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                          {alert.studentName.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">{alert.studentName}</p>
                          <p className="text-[11.5px] text-text-muted font-mono">{alert.regno}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-text-muted">{alert.time}</span>
                        <Badge
                          variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "danger" : "warning"}
                          size="sm"
                        >
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.acknowledged ? "success" : "muted"} size="sm">
                          {alert.acknowledged ? "Done" : "Open"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="muted" size="sm">{cfg.label}</Badge>
                      <span className="text-[12px] font-semibold font-feature" style={{
                        color: alert.risk >= 70 ? "#EF4444" : alert.risk >= 40 ? "#F59E0B" : "#6B7280"
                      }}>
                        Risk: {alert.risk}%
                      </span>
                    </div>
                    <p className="text-[12.5px] text-text-secondary leading-relaxed">{alert.detail}</p>
                  </div>

                  {/* Action */}
                  {!alert.acknowledged && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={<CheckCheck className="w-3.5 h-3.5" />}
                      onClick={() => ack(alert.id)}
                      className="shrink-0"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <CheckCheck className="w-12 h-12 mx-auto mb-3 text-success/30" />
              <p className="text-[14px] text-text-muted">No alerts match your filter</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
