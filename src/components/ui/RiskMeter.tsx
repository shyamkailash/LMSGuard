"use client";
import { cn } from "@/lib/utils";
import { getRiskInfo } from "@/hooks/useRisk";

interface RiskMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showScore?: boolean;
  className?: string;
  animated?: boolean;
}

export function RiskMeter({
  score,
  size = "md",
  showLabel = true,
  showScore = true,
  className,
  animated = true,
}: RiskMeterProps) {
  const risk = getRiskInfo(score);
  const clampedScore = Math.max(0, Math.min(100, score));

  const heightMap = { sm: "h-1", md: "h-1.5", lg: "h-2" };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(showLabel || showScore) && (
        <div className="flex items-center justify-between">
          {showLabel && (
            <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
              Risk
            </span>
          )}
          {showScore && (
            <span
              className="text-[12px] font-semibold font-feature tabular-nums"
              style={{ color: risk.color }}
            >
              {clampedScore}%
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-surface-2 rounded-full overflow-hidden", heightMap[size])}>
        <div
          className={cn(risk.barClass, "h-full rounded-full", animated && "transition-all duration-700 ease-out")}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
}
