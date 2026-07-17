"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title:        string;
  description?: string;
  actions?:     ReactNode;
  badge?:       ReactNode;
  className?:   string;
}

export function PageHeader({
  title, description, actions, badge, className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[19px] font-bold text-text-primary tracking-tight">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-[13px] text-text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
