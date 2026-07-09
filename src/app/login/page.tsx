"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Shield, Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

type Role = "admin" | "student" | "invigilator";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const roleConfig = {
    admin: {
      label: "Admin email or Admin ID",
      buttonText: "Login to Admin",
      subtitle: "Login with your Admin email to open the Admin dashboard.",
      placeholder: "admin@lmsguard.edu",
      redirect: "/admin/dashboard",
      demoName: "Admin User",
    },
    student: {
      label: "Roll Number",
      buttonText: "Login to Student",
      subtitle: "Login with your Roll Number to enter the student portal.",
      placeholder: "e.g., 21AI001",
      redirect: "/student/dashboard",
      demoName: "Student User",
    },
    invigilator: {
      label: "College Mail ID",
      buttonText: "Login to Invigilator",
      subtitle: "Login with your College Mail ID to monitor your class.",
      placeholder: "teacher@college.edu",
      redirect: "/dashboard",
      demoName: "Invigilator User",
    }
  };

  const currentConfig = roleConfig[role];

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setError(""); 
    setLoading(true);
    
    // TODO: Replace demo login with database-backed authentication.
    // e.g. POST /api/auth/login
    await new Promise(r => setTimeout(r, 1000));
    
    // Simulate successful login
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("user_id", identifier);
    sessionStorage.setItem("identifier", identifier);
    sessionStorage.setItem("full_name", currentConfig.demoName);
    
    if (role === "student") {
        sessionStorage.setItem("roll_number", identifier);
        sessionStorage.setItem("student_id", identifier);
    }
    
    router.push(currentConfig.redirect);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 right-0 h-80 pointer-events-none" style={{ background:"linear-gradient(180deg,rgba(255,255,255,0.8) 0%,transparent 100%)" }}/>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background:"#93C5FD" }}/>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background:"#A7F3D0" }}/>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-[440px] bg-white rounded-[2rem] p-8 sm:p-10 z-10"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.04)"
        }}
      >
        {/* Top Icon & Extras */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
               style={{ background: "#F5F3FF" }}>
            <Shield size={24} style={{ color: "#7C3AED" }} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {currentConfig.subtitle}
        </p>

        {/* Role Selectors */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["admin", "student", "invigilator"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setIdentifier(""); setPassword(""); setError(""); }}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                role === r 
                  ? "text-white shadow-md"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
              style={{
                background: role === r ? "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" : undefined,
              }}
            >
              {roleConfig[r].buttonText}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {currentConfig.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)}
                placeholder={currentConfig.placeholder} 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type={showPass ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••" 
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-cyan-500 checked:border-cyan-500 transition-colors cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 select-none">Remember me</span>
            </label>
            <button type="button" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
              Forgot password?
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70 mt-4 shadow-lg shadow-cyan-500/25"
            style={{ background: "linear-gradient(135deg, #06B6D4 0%, #10B981 100%)" }}
          >
            {loading ? (
              <motion.div animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:"linear" }}
                className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"/>
            ) : (
              <>Login <span className="ml-1 opacity-80">→</span></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
