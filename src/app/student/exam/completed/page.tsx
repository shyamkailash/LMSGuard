"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ExamCompletedPage() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState("");
  const [examId] = useState("EX001");
  const [completedTime, setCompletedTime] = useState("");

  useEffect(() => {
    const rNo = sessionStorage.getItem("roll_number") || "21AI001";
    setRollNumber(rNo);
    
    const now = new Date();
    setCompletedTime(now.toLocaleString());
  }, []);

  return (
    <DashboardLayout title="Student Dashboard" subtitle="Exam Status">
      <div className="max-w-xl mx-auto mt-16 px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100 text-center relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal-50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Success Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mb-8 shadow-sm ring-8 ring-teal-50"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            
            <h1 className="text-[32px] font-extrabold text-gray-900 mb-3 tracking-tight">
              Exam Completed
            </h1>
            
            <p className="text-[15px] text-gray-600 mb-10 max-w-sm leading-relaxed">
              Your exam has been submitted and closed by the invigilator. Thank you for your participation.
            </p>
            
            {/* Details Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl w-full p-6 mb-8 text-left space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                <span className="text-sm font-medium text-gray-500">Roll Number</span>
                <span className="font-bold text-gray-900 text-sm bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">{rollNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                <span className="text-sm font-medium text-gray-500">Exam ID</span>
                <span className="font-bold text-gray-900 text-sm">{examId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Completed Time</span>
                <span className="font-bold text-gray-900 text-sm">{completedTime}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push("/student/dashboard")}
              className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Student Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
