"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Send, Clock, Shield, AlertCircle, CheckCircle, Code2, Layout, FileTerminal } from "lucide-react";

export default function ExamPage() {
  const router = useRouter();
  const [code, setCode] = useState("def solve():\n    # Write your code here\n    pass");
  const [language, setLanguage] = useState("python");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  
  const examId = "EX001";
  const rollNumber = typeof window !== 'undefined' ? sessionStorage.getItem("roll_number") || "21AI001" : "21AI001";

  // Heartbeat & Status polling
  useEffect(() => {
    const sId = sessionStorage.getItem("student_id") || "student-001";
    const rNo = sessionStorage.getItem("roll_number") || "21AI001";

    const heartbeatInterval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/student/exam/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: sId, roll_number: rNo, exam_id: examId })
      }).catch(console.error);
    }, 10000);

    const statusInterval = setInterval(() => {
      fetch(`http://127.0.0.1:8000/api/student/exam/status/${examId}/${rNo}`)
        .then(res => res.json())
        .then(data => {
          if (data.redirect_to_completed || data.student_status === "QUIT_APPROVED" || data.student_status === "COMPLETED") {
            router.push("/student/exam/completed");
          }
        })
        .catch(console.error);
    }, 5000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(statusInterval);
    };
  }, [router]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTestResults([
        { id: 1, input: "5", expected: "25", got: "25", status: "passed" },
        { id: 2, input: "10", expected: "100", got: "100", status: "passed" },
        { id: 3, input: "-3", expected: "9", got: "-9", status: "failed" },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      await fetch("http://127.0.0.1:8000/api/student/exam/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: examId,
          roll_number: rollNumber,
          question_id: "Q1",
          language: language,
          code: code,
          result_status: "SUBMITTED"
        })
      });
      // Just mock successful submission
      setTimeout(() => {
          alert("Code submitted successfully. You can continue editing or wait for the invigilator to close the exam.");
          setIsSubmitting(false);
      }, 500);
    } catch (e) {
      alert("Failed to submit code. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-300 font-sans">
      {/* Top Header */}
      <header className="h-14 bg-[#1E293B] border-b border-slate-700/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-blue-400" />
            <span className="font-bold text-white tracking-wide">LMSGuard Coding Exam</span>
          </div>
          <div className="h-4 w-px bg-slate-600" />
          <span className="text-sm text-slate-400 font-medium">DBMS Final Exam</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <Clock size={15} className={timeLeft < 300 ? "text-red-400" : "text-emerald-400"} />
            <span className={`text-sm font-bold font-mono tracking-wider ${timeLeft < 300 ? "text-red-400" : "text-emerald-400"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
              {rollNumber}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IN EXAM
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Problem Statement */}
        <div className="w-[40%] flex flex-col border-r border-slate-700/50 bg-[#0F172A]">
          <div className="h-12 border-b border-slate-700/50 flex items-center px-5 shrink-0 bg-[#1E293B]/50">
            <Layout size={16} className="text-slate-400 mr-2" />
            <span className="text-sm font-semibold text-slate-200">Problem Description</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
            <h1 className="text-2xl font-bold text-white mb-2">1. Square of a Number</h1>
            <div className="flex items-center gap-2 mb-6 text-xs font-medium">
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">Marks: 10</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Easy</span>
            </div>
            
            <div className="prose prose-invert max-w-none text-sm text-slate-300">
              <p>Write a program that takes an integer <code className="bg-slate-800 px-1 rounded">N</code> as input and prints its square.</p>
              
              <h3 className="text-white mt-6 font-semibold">Input Format</h3>
              <p>A single integer N.</p>
              
              <h3 className="text-white mt-6 font-semibold">Output Format</h3>
              <p>Print the square of N.</p>
              
              <h3 className="text-white mt-6 font-semibold">Example 1</h3>
              <div className="bg-[#1E293B] p-4 rounded-lg font-mono text-sm border border-slate-700/50 mt-2">
                <div className="text-slate-500 mb-1">Input:</div>
                <div className="text-white mb-3">5</div>
                <div className="text-slate-500 mb-1">Output:</div>
                <div className="text-white">25</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Panel: Code Editor & Terminal */}
        <div className="flex-1 flex flex-col bg-[#0F172A] min-w-0">
          
          {/* Editor Header */}
          <div className="h-12 border-b border-slate-700/50 flex items-center justify-between px-4 shrink-0 bg-[#1E293B]/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Code2 size={16} />
                <span className="text-sm font-semibold text-slate-200">Code Editor</span>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#0F172A] border border-slate-700 text-sm rounded px-3 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {isRunning ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Play size={14} />}
                Run Code
              </button>
              <button 
                onClick={handleSubmitCode}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Send size={14} />
                Submit Code
              </button>
            </div>
          </div>
          
          {/* Editor Area */}
          <div className="flex-1 p-4 relative">
            {/* Simple Textarea Editor as placeholder for Monaco */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-transparent text-slate-300 font-mono text-sm leading-relaxed resize-none focus:outline-none"
              style={{ tabSize: 4 }}
            />
          </div>

          {/* Result Terminal Panel */}
          <div className="h-64 border-t border-slate-700/50 bg-[#1E293B] flex flex-col shrink-0">
            <div className="h-10 border-b border-slate-700/50 flex items-center px-4 bg-[#0F172A]/50">
              <FileTerminal size={14} className="text-slate-400 mr-2" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Test Results</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {!testResults ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">
                  Run your code to see test results here.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    {testResults.every(t => t.status === 'passed') ? (
                       <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm"><CheckCircle size={16}/> Passed all test cases!</span>
                    ) : (
                       <span className="text-red-400 font-bold flex items-center gap-1.5 text-sm"><AlertCircle size={16}/> Some test cases failed</span>
                    )}
                  </div>
                  
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700">
                        <th className="pb-2 font-medium">Input</th>
                        <th className="pb-2 font-medium">Expected Output</th>
                        <th className="pb-2 font-medium">Your Output</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {testResults.map((t) => (
                        <tr key={t.id} className="text-slate-300 font-mono text-xs">
                          <td className="py-3">{t.input}</td>
                          <td className="py-3">{t.expected}</td>
                          <td className="py-3">{t.got}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded font-bold ${t.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
