"use client";
import { cn } from "@/lib/utils";
import { getRiskInfo } from "@/hooks/useRisk";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { motion } from "framer-motion";
import type { MonitoringStudent } from "@/types";
import {
  Wifi, WifiOff, Clipboard, Monitor, Clock,
  AlertTriangle, Eye, XCircle, Volume2,
} from "lucide-react";

interface StudentCardProps {
  student: MonitoringStudent;
  onView?:  (s: MonitoringStudent) => void;
  onWarn?:  (s: MonitoringStudent) => void;
  onPause?: (s: MonitoringStudent) => void;
  onEnd?:   (s: MonitoringStudent) => void;
  compact?: boolean;
}

function NetworkIcon({ status }: { status: MonitoringStudent["networkStatus"] }) {
  if (status === "disconnected") return <WifiOff className="w-3 h-3 text-danger"  />;
  if (status === "weak")         return <Wifi    className="w-3 h-3 text-warning" />;
  return                                <Wifi    className="w-3 h-3 text-success" />;
}

function formatDuration(mins?: number) {
  if (!mins) return "0:00";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function StudentCard({ student, onView, onWarn, onPause, onEnd, compact }: StudentCardProps) {
  const risk        = getRiskInfo(student.risk);
  const isViolation = student.status === "violation";
  const isWarning   = student.status === "warning";
  const isOffline   = !student.isOnline;

  const borderColor = isViolation
    ? "border-danger/25 hover:border-danger/40"
    : isWarning
    ? "border-warning/20 hover:border-warning/35"
    : "border-white/5 hover:border-primary/20";

  const bgGlow = isViolation
    ? "rgba(239,68,68,0.04)"
    : isWarning
    ? "rgba(245,158,11,0.03)"
    : "transparent";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative rounded-xl border p-4 transition-all duration-200 group cursor-pointer",
        "bg-surface",
        borderColor,
        isOffline && "opacity-60"
      )}
      style={{ boxShadow: isViolation ? "0 0 0 1px rgba(239,68,68,0.15), 0 4px 16px rgba(0,0,0,0.3)" : undefined, background: `linear-gradient(135deg, #111827, ${bgGlow})` }}
    >
      {/* Pulse ring for violation */}
      {isViolation && (
        <div className="absolute -inset-px rounded-xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 rounded-xl border border-danger/20 animate-pulse" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3">
        <div className="relative shrink-0">
          <Avatar name={student.name} size="md" online={student.isOnline} />
          {isViolation && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger flex items-center justify-center">
              <AlertTriangle className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-text-primary truncate leading-tight">{student.name}</p>
          <p className="text-[11px] text-text-muted leading-tight">{student.regno}</p>
          <p className="text-[11px] text-text-muted/70 leading-tight">{student.dept}</p>
        </div>
        <div className="shrink-0">
          <Badge
            variant={isViolation ? "danger" : isWarning ? "warning" : "success"}
            size="sm"
            dot
          >
            {isViolation ? "Alert" : isWarning ? "Warn" : "Safe"}
          </Badge>
        </div>
      </div>

      {/* Risk meter */}
      <div className="mb-3">
        <RiskMeter score={student.risk} size="sm" />
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg",
          student.networkStatus === "disconnected" ? "bg-danger/8" :
          student.networkStatus === "weak"         ? "bg-warning/8" : "bg-success/8"
        )}>
          <NetworkIcon status={student.networkStatus} />
          <span className="text-[10.5px] font-medium capitalize" style={{
            color: student.networkStatus === "disconnected" ? "#F87171" :
                   student.networkStatus === "weak"         ? "#FCD34D" : "#4ADE80"
          }}>
            {student.networkStatus}
          </span>
        </div>

        <div className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-lg", student.clipboardActive ? "bg-warning/8" : "bg-surface-2/60")}>
          <Clipboard className={cn("w-3 h-3", student.clipboardActive ? "text-warning" : "text-text-muted")} />
          <span className={cn("text-[10.5px] font-medium", student.clipboardActive ? "text-warning" : "text-text-muted")}>
            {student.clipboardActive ? "Clipboard" : "No Copy"}
          </span>
        </div>

        <div className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-lg", (student.tabCount ?? 1) > 1 ? "bg-warning/8" : "bg-surface-2/60")}>
          <Monitor className={cn("w-3 h-3", (student.tabCount ?? 1) > 1 ? "text-warning" : "text-text-muted")} />
          <span className={cn("text-[10.5px] font-medium", (student.tabCount ?? 1) > 1 ? "text-warning" : "text-text-muted")}>
            {student.tabCount ?? 1} tab{(student.tabCount ?? 1) !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-surface-2/60">
          <Clock className="w-3 h-3 text-text-muted" />
          <span className="text-[10.5px] text-text-muted font-medium">
            {formatDuration(student.examDuration)}
          </span>
        </div>
      </div>

      {/* Current window */}
      {student.currentWindow && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-danger/8 border border-danger/15 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-danger shrink-0" />
          <span className="text-[10.5px] text-danger truncate">{student.currentWindow}</span>
        </div>
      )}

      {/* Violation count */}
      {student.violations.length > 0 && (
        <div className="mb-3 flex items-center gap-1.5">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10.5px] text-text-muted">{student.violations.length} violation{student.violations.length !== 1 ? "s" : ""}</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onView?.(student)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10.5px] font-medium text-primary hover:bg-primary/15 transition-colors"
        >
          <Eye className="w-3 h-3" /> View
        </button>
        <button
          onClick={() => onWarn?.(student)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-warning/10 border border-warning/20 text-[10.5px] font-medium text-warning hover:bg-warning/15 transition-colors"
        >
          <Volume2 className="w-3 h-3" /> Warn
        </button>
        <button
          onClick={() => onEnd?.(student)}
          className="w-8 h-7 flex items-center justify-center rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger/15 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
