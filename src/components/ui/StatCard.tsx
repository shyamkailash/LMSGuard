"use client";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  icon: ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "purple" | "cyan";
  description?: string;
  className?: string;
  index?: number;
  suffix?: string;
  prefix?: string;
}

const colorMap = {
  primary: { icon: "bg-primary/10 text-primary",  glow: "rgba(37,99,235,0.12)"  },
  success: { icon: "bg-success/10 text-success",  glow: "rgba(34,197,94,0.12)"  },
  warning: { icon: "bg-warning/10 text-warning",  glow: "rgba(245,158,11,0.12)" },
  danger:  { icon: "bg-danger/10 text-danger",    glow: "rgba(239,68,68,0.12)"  },
  purple:  { icon: "bg-purple/10 text-purple",    glow: "rgba(139,92,246,0.12)" },
  cyan:    { icon: "bg-cyan/10 text-cyan",        glow: "rgba(6,182,212,0.12)"  },
};

function AnimatedNumber({ value, suffix, prefix }: { value: number | string; suffix?: string; prefix?: string }) {
  const numeric = typeof value === "number" ? value : parseInt(String(value).replace(/\D/g, ""), 10) || 0;
  const count = useCountUp(numeric);
  const isNumeric = typeof value === "number" || !isNaN(numeric);

  if (!isNumeric) return <span>{value}</span>;

  return (
    <span className="font-feature tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon,
  color = "primary",
  description,
  className,
  index = 0,
  suffix,
  prefix,
}: StatCardProps) {
  const { icon: iconClass } = colorMap[color];

  return (
    <motion.div
      className={cn("stat-card group", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconClass)}>
          {icon}
        </div>
        {delta && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11.5px] font-medium px-2 py-1 rounded-lg",
              deltaType === "up"      && "text-success bg-success/8",
              deltaType === "down"    && "text-danger  bg-danger/8",
              deltaType === "neutral" && "text-text-muted bg-surface-2"
            )}
          >
            {deltaType === "up"      && <TrendingUp  className="w-3 h-3" />}
            {deltaType === "down"    && <TrendingDown className="w-3 h-3" />}
            {deltaType === "neutral" && <Minus        className="w-3 h-3" />}
            {delta}
          </div>
        )}
      </div>

      <div className="text-[26px] font-bold text-text-primary leading-none mb-1 tracking-tight">
        <AnimatedNumber value={value} suffix={suffix} prefix={prefix} />
      </div>
      <div className="text-[13px] font-medium text-text-muted">{label}</div>
      {description && (
        <div className="text-[11.5px] text-text-muted/70 mt-1">{description}</div>
      )}
    </motion.div>
  );
}
