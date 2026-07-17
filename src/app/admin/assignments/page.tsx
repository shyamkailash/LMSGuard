"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_ASSIGNMENTS, ASSIGNMENT_STATS, MOCK_DEPARTMENTS } from "@/mock";
import type { ExamAssignment, TableColumn } from "@/types";
import { ANIMATION_VARIANTS } from "@/constants";

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ExamAssignment | null>(null);

  // Filter assignments
  const filteredAssignments = MOCK_ASSIGNMENTS.filter((assignment) => {
    const matchesSearch =
      assignment.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || assignment.status === selectedStatus;
    const matchesDept = !selectedDept || assignment.deptCode === selectedDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleViewDetails = (assignment: ExamAssignment) => {
    setSelectedAssignment(assignment);
    setIsDetailOpen(true);
  };

  const getStatusConfig = (status: ExamAssignment["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          variant: "success" as const,
          icon: CheckCircle2,
          label: "Confirmed",
        };
      case "assigned":
        return {
          variant: "primary" as const,
          icon: AlertCircle,
          label: "Assigned",
        };
      case "pending":
        return {
          variant: "warning" as const,
          icon: Clock,
          label: "Pending",
        };
      case "cancelled":
        return { variant: "danger" as const, icon: XCircle, label: "Cancelled" };
      default:
        return {
          variant: "muted" as const,
          icon: AlertCircle,
          label: status,
        };
    }
  };

  const columns: TableColumn<ExamAssignment>[] = [
    {
      key: "examTitle",
      label: "Exam Details",
      sortable: true,
      render: (_, assignment) => (
        <div>
          <div className="font-medium text-white">{assignment.examTitle}</div>
          <div className="text-sm text-gray-400">{assignment.subject}</div>
        </div>
      ),
    },
    {
      key: "dept",
      label: "Department",
      sortable: true,
      render: (_, assignment) => (
        <div>
          <Badge variant="muted">{assignment.deptCode}</Badge>
          <div className="mt-1 text-xs text-gray-400">{assignment.dept}</div>
        </div>
      ),
    },
    {
      key: "classes",
      label: "Classes",
      render: (_, assignment) => (
        <div className="flex flex-wrap gap-1">
          {assignment.classes.map((cls) => (
            <Badge key={cls} variant="purple" size="sm">
              {cls}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "date",
      label: "Date & Time",
      sortable: true,
      render: (_, assignment) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-white">
            <Calendar className="h-3 w-3 text-gray-400" />
            {assignment.date}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {assignment.startTime} ({assignment.duration}m)
          </div>
        </div>
      ),
    },
    {
      key: "totalStudents",
      label: "Students",
      sortable: true,
      render: (_, assignment) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-white">
            {assignment.totalStudents}
          </span>
        </div>
      ),
    },
    {
      key: "invigilators",
      label: "Invigilators",
      render: (_, assignment) => (
        <div className="space-y-1">
          {assignment.invigilators.map((inv) => (
            <div key={inv} className="text-sm text-gray-300">
              {inv}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "roomNo",
      label: "Room",
      render: (_, assignment) => (
        <div className="flex items-center gap-1 text-sm text-gray-300">
          <MapPin className="h-3 w-3 text-gray-400" />
          {assignment.roomNo}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_, assignment) => {
        const config = getStatusConfig(assignment.status);
        const Icon = config.icon;
        return (
          <Badge variant={config.variant}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, assignment) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(assignment)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Exam Assignments"
        description="Review and manage exam assignments for invigilators and students"
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
            {
              label: "Total Assignments",
              value: ASSIGNMENT_STATS.total,
              color: "blue",
            },
            {
              label: "Confirmed",
              value: ASSIGNMENT_STATS.confirmed,
              color: "green",
            },
            {
              label: "Pending Review",
              value: ASSIGNMENT_STATS.pending,
              color: "amber",
            },
            {
              label: "Total Students",
              value: ASSIGNMENT_STATS.totalStudents,
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={ANIMATION_VARIANTS.fadeUp}
              className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-xl"
            >
              <div className="text-sm text-gray-400">{stat.label}</div>
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
              placeholder="Search assignments..."
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
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={ANIMATION_VARIANTS.fadeUp}
          initial="initial"
          animate="animate"
        >
          <DataTable columns={columns} data={filteredAssignments} />
        </motion.div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedAssignment(null);
        }}
        title="Assignment Details"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Exam Info */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Exam Information
              </h3>
              <div className="space-y-2 rounded-lg bg-gray-900/50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Title</div>
                    <div className="font-medium text-white">
                      {selectedAssignment.examTitle}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Subject</div>
                    <div className="font-medium text-white">
                      {selectedAssignment.subject}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Date</div>
                    <div className="font-medium text-white">
                      {selectedAssignment.date}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Time</div>
                    <div className="font-medium text-white">
                      {selectedAssignment.startTime} (
                      {selectedAssignment.duration}m)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Assignment Details
              </h3>
              <div className="space-y-3 rounded-lg bg-gray-900/50 p-4">
                <div>
                  <div className="text-sm text-gray-400">Department</div>
                  <div className="font-medium text-white">
                    {selectedAssignment.dept}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Classes</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.classes.map((cls) => (
                      <Badge key={cls} variant="purple">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Students</div>
                  <div className="font-medium text-white">
                    {selectedAssignment.totalStudents}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Room Number</div>
                  <div className="font-medium text-white">
                    {selectedAssignment.roomNo}
                  </div>
                </div>
              </div>
            </div>

            {/* Invigilators */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Assigned Invigilators
              </h3>
              <div className="space-y-2">
                {selectedAssignment.invigilators.map((inv, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                        {inv.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{inv}</span>
                    </div>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Metadata */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Status & Metadata
              </h3>
              <div className="space-y-2 rounded-lg bg-gray-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Status</div>
                  <Badge
                    variant={getStatusConfig(selectedAssignment.status).variant}
                  >
                    {getStatusConfig(selectedAssignment.status).label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Assigned At</div>
                  <div className="text-sm text-white">
                    {selectedAssignment.assignedAt}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Assigned By</div>
                  <div className="text-sm text-white">
                    {selectedAssignment.assignedBy}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedAssignment(null);
                }}
              >
                Close
              </Button>
              <Button>Update Assignment</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
