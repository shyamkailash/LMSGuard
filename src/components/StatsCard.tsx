"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type ColorKey = "blue" | "green" | "yellow" | "red" | "purple" | "gold" | "maroon";

interface Palette {
  color: string;
  soft: string;
  border: string;
  icon: string;
}

const PALETTES: Record<ColorKey, Palette> = {
  blue:   { color:"#2563EB", soft:"#EFF6FF", border:"rgba(37,99,235,0.15)",   icon:"#2563EB" },
  green:  { color:"#16A34A", soft:"#F0FDF4", border:"rgba(22,163,74,0.15)",   icon:"#16A34A" },
  yellow: { color:"#D97706", soft:"#FFFBEB", border:"rgba(217,119,6,0.15)",   icon:"#D97706" },
  red:    { color:"#DC2626", soft:"#FFF1F2", border:"rgba(220,38,38,0.15)",   icon:"#DC2626" },
  purple: { color:"#7C3AED", soft:"#F5F3FF", border:"rgba(124,58,237,0.15)",  icon:"#7C3AED" },
  gold:   { color:"#B45309", soft:"#FFFBEB", border:"rgba(180,83,9,0.15)",    icon:"#B45309" },
  maroon: { color:"#DC2626", soft:"#FFF1F2", border:"rgba(220,38,38,0.15)",   icon:"#DC2626" },
};

interface Trend { up?: boolean; value: string | number; label: string; }

interface StatsCardProps {
  title:    string;
  value:    string | number;
  icon:     LucideIcon;
  color?:   ColorKey;
  subtitle?: string;
  trend?:   Trend;
  index?:   number;
}

export default function StatsCard({
  title, value, icon: Icon, color = "blue", subtitle, trend, index = 0,
}: StatsCardProps) {
  const p = PALETTES[color] ?? PALETTES.blue;

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, delay:index*0.08, ease:[0.4,0,0.2,1] as any }}
      whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(15,23,42,0.10)", transition:{ duration:0.2 } }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background:"var(--card)", border:`1px solid ${p.border}`, boxShadow:"var(--shadow)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
           style={{ background:`linear-gradient(90deg, ${p.color}, ${p.color}80)` }}/>
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30"
           style={{ background:p.soft }}/>
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2"
             style={{ color:"var(--text-muted)" }}>{title}</p>
          <motion.p
            initial={{ scale:0.8, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            transition={{ delay:index*0.08+0.2, type:"spring", stiffness:160 }}
            className="text-3xl font-bold mb-1 leading-none"
            style={{ color:"var(--text-primary)" }}>
            {value}
          </motion.p>
          {subtitle && <p className="text-xs" style={{ color:"var(--text-muted)" }}>{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                style={{ background:trend.up?"#F0FDF4":"#FFF1F2", color:trend.up?"#16A34A":"#DC2626" }}>
                {trend.up?"↑":"↓"} {trend.value}
              </span>
              <span className="text-[11px]" style={{ color:"var(--text-muted)" }}>{trend.label}</span>
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ml-3"
             style={{ background:p.soft, border:`1px solid ${p.border}` }}>
          <Icon size={20} style={{ color:p.icon }}/>
        </div>
      </div>
    </motion.div>
  );
}
