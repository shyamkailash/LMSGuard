"use client";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials?: string;
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  online?: boolean;
}

const sizeMap = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-[11px]",
  md: "w-10 h-10 text-[13px]",
  lg: "w-12 h-12 text-[15px]",
  xl: "w-16 h-16 text-[18px]",
};

const onlineDotSize = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border",
  lg: "w-3 h-3 border-[1.5px]",
  xl: "w-3.5 h-3.5 border-2",
};

const AVATAR_COLORS = [
  "bg-blue-500/20 text-blue-400",
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-orange-500/20 text-orange-400",
  "bg-pink-500/20 text-pink-400",
];

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ initials, src, name, size = "md", className, online }: AvatarProps) {
  const displayInitials = initials ?? (name ? getInitials(name) : "?");
  const colorClass = getColorFromString(displayInitials);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name ?? "avatar"}
          className={cn("rounded-xl object-cover border border-white/5", sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            "rounded-xl flex items-center justify-center font-semibold border border-white/5",
            sizeMap[size],
            colorClass
          )}
        >
          {displayInitials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-surface",
            onlineDotSize[size],
            online ? "bg-success" : "bg-surface-3"
          )}
        />
      )}
    </div>
  );
}
