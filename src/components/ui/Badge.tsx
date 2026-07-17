"use client";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "success" | "warning" | "danger" | "purple" | "cyan" | "muted";
type BadgeSize   = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, string> = {
  primary: "badge-primary",
  success: "badge-success",
  warning: "badge-warning",
  danger:  "badge-danger",
  purple:  "badge-purple",
  cyan:    "badge-cyan",
  muted:   "badge-muted",
};

const sizeMap: Record<BadgeSize, string> = {
  sm: "text-[10.5px] px-1.5 py-px",
  md: "text-[11.5px] px-2 py-0.5",
};

export function Badge({ variant = "muted", size = "md", children, className, dot }: BadgeProps) {
  return (
    <span className={cn("badge", variantMap[variant], sizeMap[size], className)}>
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "currentColor", opacity: 0.9 }}
        />
      )}
      {children}
    </span>
  );
}
