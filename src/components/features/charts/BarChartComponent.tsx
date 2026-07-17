"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import { CHART_COLORS } from "@/constants";
import type { ChartDataPoint } from "@/types";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 border border-white/10 shadow-lg">
      <p className="text-[11px] text-text-muted mb-1.5 font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[12px]">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.fill ?? entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-text-primary font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  color2?: string;
  dataKey?: string;
  dataKey2?: string;
  label2?: string;
  multiColor?: boolean;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  radius?: number;
  horizontal?: boolean;
}

const DEFAULT_COLORS = [
  CHART_COLORS.primary, CHART_COLORS.cyan, CHART_COLORS.purple,
  CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger,
];

export function BarChartComponent({
  data, height = 220, color = CHART_COLORS.primary, color2,
  dataKey = "value", dataKey2 = "value2", label2,
  multiColor, colors = DEFAULT_COLORS, showGrid = true,
  showLegend, radius = 4, horizontal,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 4, right: 4, bottom: 0, left: horizontal ? 80 : -20 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={!horizontal} horizontal={horizontal} />}
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
          </>
        )}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: CHART_COLORS.axis }} />}
        <Bar dataKey={dataKey} name="Count" fill={color} radius={[radius, radius, 0, 0]} maxBarSize={40}>
          {multiColor && data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
        {color2 && (
          <Bar dataKey={dataKey2} name={label2 ?? "Value 2"} fill={color2} radius={[radius, radius, 0, 0]} maxBarSize={40} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
