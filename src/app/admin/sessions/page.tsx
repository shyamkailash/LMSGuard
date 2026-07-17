"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  StopCircle,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_SESSIONS, MOCK_DEPARTMENTS } from "@/mock";
import type { MonitoringSession, TableColumn } from "@/types";
import { ANIMATION_VARIANTS } from "@/constants";

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<MonitoringSession | null>(null);

  // Filter sessions
  const filteredSessions = MOCK_SESSIONS.filter((session) => {
    const matchesSearch =
      session.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.invigilator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || session.status === selectedStatus;
    const matchesDept = !selectedDept || session.dept === selectedDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleViewDetails = (session: MonitoringSession) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
  };

  const getStatusConfig = (status: MonitoringSession["status"]) => {
    switch (status) {
      case "active":
        return {
          variant: "success" as const,
          icon: Play,
          label: "Active",
          dotColor: "bg-green-500",
        };
      case "paused":
        return {
          variant: "warning" as const,
          icon: Pause,
          label: "Paused",
          dotColor: "bg-amber-500",
        };
      case "ended":
        return {
          variant: "muted" as const,
          icon: StopCircle,
          label: "Ended",
          dotColor: "bg-gray-500",
        };
      case "waiting":
        return {
          variant: "primary" as const,
          icon: Clock,
          label: "Waiting",
          dotColor: "bg-blue-500",
        };
      default:
        return {
          variant: "muted" as const,
          icon: AlertTriangle,
          label: status,
          dotColor: "bg-gray-500",
        };
    }
  };

  const getRiskBadge = (avgRisk?: number) => {
    if (!avgRisk) return null;
    if (avgRisk < 30)
      return { variant: "success" as const, label: `${avgRisk}% Safe` };
    if (avgRisk < 65)
      return { variant: "warning" as const, label: `${avgRisk}% Warning` };
    return { variant: "danger" as const, label: `${avgRisk}% Critical` };
  };

  const columns: TableColumn<MonitoringSession>[] = [
    {
      key: "exam",
      label: "Exam Details",
      sortable: true,
      render: (_, session) => (
        <div>
          <div className="font-medium text-white">{session.exam}</div>
          <div className="mt-1 text-sm text-gray-400">{session.class}</div>
        </div>
      ),
    },
    {
      key: "invigilator",
      label: "Invigilator",
      sortable: true,
      render: (_, session) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-xs font-medium text-blue-500">
            {session.invigilator.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm text-white">{session.invigilator}</span>
        </div>
      ),
    },
    {
      key: "dept",
      label: "Department",
      sortable: true,
      render: (_, session) => (
        <Badge variant="muted">{session.dept || "N/A"}</Badge>
      ),
    },
    {
      key: "students",
      label: "Students",
      sortable: true,
      render: (_, session) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-white">{session.students}</span>
        </div>
      ),
    },
    {
      key: "violations",
      label: "Violations",
      sortable: true,
      render: (_, session) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span
            className={`font-medium ${
              session.violations > 5 ? "text-red-400" : "text-white"
            }`}
          >
            {session.violations}
          </span>
        </div>
      ),
    },
    {
      key: "avgRisk",
      label: "Avg Risk",
      sortable: true,
      render: (_, session) => {
        const riskBadge = getRiskBadge(session.avgRisk);
        return riskBadge ? <Badge variant={riskBadge.variant}>{riskBadge.label}</Badge> : <span className="text-gray-500">—</span>;
      },
    },
    {
      key: "startTime",
      label: "Start Time",
      sortable: true,
      render: (_, session) => (
        <div className="flex items-center gap-1 text-sm text-gray-300">
          <Clock className="h-3 w-3 text-gray-400" />
          {session.startTime}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_, session) => {
        const config = getStatusConfig(session.status);
        const Icon = config.icon;
        return (
          <Badge variant={config.variant}>
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${config.dotColor} ${
                session.status === "active" ? "animate-pulse" : ""
              }`}
            />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, session) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(session)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Calculate stats
  const stats = {
    total: MOCK_SESSIONS.length,
    active: MOCK_SESSIONS.filter((s) => s.status === "active").length,
    paused: MOCK_SESSIONS.filter((s) => s.status === "paused").length,
    totalStudents: MOCK_SESSIONS.reduce((sum, s) => sum + s.students, 0),
  };

  return (
    <>
      <PageHeader
        title="Exam Sessions"
        description="Monitor and manage ongoing and completed exam sessions"
      />

      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={ANIMATION_VARIANTS.stagger}
          initial="initial"
          animate="animate"
        >
          {[
            { label: "Total Sessions", value: stats.total, color: "blue" },
            {
              label: "Active Sessions",
              value: stats.active,
              color: "green",
              pulse: true,
            },
            { label: "Paused Sessions", value: stats.paused, color: "amber" },
            {
              label: "Total Students",
              value: stats.totalStudents,
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={ANIMATION_VARIANTS.fadeUp}
              className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">{stat.label}</div>
                {stat.pulse && (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                )}
              </div>
              <div className="mt-2 text-3xl font-bold text-white">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={ANIMATION_VARIANTS.fadeUp}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-4 backdrop-blur-xl sm:flex-row sm:items-center"
        >
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-48 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Departments</option>
            {MOCK_DEPARTMENTS.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.code}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="ended">Ended</option>
            <option value="waiting">Waiting</option>
          </select>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={ANIMATION_VARIANTS.fadeUp}
          initial="initial"
          animate="animate"
        >
          <DataTable columns={columns} data={filteredSessions} />
        </motion.div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSession(null);
        }}
        title="Session Details"
      >
        {selectedSession && (
          <div className="space-y-6">
            {/* Session Info */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Session Information
              </h3>
              <div className="space-y-3 rounded-lg bg-gray-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Exam</div>
                  <div className="font-medium text-white">
                    {selectedSession.exam}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Class</div>
                  <Badge variant="purple">{selectedSession.class}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Department</div>
                  <Badge variant="muted">{selectedSession.dept}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Room</div>
                  <div className="text-sm text-white">{selectedSession.room}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Start Time</div>
                  <div className="text-sm text-white">
                    {selectedSession.startTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Invigilator */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Invigilator
              </h3>
              <div className="flex items-center gap-3 rounded-lg bg-gray-900/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  {selectedSession.invigilator.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {selectedSession.invigilator}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedSession.dept} Department
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Session Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-900/50 p-4">
                  <div className="text-sm text-gray-400">Total Students</div>
                  <div className="mt-1 text-2xl font-bold text-white">
                    {selectedSession.students}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-900/50 p-4">
                  <div className="text-sm text-gray-400">Violations</div>
                  <div className="mt-1 text-2xl font-bold text-amber-400">
                    {selectedSession.violations}
                  </div>
                </div>
                <div className="col-span-2 rounded-lg bg-gray-900/50 p-4">
                  <div className="text-sm text-gray-400">Average Risk</div>
                  <div className="mt-2">
                    {selectedSession.avgRisk ? (
                      <Badge
                        variant={
                          getRiskBadge(selectedSession.avgRisk)?.variant ||
                          "muted"
                        }
                      >
                        {getRiskBadge(selectedSession.avgRisk)?.label}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">Not available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">Status</h3>
              <div className="rounded-lg bg-gray-900/50 p-4">
                <Badge
                  variant={getStatusConfig(selectedSession.status).variant}
                >
                  {getStatusConfig(selectedSession.status).label}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedSession(null);
                }}
              >
                Close
              </Button>
              {selectedSession.status === "active" && (
                <Button variant="secondary">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Session
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
