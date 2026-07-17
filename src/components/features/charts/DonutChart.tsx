"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CHART_COLORS } from "@/constants";

interface DonutSlice { name: string; value: number; color?: string }

interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string | number;
  showLegend?: boolean;
}

const DEFAULTS = [
  CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning,
  CHART_COLORS.danger,  CHART_COLORS.purple,  CHART_COLORS.cyan,
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="glass rounded-xl px-3 py-2.5 border border-white/10 shadow-lg">
      <div className="flex items-center gap-2 text-[12px]">
        <div className="w-2 h-2 rounded-full" style={{ background: d.payload.fill }} />
        <span className="text-text-secondary">{d.name}:</span>
        <span className="text-text-primary font-semibold">{d.value}%</span>
      </div>
    </div>
  );
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
            <span className="text-[11.5px] text-text-muted">{entry.value}</span>
          </div>
          <span className="text-[11.5px] text-text-secondary font-medium">{entry.payload.value}%</span>
        </div>
      ))}
    </div>
  );
};

export function DonutChart({
  data, height = 200, innerRadius = 55, outerRadius = 80,
  centerLabel, centerValue, showLegend = true,
}: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data} cx="50%" cy="50%"
            innerRadius={innerRadius} outerRadius={outerRadius}
            paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? DEFAULTS[i % DEFAULTS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={renderLegend} />}
        </PieChart>
      </ResponsiveContainer>

      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: showLegend ? "60px" : 0 }}>
          <div className="text-[18px] font-bold text-text-primary">{centerValue}</div>
          <div className="text-[10.5px] text-text-muted mt-0.5">{centerLabel}</div>
        </div>
      )}
    </div>
  );
}
