"use client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* Light-mode only chart palette */
const C = { grid:"#E2E8F0", tick:"#94A3B8", bg:"#FFFFFF", border:"#E2E8F0", text:"#0F172A" };

const TREND = [
  { time:"09:00", violations:1, safe:12 },
  { time:"09:30", violations:3, safe:10 },
  { time:"10:00", violations:5, safe:9  },
  { time:"10:30", violations:8, safe:8  },
  { time:"11:00", violations:6, safe:11 },
  { time:"11:30", violations:4, safe:13 },
  { time:"12:00", violations:9, safe:7  },
  { time:"12:30", violations:7, safe:9  },
];
const TYPES = [
  { name:"Browser",   count:5, fill:"#2563EB" },
  { name:"App",       count:4, fill:"#8B5CF6" },
  { name:"Idle",      count:3, fill:"#F59E0B" },
  { name:"Faces",     count:2, fill:"#EF4444" },
  { name:"Clipboard", count:1, fill:"#22C55E" },
];
const PIE = [
  { name:"Safe",    value:6, color:"#22C55E" },
  { name:"Warning", value:4, color:"#F59E0B" },
  { name:"Critical",value:2, color:"#EF4444" },
];

function CT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 text-xs shadow-xl"
      style={{ background:C.bg, border:`1px solid ${C.border}`, minWidth:140 }}>
      <p className="font-semibold mb-2" style={{ color:C.text }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background:p.color||p.fill }}/>
            <span style={{ color:C.tick }}>{p.name}</span>
          </div>
          <span className="font-bold" style={{ color:C.text }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ViolationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={TREND} margin={{ top:5, right:5, left:-22, bottom:0 }}>
        <defs>
          <linearGradient id="gDanger" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#EF4444" stopOpacity={0.18}/>
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="gSafe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.14}/>
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false}/>
        <XAxis dataKey="time" tick={{ fill:C.tick, fontSize:10 }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fill:C.tick, fontSize:10 }} axisLine={false} tickLine={false}/>
        <Tooltip content={CT}/>
        <Area type="monotone" dataKey="safe"       name="Safe"       stroke="#2563EB" strokeWidth={2.5} fill="url(#gSafe)"   dot={false}/>
        <Area type="monotone" dataKey="violations" name="Violations" stroke="#EF4444" strokeWidth={2.5} fill="url(#gDanger)" dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ViolationTypesChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={TYPES} margin={{ top:5, right:5, left:-22, bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false}/>
        <XAxis dataKey="name" tick={{ fill:C.tick, fontSize:9 }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fill:C.tick, fontSize:10 }} axisLine={false} tickLine={false}/>
        <Tooltip content={CT}/>
        <Bar dataKey="count" name="Count" radius={[6,6,0,0]}>
          {TYPES.map((e,i) => <Cell key={i} fill={e.fill}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RiskPieChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={76}
             paddingAngle={3} dataKey="value">
          {PIE.map((e,i) => <Cell key={i} fill={e.color} stroke="transparent"/>)}
        </Pie>
        <Tooltip content={({ active, payload }) => {
          if (!active || !payload?.length) return null;
          return (
            <div className="rounded-2xl px-3 py-2 text-xs shadow-xl"
              style={{ background:C.bg, border:`1px solid ${C.border}` }}>
              <p className="font-bold" style={{ color:payload[0].payload.color }}>
                {payload[0].payload.name}
              </p>
              <p style={{ color:C.text }}>{payload[0].value} students</p>
            </div>
          );
        }}/>
        <Legend
          formatter={v => <span style={{ color:C.tick, fontSize:11 }}>{v}</span>}
          iconType="circle" iconSize={8}/>
      </PieChart>
    </ResponsiveContainer>
  );
}
