"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AreaChartProps = {
  values: number[];
};

export function AreaChart({ values }: AreaChartProps) {
  const data = values.map((value, index) => ({
    label: `T${index + 1}`,
    value,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="auroraArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.38} />
              <stop offset="70%" stopColor="#4f46e5" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#18181B",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "#FAFAFA",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#a78bfa"
            strokeWidth={2}
            fill="url(#auroraArea)"
            animationDuration={1000}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
