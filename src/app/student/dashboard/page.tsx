"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Loader2, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function StudentDashboard() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const examId = "EX001";
  const classId = "CSE-3A";
  
  const [statusMsg, setStatusMsg] = useState("Connecting to exam lobby...");
  const [showPopup, setShowPopup] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const sId = sessionStorage.getItem("student_id") || "student-001";
    const rNo = sessionStorage.getItem("roll_number") || "21AI001";
    const sName = sessionStorage.getItem("full_name") || "Test Student";
    setStudentId(sId);
    setRollNumber(rNo);
    setStudentName(sName);

    // 1. Join Lobby
    fetch("http://127.0.0.1:8000/api/student/exam/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: sId, roll_number: rNo, student_name: sName, exam_id: examId, class_id: classId })
    }).then(res => {
        if(res.ok) {
            setStatusMsg("Waiting for invigilator to start the exam...");
        }
    }).catch(e => setStatusMsg("Failed to connect to lobby. Retrying..."));

    // 2. Poll Status every 5 seconds
    const pollInterval = setInterval(() => {
      fetch(`http://127.0.0.1:8000/api/student/exam/status/${examId}/${rNo}`)
        .then(res => res.json())
        .then(data => {
          if (data.redirect_to_completed) {
            router.push("/student/exam/completed");
          } else if (data.student_status === "IN_EXAM") {
            router.push("/student/exam");
          } else if (data.show_start_popup) {
            setShowPopup(true);
            setStatusMsg("Exam has been started by your invigilator.");
          } else if (data.message) {
            setStatusMsg(data.message);
          }
        })
        .catch(console.error);
    }, 5000);

    // 3. Heartbeat every 10 seconds
    const heartbeatInterval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/student/exam/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: sId, roll_number: rNo, exam_id: examId })
      }).catch(console.error);
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(heartbeatInterval);
    };
  }, [router]);

  const handleConfirmStart = async () => {
    setConfirming(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/exam/confirm-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, roll_number: rollNumber, exam_id: examId })
      });
      if (res.ok) {
        router.push("/student/exam");
      } else {
        setConfirming(false);
      }
    } catch (e) {
      console.error(e);
      setConfirming(false);
    }
  };

  return (
    <DashboardLayout title="Student Dashboard" subtitle="Exam Lobby">
      <div className="max-w-2xl mx-auto mt-10">
        
        <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <GraduationCap size={40} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Welcome, {studentName || rollNumber}
            </h2>
            
            <p className="text-gray-500 mb-8 max-w-md">
              You are in the exam lobby. Please wait here until the invigilator starts the session. Do not close this tab.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 w-full max-w-sm flex items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={20} />
              <span className="font-semibold text-gray-700">{statusMsg}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Start Exam Confirmation Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-400" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Exam Started</h3>
                  <p className="text-sm text-gray-500">Action Required</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-8 leading-relaxed">
                Your invigilator has started the exam. Click confirm to enter the coding exam securely.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPopup(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmStart}
                  disabled={confirming}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {confirming ? <Loader2 size={18} className="animate-spin" /> : "Confirm and Enter Exam"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
