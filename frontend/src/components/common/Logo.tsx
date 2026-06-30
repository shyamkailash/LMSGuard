import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid size-10 place-items-center rounded-2xl border border-violet-300/25 bg-violet-400/10 text-violet-100 shadow-lg shadow-violet-950/35">
        <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-violet-300/22 via-indigo-300/12 to-cyan-300/10" />
        <ShieldCheck className="relative size-5" />
      </div>
      {!compact ? (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-zinc-50">LMSGuard</p>
          <p className="text-xs text-zinc-500">Aurora Intelligence</p>
        </div>
      ) : null}
    </div>
  );
}

export default Logo;
