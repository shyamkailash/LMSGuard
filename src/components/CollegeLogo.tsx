import type { CSSProperties } from "react";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface CollegeLogoProps {
  size?:     LogoSize;
  showText?: boolean;
  onDark?:   boolean;
  className?: string;
}

const SIZES: Record<LogoSize, number> = {
  xs:16, sm:28, md:40, lg:52, xl:68, "2xl":88,
};

export default function CollegeLogo({
  size = "md", showText = false, onDark = false, className = "",
}: CollegeLogoProps) {
  const px = SIZES[size] ?? SIZES.md;
  const boxStyle: CSSProperties = {
    width: px, height: px,
    borderRadius: px * 0.2,
    background: "var(--bg-subtle, #F1F5F9)",
    border: "1.5px dashed var(--border, #E2E8F0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    color: "var(--text-muted, #94A3B8)",
    fontSize: px * 0.26,
    fontWeight: 700,
    userSelect: "none",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ── Replace this div with your actual college logo ── */}
      <div style={boxStyle} title="College logo placeholder">
        {/* <img src="/college-logo.png" alt="College Logo" style={{ width:"100%", height:"100%", objectFit:"contain", borderRadius:px*0.2 }}/> */}
      </div>
      {showText && (
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight truncate"
             style={{ color: onDark ? "#FFFFFF" : "var(--text-primary)" }}>
            College Name
          </p>
          <p className="text-[10px] leading-tight truncate"
             style={{ color: onDark ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}>
            Institute of Engineering & Technology
          </p>
        </div>
      )}
    </div>
  );
}
