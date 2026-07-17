"use client";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, className, wrapperClassName, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-[13px] font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "input-premium appearance-none pr-8 cursor-pointer",
              error && "border-danger/60",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}
                style={{ background: "#111827", color: "#F9FAFB" }}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
        </div>
        {error && <p className="text-[12px] text-danger/90">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
