"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { RiskMeter } from "@/components/ui/RiskMeter";
import {
  ChevronLeft, AlertTriangle, CheckCircle2, XCircle,
  Wifi, WifiOff, Monitor, Camera, Clock, Shield,
  Volume2, UserX, Eye,
} from "lucide-react";
import { MOCK_WAITING_STUDENTS } from "@/data/invigilatorData";
import { MOCK_MONITORING_STUDENTS } from "@/mock/students";
import { MOCK_VIOLATIONS } from "@/mock/violations";
import { getRiskInfo } from "@/hooks/useRisk";
import { cn } from "@/lib/utils";

function DetailContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const id           = searchParams.get("id") ?? "S101";

  const monitoring = MOCK_MONITORING_STUDENTS.find((s) => s.id === id);
  const waiting    = MOCK_WAITING_STUDENTS.find((s) => s.id === id);
  const name       = monitoring?.name    ?? waiting?.name    ?? "Unknown";
  const regno      = monitoring?.regno   ?? waiting?.regno   ?? "—";
  const dept       = monitoring?.dept    ?? waiting?.dept    ?? "—";
  const avatar     = monitoring?.avatar  ?? waiting?.avatar  ?? "??";
  const risk       = monitoring?.risk    ?? waiting?.risk    ?? 0;
  const riskInfo   = getRiskInfo(risk);
  const isOnline   = monitoring?.isOnline ?? (waiting?.connectionStatus !== "disconnected");

  const violations = MOCK_VIOLATIONS.filter(
    (v) => v.studentId === id || v.regno === regno
  );

  const statusItems = [
    { icon: Wifi,    label: "Network",   value: monitoring?.networkStatus ?? "stable",   ok: (monitoring?.networkStatus ?? "stable") === "stable" },
    { icon: Camera,  label: "Camera",    value: "Active",                                ok: true  },
    { icon: Monitor, label: "Clipboard", value: monitoring?.clipboardActive ? "Active" : "Blocked", ok: !monitoring?.clipboardActive },
    { icon: Eye,     label: "Tabs",      value: `${monitoring?.tabCount ?? 1} open`,     ok: (monitoring?.tabCount ?? 1) <= 1 },
  ];

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-5">
        <PageHeader
          title="Student Details"
          description={`${name} · ${regno}`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-3.5 h-3.5" />} onClick={() => router.back()}>
                Back
              </Button>
              <Button variant="danger"  size="sm" icon={<UserX    className="w-3.5 h-3.5" />}>Block</Button>
              <Button variant="secondary" size="sm" icon={<Volume2  className="w-3.5 h-3.5" />}>Warn</Button>
            </div>
          }
        />

        <div className="grid grid-cols-3 gap-5">
          {/* Profile */}
          <div className="space-y-4">
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }} className="card p-5">
              <div className="flex flex-col items-center text-center gap-3 mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-[20px] font-bold text-primary">
                    {avatar}
                  </div>
                  <span className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                    isOnline ? "bg-success" : "bg-text-muted"
                  )} />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-text-primary">{name}</p>
                  <p className="text-[12.5px] text-text-muted font-mono">{regno}</p>
                  <Badge variant={isOnline ? "success" : "muted"} dot className="mt-1.5">
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>

              {[
                { label: "Department", value: dept                            },
                { label: "Class",      value: monitoring?.class ?? "CSE-3A"  },
                { label: "Exam",       value: monitoring?.exam  ?? "DBMS Final" },
                { label: "Duration",   value: `${monitoring?.examDuration ?? 0} min elapsed` },
                { label: "Permission", value: waiting?.permissionStatus ?? "approved" },
              ].map((f) => (
                <div key={f.label} className="flex justify-between py-2 border-b border-white/5 text-[12.5px] last:border-0">
                  <span className="text-text-muted">{f.label}</span>
                  <span className="font-medium text-text-secondary capitalize">{f.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Risk */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.05 }} className="card p-5">
              <p className="text-[13px] font-semibold text-text-primary mb-4">Risk Score</p>
              <div className="flex flex-col items-center gap-3">
                <RiskMeter score={risk} size="lg" />
                <div>
                  <p className="text-[28px] font-bold font-feature text-center" style={{ color: riskInfo.color }}>{risk}%</p>
                  <p className="text-[12px] text-text-muted text-center capitalize">{riskInfo.label} Risk</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Status + Violations */}
          <div className="col-span-2 space-y-4">
            {/* Status */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.06 }} className="card p-5">
              <p className="text-[13px] font-semibold text-text-primary mb-4">Live Status</p>
              <div className="grid grid-cols-2 gap-3">
                {statusItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.label} className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border",
                      item.ok ? "bg-success/8 border-success/15" : "bg-danger/8 border-danger/15"
                    )}>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        item.ok ? "bg-success/15" : "bg-danger/15"
                      )}>
                        <ItemIcon className={cn("w-4 h-4", item.ok ? "text-success" : "text-danger")} />
                      </div>
                      <div>
                        <p className="text-[11.5px] text-text-muted">{item.label}</p>
                        <p className={cn("text-[13px] font-semibold capitalize", item.ok ? "text-success" : "text-danger")}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {monitoring?.runningApps && monitoring.runningApps.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-danger/8 border border-danger/15">
                  <p className="text-[12px] text-text-muted mb-2">Running Apps Detected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {monitoring.runningApps.map((app) => (
                      <span key={app} className="badge badge-danger text-[11px]">{app}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Violations */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.08 }} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-semibold text-text-primary">Violation History</p>
                <Badge variant={violations.length > 3 ? "danger" : "warning"} dot>
                  {violations.length} violations
                </Badge>
              </div>

              {violations.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success/40" />
                  <p className="text-[13px] text-text-muted">No violations recorded</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {violations.map((v) => (
                    <div key={v.id} className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border",
                      v.severity === "critical" ? "bg-danger/5 border-danger/15" : "bg-warning/5 border-warning/10"
                    )}>
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        v.severity === "critical" ? "bg-danger/15" : "bg-warning/15"
                      )}>
                        <AlertTriangle className={cn("w-3.5 h-3.5", v.severity === "critical" ? "text-danger" : "text-warning")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-[12.5px] font-semibold text-text-primary">{v.type}</p>
                          <span className="text-[10.5px] text-text-muted shrink-0">{v.time}</span>
                        </div>
                        {v.detail && <p className="text-[11.5px] text-text-muted">{v.detail}</p>}
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={v.severity === "critical" ? "danger" : "warning"} size="sm">{v.severity}</Badge>
                          {v.risk && (
                            <span className="text-[11px] text-text-muted">Risk: <strong className="text-text-secondary">{v.risk}%</strong></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function StudentDetailPage() {
  return (
    <Suspense fallback={
      <AppShell variant="invigilator">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </AppShell>
    }>
      <DetailContent />
    </Suspense>
  );
}
