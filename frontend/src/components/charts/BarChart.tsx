"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BarChartItem = {
  label: string;
  value: number;
};

type BarChartProps = {
  data: BarChartItem[];
};

export function BarChart({ data }: BarChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(124,58,237,0.08)" }}
            contentStyle={{
              background: "#18181B",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "#FAFAFA",
            }}
          />
          <Bar dataKey="value" radius={[10, 10, 4, 4]} fill="#8b5cf6" animationDuration={900} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
