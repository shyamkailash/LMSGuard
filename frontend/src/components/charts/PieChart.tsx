"use client";

import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type PieChartItem = {
  label: string;
  value: number;
};

type PieChartProps = {
  data: PieChartItem[];
};

const colors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#22c55e", "#f59e0b"];

export function PieChart({ data }: PieChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "#f8fafc",
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={4}
            animationDuration={900}
          >
            {data.map((item, index) => (
              <Cell key={item.label} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
