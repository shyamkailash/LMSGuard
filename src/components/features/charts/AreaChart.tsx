"use client";
import {
  AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { CHART_COLORS } from "@/constants";
import type { ChartDataPoint } from "@/types";

interface AreaChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  color2?: string;
  dataKey?: string;
  dataKey2?: string;
  label2?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 border border-white/10 shadow-lg">
      <p className="text-[11px] text-text-muted mb-1.5 font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[12px]">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-text-primary font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function AreaChart({
  data, height = 220, color = CHART_COLORS.primary, color2,
  dataKey = "value", dataKey2 = "value2", label2, showLegend, showGrid = true,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          {color2 && (
            <linearGradient id={`grad-${dataKey2}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color2} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color2} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />}
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: CHART_COLORS.axis }} />}
        <Area
          type="monotone" dataKey={dataKey} name="Count"
          stroke={color} strokeWidth={2}
          fill={`url(#grad-${dataKey})`}
          dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
        />
        {color2 && (
          <Area
            type="monotone" dataKey={dataKey2} name={label2 ?? "Value 2"}
            stroke={color2} strokeWidth={2}
            fill={`url(#grad-${dataKey2})`}
            dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
          />
        )}
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
