"use client";
import { useMemo } from "react";
import { RISK_THRESHOLDS } from "@/constants";

export type RiskTier = "safe" | "warning" | "critical";

export interface RiskInfo {
  tier: RiskTier;
  label: string;
  color: string;
  barClass: string;
  badgeClass: string;
  bgClass: string;
}

export function useRisk(score: number): RiskInfo {
  return useMemo(() => {
    if (score <= RISK_THRESHOLDS.SAFE_MAX) {
      return {
        tier: "safe",
        label: "Safe",
        color: "#4ADE80",
        barClass: "risk-bar-safe",
        badgeClass: "badge-success",
        bgClass: "bg-success/10",
      };
    }
    if (score <= RISK_THRESHOLDS.WARNING_MAX) {
      return {
        tier: "warning",
        label: "Warning",
        color: "#FCD34D",
        barClass: "risk-bar-warning",
        badgeClass: "badge-warning",
        bgClass: "bg-warning/10",
      };
    }
    return {
      tier: "critical",
      label: "Critical",
      color: "#F87171",
      barClass: "risk-bar-danger",
      badgeClass: "badge-danger",
      bgClass: "bg-danger/10",
    };
  }, [score]);
}

export function getRiskInfo(score: number): RiskInfo {
  if (score <= RISK_THRESHOLDS.SAFE_MAX) {
    return { tier: "safe",     label: "Safe",     color: "#4ADE80", barClass: "risk-bar-safe",    badgeClass: "badge-success", bgClass: "bg-success/10" };
  }
  if (score <= RISK_THRESHOLDS.WARNING_MAX) {
    return { tier: "warning",  label: "Warning",  color: "#FCD34D", barClass: "risk-bar-warning", badgeClass: "badge-warning", bgClass: "bg-warning/10" };
  }
  return   { tier: "critical", label: "Critical", color: "#F87171", barClass: "risk-bar-danger",  badgeClass: "badge-danger",  bgClass: "bg-danger/10"  };
}
