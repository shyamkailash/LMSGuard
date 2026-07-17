"use client";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className, wrapperClassName, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input-premium w-full",
              icon && "pl-9",
              iconRight && "pr-9",
              error && "border-danger/60 focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 text-text-muted flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p className="text-[12px] text-danger/90 flex items-center gap-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[12px] text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
