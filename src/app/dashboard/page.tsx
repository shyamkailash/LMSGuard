"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ExamControlPanel from "@/components/ExamControlPanel";
import StatsCard from "@/components/StatsCard";
import {
  Users,
  UserCheck,
  WifiOff,
  UserMinus,
  Monitor,
  CheckCircle,
  Search,
  AlertCircle,
  ShieldCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MonitorRow {
  rollNumber: string;
  studentName: string;
  agentStatus: string;
  sebStatus: string;
  networkStatus: string;
  lastHeartbeat: string;
  examStatus: string;
}

export default function DashboardPage() {
  const [examId] = useState("EX001");
  const [classId] = useState("CSE-3A");
  const [examName] = useState("DBMS Final Exam");
  const [examStatus, setExamStatus] = useState("NOT_STARTED");
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [configForm, setConfigForm] = useState({
    examId,
    classId,
    moodleQuizUrl: "",
  });
  const [configSaving, setConfigSaving] = useState(false);
  const [configMessage, setConfigMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const sumRes = await fetch(`http://127.0.0.1:8000/api/exam/dashboard-summary/${examId}`);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }

      const stuRes = await fetch(`http://127.0.0.1:8000/api/exam/students/${examId}`);
      if (stuRes.ok) {
        const stuData = await stuRes.json();
        setStudents(stuData);
        if (stuData.some((s: any) => s.status === "WAITING_START" || s.status === "IN_EXAM")) {
          setExamStatus("STARTED");
        } else if (stuData.every((s: any) => s.status === "QUIT_APPROVED" || s.status === "COMPLETED") && stuData.length > 0) {
          setExamStatus("ALL_RELEASED");
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: examId,
          exam_name: examName,
          class_id: classId,
          created_by: "invigilator-001",
          created_by_role: "invigilator",
        }),
      });
      if (res.ok) {
        setExamStatus("STARTED");
        setMessage({ text: "Exam started successfully. Students will receive confirmation popup.", type: "success" });
        fetchStatus();
      }
    } catch (e) {
      setMessage({ text: "Failed to start exam.", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleQuitAll = async () => {
    if (!confirm("Are you sure you want to release all students from this exam?")) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/exam/quit-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: examId,
          approved_by: "invigilator-001",
          approved_by_role: "invigilator",
        }),
      });
      if (res.ok) {
        setExamStatus("ALL_RELEASED");
        setMessage({ text: "All students have been released.", type: "success" });
        fetchStatus();
      }
    } catch (e) {
      setMessage({ text: "Failed to quit all students.", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleQuitStudent = async (rollNumber: string) => {
    if (!confirm(`Are you sure you want to quit exam for ${rollNumber}?`)) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/exam/quit-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: examId,
          roll_number: rollNumber,
          approved_by: "invigilator-001",
          approved_by_role: "invigilator",
        }),
      });
      if (res.ok) {
        setMessage({ text: `Student ${rollNumber} has been quit from the exam.`, type: "success" });
        fetchStatus();
      }
    } catch (e) {
      setMessage({ text: "Failed to quit student.", type: "error" });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    setConfigMessage(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/seb/exam/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: configForm.examId || examId,
          exam_name: examName,
          class_id: configForm.classId || classId,
          moodle_quiz_url: configForm.moodleQuizUrl,
          seb_required: 1,
          created_by: "invigilator-001",
          created_by_role: "invigilator",
        }),
      });
      if (!res.ok) {
        throw new Error("Unable to save configuration");
      }
      setConfigMessage({ text: "SEB configuration saved successfully.", type: "success" });
    } catch (e) {
      setConfigMessage({ text: "Could not save the configuration. Please ensure the backend is running.", type: "error" });
    }
    setConfigSaving(false);
    setTimeout(() => setConfigMessage(null), 5000);
  };

  const handleCopyGatewayUrl = async () => {
    const gatewayUrl = `http://localhost:3000/seb/gateway?exam_id=${encodeURIComponent(configForm.examId || examId)}&roll_number=student1`;
    try {
      await navigator.clipboard.writeText(gatewayUrl);
      setConfigMessage({ text: "Gateway URL copied to clipboard.", type: "success" });
    } catch {
      setConfigMessage({ text: "Clipboard access was blocked. Copy the URL manually.", type: "error" });
    }
    setTimeout(() => setConfigMessage(null), 4000);
  };

  const monitorRows: MonitorRow[] = students.map((s: any) => {
    const status = String(s.status || "ABSENT");
    const network = String(s.network_status || "UNKNOWN");
    return {
      rollNumber: s.roll_number || "-",
      studentName: s.student_name || "N/A",
      agentStatus: status === "ABSENT" ? "Offline" : "Online",
      sebStatus: status === "IN_EXAM" || status === "COMPLETED" || status === "QUIT_APPROVED" ? "Opened" : "Not Opened",
      networkStatus: network === "NETWORK_ISSUE" ? "Network Issue" : network,
      lastHeartbeat: s.last_seen_at || s.joined_at || "-",
      examStatus: status.replace(/_/g, " "),
    };
  });

  const filteredStudents = monitorRows.filter((s) =>
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const agentOnlineCount = monitorRows.filter((s) => s.agentStatus === "Online").length;
  const sebOpenedCount = monitorRows.filter((s) => s.sebStatus === "Opened").length;

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Control and Monitor Examination">
      <div className="mx-auto max-w-7xl space-y-6">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
                message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <ExamControlPanel
          examId={examId}
          classId={classId}
          examName={examName}
          status={examStatus}
          onStartExam={handleStartExam}
          onQuitAll={handleQuitAll}
          onRefresh={fetchStatus}
          isLoading={loading}
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-7">
          <StatsCard title="Total Students" value={summary?.total_students || students.length || 0} icon={Users} color="blue" index={0} />
          <StatsCard title="Agent Online" value={agentOnlineCount} icon={ShieldCheck} color="green" index={1} />
          <StatsCard title="SEB Opened" value={sebOpenedCount} icon={Monitor} color="purple" index={2} />
          <StatsCard title="Absent" value={summary?.absent_students || 0} icon={UserMinus} color="red" index={3} />
          <StatsCard title="Network Issue" value={summary?.network_issue_students || 0} icon={WifiOff} color="yellow" index={4} />
          <StatsCard title="In Exam" value={summary?.in_exam_students || 0} icon={UserCheck} color="blue" index={5} />
          <StatsCard title="Completed" value={summary?.completed_students || 0} icon={CheckCircle} color="purple" index={6} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">SEB / Agent Monitoring</h3>
                <p className="text-sm text-gray-500">Live status for each student session.</p>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50/80 text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Roll Number</th>
                    <th className="px-5 py-4 font-medium">Student Name</th>
                    <th className="px-5 py-4 font-medium">Agent Status</th>
                    <th className="px-5 py-4 font-medium">SEB Status</th>
                    <th className="px-5 py-4 font-medium">Network Status</th>
                    <th className="px-5 py-4 font-medium">Last Heartbeat</th>
                    <th className="px-5 py-4 font-medium">Exam Status</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                        No matching students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, i) => (
                      <motion.tr
                        key={s.rollNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4 font-semibold text-gray-900">{s.rollNumber}</td>
                        <td className="px-5 py-4">{s.studentName}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.agentStatus === "Online" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                            {s.agentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.sebStatus === "Opened" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                            {s.sebStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.networkStatus === "Network Issue" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                            {s.networkStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-[12px] text-gray-500">{s.lastHeartbeat}</td>
                        <td className="px-5 py-4 text-gray-600">{s.examStatus}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <a
                              href="/monitoring"
                              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700"
                            >
                              <ExternalLink size={12} /> View Monitor
                            </a>
                            <button
                              onClick={() => handleQuitStudent(s.rollNumber)}
                              className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700"
                            >
                              Quit Exam
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Moodle + SEB Configuration</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Exam ID</label>
                  <input
                    value={configForm.examId}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, examId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Class ID</label>
                  <input
                    value={configForm.classId}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, classId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Moodle Quiz URL</label>
                  <input
                    value={configForm.moodleQuizUrl}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, moodleQuizUrl: e.target.value }))}
                    placeholder="https://moodle.example.com/mod/quiz/view.php?id=123"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSaveConfig}
                    disabled={configSaving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {configSaving ? "Saving..." : "Save Config"}
                  </button>
                  <button
                    onClick={handleCopyGatewayUrl}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                  >
                    <Copy size={14} /> Copy SEB Gateway URL
                  </button>
                </div>

                {configMessage && (
                  <div className={`rounded-lg border px-3 py-2 text-sm ${configMessage.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {configMessage.text}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">Gateway URL format</p>
              <p className="mt-2 break-all font-mono text-xs text-slate-600">
                http://localhost:3000/seb/gateway?exam_id=EX001&roll_number=student1
              </p>
              <p className="mt-3 text-xs text-gray-500">
                For another student PC, replace localhost with the teacher or server IP address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
