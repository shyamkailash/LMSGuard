"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_SUBJECTS, MOCK_DEPARTMENTS } from "@/mock";
import type { Subject, TableColumn } from "@/types";
import { ANIMATION_VARIANTS } from "@/constants";

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Filter subjects
  const filteredSubjects = MOCK_SUBJECTS.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !selectedDept || subject.deptCode === selectedDept;
    const matchesType = !selectedType || subject.type === selectedType;
    return matchesSearch && matchesDept && matchesType;
  });

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsCreateOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedSubject(null);
    setIsCreateOpen(true);
  };

  const columns: TableColumn<Subject>[] = [
    {
      key: "code",
      label: "Subject Code",
      sortable: true,
      render: (_, subject) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-medium text-white">{subject.code}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Subject Name",
      sortable: true,
      render: (_, subject) => (
        <div>
          <div className="font-medium text-white">{subject.name}</div>
          <div className="text-sm text-gray-400">{subject.faculty}</div>
        </div>
      ),
    },
    {
      key: "deptCode",
      label: "Department",
      sortable: true,
      render: (_, subject) => (
        <div>
          <div className="text-sm text-white">{subject.deptCode}</div>
          <div className="text-xs text-gray-400">{subject.dept}</div>
        </div>
      ),
    },
    {
      key: "semester",
      label: "Semester",
      sortable: true,
      render: (_, subject) => (
        <Badge variant="muted" className="font-mono">
          Sem {subject.semester}
        </Badge>
      ),
    },
    {
      key: "credits",
      label: "Credits",
      sortable: true,
      render: (_, subject) => (
        <span className="font-medium text-white">{subject.credits}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (_, subject) => (
        <Badge
          variant={
            subject.type === "Lab"
              ? "warning"
              : subject.type === "Project"
              ? "purple"
              : "primary"
          }
        >
          {subject.type}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_, subject) => (
        <Badge variant={subject.status === "active" ? "success" : "danger"}>
          {subject.status === "active" ? (
            <CheckCircle2 className="mr-1 h-3 w-3" />
          ) : (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {subject.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, subject) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(subject)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(subject)}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Subjects"
        description="Manage subjects, courses, and curriculum across departments"
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
              label: "Total Subjects",
              value: MOCK_SUBJECTS.length,
              color: "blue",
            },
            {
              label: "Theory Courses",
              value: MOCK_SUBJECTS.filter((s) => s.type === "Theory").length,
              color: "green",
            },
            {
              label: "Lab Courses",
              value: MOCK_SUBJECTS.filter((s) => s.type === "Lab").length,
              color: "amber",
            },
            {
              label: "Active Subjects",
              value: MOCK_SUBJECTS.filter((s) => s.status === "active").length,
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

        {/* Filters & Actions */}
        <motion.div
          variants={ANIMATION_VARIANTS.fadeUp}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-40 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Departments</option>
              {MOCK_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-32 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Types</option>
              <option value="Theory">Theory</option>
              <option value="Lab">Lab</option>
              <option value="Project">Project</option>
            </select>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={ANIMATION_VARIANTS.fadeUp}
          initial="initial"
          animate="animate"
        >
          <DataTable columns={columns} data={filteredSubjects} />
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSelectedSubject(null);
        }}
        title={selectedSubject ? "Edit Subject" : "Create New Subject"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Subject Code
              </label>
              <Input
                placeholder="CS501"
                defaultValue={selectedSubject?.code}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Credits
              </label>
              <Input
                type="number"
                placeholder="4"
                defaultValue={selectedSubject?.credits}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Subject Name
            </label>
            <Input
              placeholder="Database Management Systems"
              defaultValue={selectedSubject?.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Department
              </label>
              <select
                defaultValue={selectedSubject?.deptCode}
                className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {MOCK_DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Semester
              </label>
              <select
                defaultValue={selectedSubject?.semester.toString()}
                className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Type
              </label>
              <select
                defaultValue={selectedSubject?.type}
                className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Theory">Theory</option>
                <option value="Lab">Lab</option>
                <option value="Project">Project</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                defaultValue={selectedSubject?.status}
                className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Faculty
            </label>
            <Input
              placeholder="Dr. Ramesh Kumar"
              defaultValue={selectedSubject?.faculty}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Faculty Email
            </label>
            <Input
              type="email"
              placeholder="faculty@ssiet.ac.in"
              defaultValue={selectedSubject?.facultyEmail}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              rows={3}
              placeholder="Subject description..."
              defaultValue={selectedSubject?.description}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateOpen(false);
                setSelectedSubject(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>
              {selectedSubject ? "Update Subject" : "Create Subject"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedSubject(null);
        }}
        title="Delete Subject"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {selectedSubject?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedSubject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedSubject(null);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Subject
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
