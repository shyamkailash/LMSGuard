"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ExamControlPanel from "@/components/ExamControlPanel";
import StatsCard from "@/components/StatsCard";
import { Users, UserCheck, WifiOff, UserMinus, Monitor, CheckCircle, Search, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [examId] = useState("EX001");
  const [classId] = useState("CSE-3A");
  const [examName] = useState("DBMS Final Exam");
  const [examStatus, setExamStatus] = useState("NOT_STARTED");
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

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
        // If we have students, derive exam status from any IN_EXAM or just assume if we have joined students it's started
        // Ideally we'd have a GET /api/exam/status endpoint, but we can infer or hardcode for demo.
        if (stuData.some((s:any) => s.status === 'WAITING_START' || s.status === 'IN_EXAM')) {
           setExamStatus("STARTED");
        } else if (stuData.every((s:any) => s.status === 'QUIT_APPROVED' || s.status === 'COMPLETED') && stuData.length > 0) {
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
          created_by_role: "invigilator"
        })
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
          approved_by_role: "invigilator"
        })
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
          approved_by_role: "invigilator"
        })
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

  const filteredStudents = students.filter(s => 
    s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.student_name && s.student_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Control and Monitor Examination">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
              {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <ExamControlPanel 
          examId={examId} classId={classId} examName={examName} status={examStatus}
          onStartExam={handleStartExam} onQuitAll={handleQuitAll} onRefresh={fetchStatus} isLoading={loading}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="Total Students" value={summary?.total_students || 0} icon={Users} color="blue" index={0} />
          <StatsCard title="Joined" value={summary?.joined_students || 0} icon={UserCheck} color="green" index={1} />
          <StatsCard title="Network Issue" value={summary?.network_issue_students || 0} icon={WifiOff} color="yellow" index={2} />
          <StatsCard title="Absent" value={summary?.absent_students || 0} icon={UserMinus} color="red" index={3} />
          <StatsCard title="In Exam" value={summary?.in_exam_students || 0} icon={Monitor} color="indigo" index={4} />
          <StatsCard title="Completed/Quit" value={summary?.completed_students || 0} icon={CheckCircle} color="teal" index={5} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-gray-800 text-lg">Student Management</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by roll number..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Roll Number</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Network Status</th>
                  <th className="px-6 py-4">Joined Time</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No students found.</td></tr>
                ) : (
                  filteredStudents.map((s, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={s.roll_number} className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{s.roll_number}</td>
                      <td className="px-6 py-4">{s.student_name || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide
                          ${s.status === 'IN_EXAM' ? 'bg-indigo-100 text-indigo-700' :
                            s.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                            s.status === 'COMPLETED' || s.status === 'QUIT_APPROVED' ? 'bg-teal-100 text-teal-700' :
                            'bg-gray-100 text-gray-700'}`}>
                          {s.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide
                          ${s.network_status === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {s.network_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[12px] text-gray-500">
                        {s.joined_at ? new Date(s.joined_at).toLocaleTimeString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleQuitStudent(s.roll_number)}
                          disabled={s.status === 'ABSENT' || s.status === 'COMPLETED' || s.status === 'QUIT_APPROVED'}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
                        >
                          Quit Exam
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
