"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Lock, AlertCircle, ArrowLeft,
  GraduationCap, CheckCircle, Shield, Hash
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { loginUser } from "@/lib/api";

export default function StudentLoginPage() {
  const router = useRouter();
  const [roll,    setRoll]    = useState("");
  const [pass,    setPass]    = useState("");
  const [showP,   setShowP]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // POST /api/auth/login with role=student
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!roll.trim() || !pass.trim()) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const res = await loginUser({ role: "student", identifier: roll.trim(), password: pass });
      const u = res.user;
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("role",            "student");
      sessionStorage.setItem("user_id",         String(u.id));
      sessionStorage.setItem("identifier",      u.identifier);
      sessionStorage.setItem("full_name",       u.full_name);
      sessionStorage.setItem("name",            u.full_name);
      sessionStorage.setItem("studentName",     u.full_name);
      if (u.roll_number) sessionStorage.setItem("roll_number", u.roll_number);
      router.push("/student/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      if (msg.includes("BACKEND_DOWN")) {
        setError("⚠️ Backend server is not running. Start it with: uvicorn main:app --reload --port 8000");
      } else if (msg.includes("401") || msg.includes("Invalid")) {
        setError("Invalid roll number or password.");
      } else {
        setError(msg.replace(/^\d+:/, ""));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#14532D 0%,#15803D 55%,#16A34A 100%)" }}>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-24 -right-12 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <Shield size={17} style={{ color: "rgba(255,255,255,0.9)" }} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">LMSGuard</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>Examination Security Platform</p>
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
            <GraduationCap size={11} /> Student Exam Login
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Student<br />Exam Portal
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            Sign in with your roll number and password to access your assigned examinations
            in a secure AI-monitored environment.
          </p>
          <div className="space-y-2 pt-2">
            {["View your assigned assessments", "AI-monitored secure exam sessions",
              "Real-time question navigation", "Instant submission confirmation"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={13} style={{ color: "#86EFAC" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          LMSGuard · Examination Security Platform
        </p>
      </div>

      {/* ── Right login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-5 left-5">
          <Link href="/role-select">
            <motion.button whileHover={{ x: -2 }} className="flex items-center gap-1.5 text-sm"
              style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={14} /> Back
            </motion.button>
          </Link>
        </div>
        <div className="absolute top-5 right-5"><ThemeToggle /></div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#16A34A,#15803D)" }}>
              <GraduationCap size={20} className="text-white" />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3"
                style={{ background: "rgba(22,163,74,0.1)", color: "var(--success)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <GraduationCap size={10} /> Student Exam Login
              </div>
              <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
                Sign in to your Portal
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Enter your roll number and password to access exams.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Roll Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>Roll Number</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }} />
                  <input id="student-roll" type="text" value={roll}
                    onChange={e => setRoll(e.target.value)} autoFocus
                    placeholder="e.g. 21AI001" className="input-field pl-10 !rounded-xl" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}>Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }} />
                  <input id="student-password" type={showP ? "text" : "password"}
                    value={pass} onChange={e => setPass(e.target.value)}
                    placeholder="••••••••" className="input-field pl-10 pr-11 !rounded-xl" />
                  <button type="button" onClick={() => setShowP(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}>
                    {showP ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-xl"
                    style={{ color: "var(--danger)", background: "var(--danger-soft)", border: "1px solid var(--danger-border)" }}>
                    <AlertCircle size={13} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button id="student-login-submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#16A34A,#15803D)", boxShadow: "0 4px 16px rgba(22,163,74,0.3)" }}>
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />Signing in…</>
                ) : <><GraduationCap size={14} /> Login</>}
              </motion.button>
            </form>

            {/* Info box */}
            <div className="mt-6 px-4 py-3 rounded-xl text-center"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Your Student ID is created by your teacher or admin.
                Contact them if you don't have login credentials.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
