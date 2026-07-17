"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Key } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const DEMO = { email: "rahul@ssiet.ac.in", password: "student123", regno: "22CS101" };

export default function StudentLoginPage() {
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const [form, setForm]     = useState({ email: DEMO.email, password: DEMO.password, regno: DEMO.regno });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    if (form.email !== DEMO.email || form.password !== DEMO.password) {
      setError("Invalid credentials. Use rahul@ssiet.ac.in / student123");
      setLoading(false);
      return;
    }

    login({ role: "student", userId: "STU001", userName: "Rahul Kumar", userEmail: form.email, userAvatar: "RK", userDept: "Computer Science" });
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-success/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        className="w-full max-w-[400px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success/10 border border-success/20 mb-4">
            <GraduationCap className="w-7 h-7 text-success" />
          </div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Student Portal</h1>
          <p className="text-[13.5px] text-text-muted mt-1">LMSGuard V2 · Secure Examination</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type="email" value={form.email} onChange={set("email")} required className="input-premium pl-9 w-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Register Number</label>
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input value={form.regno} onChange={set("regno")} placeholder="22CS101" className="input-premium pl-9 w-full font-mono" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={set("password")}
                  required className="input-premium pl-9 pr-9 w-full" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 text-text-muted">
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/8 border border-danger/20">
                <AlertCircle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-danger/90">{error}</p>
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className={cn("btn btn-primary w-full justify-center py-2.5 text-[13.5px]", loading && "opacity-70 cursor-not-allowed")}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                <span className="flex items-center gap-2">Login <ArrowRight className="w-3.5 h-3.5" /></span>
              )}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-surface-2 border border-white/5">
            <p className="text-[11.5px] text-text-muted text-center">
              Demo: <span className="text-text-secondary font-medium">rahul@ssiet.ac.in</span> / <span className="text-text-secondary font-medium">student123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
