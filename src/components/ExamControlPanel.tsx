"use client";
import { useState } from "react";
import { Play, Square, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ExamControlPanelProps {
  examId: string;
  classId: string;
  examName: string;
  status: string;
  onStartExam: () => void;
  onQuitAll: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function ExamControlPanel({
  examId,
  classId,
  examName,
  status,
  onStartExam,
  onQuitAll,
  onRefresh,
  isLoading
}: ExamControlPanelProps) {
  const isStarted = status === "STARTED";
  const isEnded = status === "ALL_RELEASED";

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-bold text-gray-900">{examName}</h2>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider
              ${isStarted ? 'bg-green-100 text-green-700' : isEnded ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
              {isStarted ? "STARTED" : isEnded ? "ENDED" : "NOT STARTED"}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Class: <span className="text-gray-900">{classId}</span> <span className="mx-2">•</span> 
            Exam ID: <span className="text-gray-900">{examId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={onStartExam}
            disabled={isStarted || isEnded || isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-50 transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}
          >
            <Play size={16} />
            Start Exam
          </button>
          
          <button
            onClick={onQuitAll}
            disabled={!isStarted || isEnded || isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-50 transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" }}
          >
            <Square size={16} />
            Quit All Students
          </button>
        </div>
      </div>
    </div>
  );
}
