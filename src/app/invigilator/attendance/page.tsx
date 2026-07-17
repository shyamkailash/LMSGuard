"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, StatCard } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { DonutChart, BarChartComponent } from "@/components/features/charts";
import { MOCK_WAITING_STUDENTS } from "@/data/invigilatorData";
import { CHART_COLORS } from "@/constants";
import { CheckCircle2, XCircle, Clock, WifiOff, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const students = MOCK_WAITING_STUDENTS;

  const stats = useMemo(() => ({
    total:        students.length,
    online:       students.filter((s) => s.connectionStatus !== "disconnected").length,
    offline:      students.filter((s) => s.connectionStatus === "disconnected").length,
    approved:     students.filter((s) => s.permissionStatus === "approved").length,
    rejected:     students.filter((s) => s.permissionStatus === "rejected").length,
    waiting:      students.filter((s) => s.permissionStatus === "waiting").length,
    faceVerified: students.filter((s) => s.faceVerified).length,
  }), [students]);

  const donutData = [
    { name: "Approved", value: stats.approved },
    { name: "Waiting",  value: stats.waiting  },
    { name: "Rejected", value: stats.rejected },
    { name: "Offline",  value: stats.offline  },
  ];

  const barData = [
    { name: "Online",   value: stats.online    },
    { name: "Offline",  value: stats.offline   },
    { name: "Approved", value: stats.approved  },
    { name: "Rejected", value: stats.rejected  },
    { name: "Waiting",  value: stats.waiting   },
    { name: "Face OK",  value: stats.faceVerified },
  ];

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Attendance"
          description="DBMS Final Exam · CSE-3A · Student attendance overview"
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Total Students"  value={stats.total}    icon={<Users         className="w-4 h-4" />} color="primary"  />
          <StatCard index={1} label="Online"          value={stats.online}   icon={<CheckCircle2  className="w-4 h-4" />} color="success"  delta={`${Math.round((stats.online/stats.total)*100)}%`} deltaType="up" />
          <StatCard index={2} label="Approved"        value={stats.approved} icon={<CheckCircle2  className="w-4 h-4" />} color="success"  />
          <StatCard index={3} label="Offline"         value={stats.offline}  icon={<WifiOff       className="w-4 h-4" />} color="danger"   />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="section-title mb-1">Permission Distribution</p>
            <p className="section-subtitle mb-4">Breakdown by approval status</p>
            <DonutChart
              data={donutData.map((d, i) => ({
                ...d,
                color: [CHART_COLORS.primary, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.axis][i],
              }))}
              height={200}
              centerValue={stats.total}
              centerLabel="Students"
            />
          </div>
          <div className="card p-5">
            <p className="section-title mb-1">Attendance Breakdown</p>
            <p className="section-subtitle mb-4">All attendance categories</p>
            <BarChartComponent data={barData} color={CHART_COLORS.primary} height={200} />
          </div>
        </div>

        {/* Student Table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
            <p className="section-title">Student Attendance Register</p>
            <Badge variant="primary">{stats.total} Students</Badge>
          </div>

          <div
            className="grid px-5 py-3 border-b border-white/5 bg-surface-2/40 text-[11px] font-semibold text-text-muted uppercase tracking-wide"
            style={{ gridTemplateColumns: "1fr 5rem 7rem 7rem 6rem 6rem" }}
          >
            <span>Student</span>
            <span>Dept</span>
            <span>Connection</span>
            <span>Permission</span>
            <span>Face ID</span>
            <span>Joined</span>
          </div>

          <div className="divide-y divide-white/4">
            {students.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.025 }}
                className="grid items-center px-5 py-3 hover:bg-surface-2/25 transition-colors"
                style={{ gridTemplateColumns: "1fr 5rem 7rem 7rem 6rem 6rem" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10.5px] font-bold text-primary">
                      {s.avatar}
                    </div>
                    {s.connectionStatus === "connected" && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-text-primary truncate">{s.name}</p>
                    <p className="text-[11px] text-text-muted font-mono">{s.regno}</p>
                  </div>
                </div>

                <span className="text-[11.5px] text-text-muted">{s.dept}</span>

                <div>
                  {s.connectionStatus === "connected" && <Badge variant="success" dot size="sm">Online</Badge>}
                  {s.connectionStatus === "weak"      && <Badge variant="warning" dot size="sm">Weak</Badge>}
                  {s.connectionStatus === "disconnected" && <Badge variant="danger" dot size="sm">Offline</Badge>}
                </div>

                <div>
                  {s.permissionStatus === "approved" && <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>}
                  {s.permissionStatus === "rejected" && <Badge variant="danger"  size="sm"><XCircle     className="w-3 h-3 mr-1" />Rejected</Badge>}
                  {s.permissionStatus === "waiting"  && <Badge variant="warning" dot size="sm">Waiting</Badge>}
                </div>

                <div>
                  {s.faceVerified
                    ? <span className="flex items-center gap-1 text-[11.5px] text-success"><CheckCircle2 className="w-3.5 h-3.5" />OK</span>
                    : <span className="flex items-center gap-1 text-[11.5px] text-danger"><XCircle      className="w-3.5 h-3.5" />Failed</span>
                  }
                </div>

                <span className="text-[11.5px] text-text-muted">{s.joinedAt}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
