"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import { Activity, AlertTriangle, Database, Monitor, ShieldCheck, Wifi } from "lucide-react";

type DashboardSummary = {
  database: string;
  total_events: number;
  total_live_alerts: number;
  high_risk_alerts: number;
};

type MonitoringEvent = {
  event_id?: number;
  type: string;
  student_id: string;
  timestamp: string;
  app?: string;
  process_name?: string;
  window_title?: string;
  image_size?: number;
};

type LiveAlert = {
  alert_id?: number;
  event_id?: number;
  student_id: string;
  alert_type?: string;
  risk: string;
  message: string;
  timestamp: string;
};

export default function BackendLiveMonitoringPanel() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  async function loadLiveData() {
    try {
      const [summaryData, eventsData, alertsData] = await Promise.all([
        fetchJson<DashboardSummary>("/api/dashboard-summary"),
        fetchJson<MonitoringEvent[]>("/api/agent-events"),
        fetchJson<LiveAlert[]>("/api/live-alerts"),
      ]);

      setSummary(summaryData);
      setEvents(eventsData);
      setAlerts(alertsData);
      setConnected(true);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Backend API error:", error);
      setConnected(false);
    }
  }

  useEffect(() => {
    loadLiveData();
    const timer = setInterval(loadLiveData, 3000);
    return () => clearInterval(timer);
  }, []);

  const latestEvents = events.slice(-8).reverse();
  const latestAlerts = alerts.slice(-5).reverse();

  const screenshotCount = events.filter((event) => event.type === "SCREEN_CAPTURE").length;
  const unauthorizedCount = events.filter((event) => event.type === "UNAUTHORIZED_APP").length;

  return (
    <div className="space-y-6 mb-8">
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))",
          border: "1px solid rgba(37,99,235,0.25)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>
              LMSGuard Live Console
            </p>

            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Real-Time Exam Monitoring Dashboard
            </h1>

            <p className="text-sm max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Live student-agent activity, violation detection, screenshots, and alert records from FastAPI + SQLite.
            </p>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{
              background: connected ? "var(--success-muted)" : "var(--danger-muted)",
              color: connected ? "var(--success)" : "var(--danger)",
              border: "1px solid var(--border)",
            }}
          >
            <Wifi size={15} />
            {connected ? "Backend Connected" : "Backend Disconnected"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard title="Total Events" value={summary?.total_events ?? events.length} icon={<Activity size={19} />} />
        <MetricCard title="Live Alerts" value={summary?.total_live_alerts ?? alerts.length} icon={<AlertTriangle size={19} />} />
        <MetricCard title="High Risk" value={summary?.high_risk_alerts ?? 0} icon={<ShieldCheck size={19} />} />
        <MetricCard title="Screenshots" value={screenshotCount} icon={<Monitor size={19} />} />
        <MetricCard title="Blocked Apps" value={unauthorizedCount} icon={<AlertTriangle size={19} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section
          className="rounded-2xl p-5"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                Live Student Activity
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Real events from student monitoring agent
              </p>
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Updated: {lastUpdated || "Waiting..."}
            </span>
          </div>

          <div className="space-y-3">
            {latestEvents.length === 0 ? (
              <EmptyState text="No monitoring events received yet. Start the student agent." />
            ) : (
              latestEvents.map((event) => (
                <EventRow key={event.event_id ?? `${event.type}-${event.timestamp}`} event={event} />
              ))
            )}
          </div>
        </section>

        <section
          className="rounded-2xl p-5"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                Violation Alerts
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Risk alerts generated from backend monitoring engine
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {latestAlerts.length === 0 ? (
              <EmptyState text="No alerts generated yet." />
            ) : (
              latestAlerts.map((alert) => (
                <AlertRow key={alert.alert_id ?? `${alert.student_id}-${alert.timestamp}`} alert={alert} />
              ))
            )}
          </div>

          <div
            className="mt-5 rounded-xl p-4 text-xs"
            style={{
              background: "var(--bg-deep)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Database size={13} />
              <span className="font-semibold">Database Status</span>
            </div>
            <p>{summary?.database ?? "SQLite database connected"}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div style={{ color: "var(--primary)" }}>{icon}</div>
      <p className="text-2xl font-bold mt-3" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
    </div>
  );
}

function EventRow({ event }: { event: MonitoringEvent }) {
  const isViolation = event.type === "UNAUTHORIZED_APP";

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isViolation ? "var(--danger-muted)" : "var(--bg-deep)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {event.type.replaceAll("_", " ")}
          </p>

          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Student ID: {event.student_id}
          </p>

 e Han         <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Process: {event.app || event.process_name || "System"}
          </p>

          {event.window_title && (
            <p className="text-xs mt-1 truncate max-w-md" style={{ color: "var(--text-muted)" }}>
              Window: {event.window_title}
            </p>
          )}

          {event.image_size && (
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Screenshot captured · {event.image_size} bytes
            </p>
          )}
        </div>

        <span
          className="text-[10px] px-2 py-1 rounded-full font-bold"
          style={{
            background: isViolation ? "var(--danger)" : "var(--primary-muted)",
            color: isViolation ? "white" : "var(--primary)",
          }}
        >
          {isViolation ? "HIGH RISK" : "NORMAL"}
        </span>
      </div>

      <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
        {event.timestamp}
      </p>
    </div>
  );
}

function AlertRow({ alert }: { alert: LiveAlert }) {
  const isHigh = alert.risk === "HIGH";

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isHigh ? "var(--danger-muted)" : "var(--bg-deep)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          Student ID: {alert.student_id}
        </p>

        <span
          className="text-[10px] px-2 py-1 rounded-full font-bold"
          style={{
            background: isHigh ? "var(--danger)" : "var(--success-muted)",
            color: isHigh ? "white" : "var(--success)",
          }}
        >
          {alert.risk}
        </span>
      </div>

      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
        {alert.message}
      </p>

      <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
        {alert.timestamp}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl p-6 text-center text-sm"
      style={{
        background: "var(--bg-deep)",
        border: "1px dashed var(--border)",
        color: "var(--text-muted)",
      }}
    >
      {text}
    </div>
  );
}
