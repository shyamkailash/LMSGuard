"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserCog } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { INVIGILATOR_PROFILES } from "@/mock/invigilators";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { email: "john.martin@ssiet.ac.in",  label: "John Martin (CSE)"  },
  { email: "sarah.thomas@ssiet.ac.in", label: "Sarah Thomas (CSE)" },
  { email: "ravi.sharma@ssiet.ac.in",  label: "Ravi Sharma (ECE)"  },
];

export default function InvigilatorLoginPage() {
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const [email,    setEmail]    = useState("john.martin@ssiet.ac.in");
  const [password, setPassword] = useState("inv123");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const profile = INVIGILATOR_PROFILES.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );

    if (!profile || password !== "inv123") {
      setError("Invalid credentials. Use any invigilator email with password: inv123");
      setLoading(false);
      return;
    }

    login({
      role:       "invigilator",
      userId:     profile.id,
      userName:   profile.name,
      userEmail:  profile.email,
      userAvatar: profile.avatar,
      userDept:   profile.department,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-cyan/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        className="w-full max-w-[400px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 mb-4">
            <UserCog className="w-7 h-7 text-cyan" />
          </div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Invigilator Portal</h1>
          <p className="text-[13.5px] text-text-muted mt-1">LMSGuard V2 · Exam Monitoring</p>
        </div>

        <div className="card p-6">
          {/* Demo quick-pick */}
          <div className="mb-4 p-3 rounded-xl bg-surface-2 border border-white/5">
            <p className="text-[11px] text-text-muted mb-2 uppercase tracking-wide font-medium">Quick Login</p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  onClick={() => setEmail(a.email)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border",
                    email === a.email
                      ? "bg-cyan/15 text-cyan border-cyan/25"
                      : "bg-surface-3/50 text-text-muted border-white/5 hover:border-white/10"
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required className="input-premium pl-9 w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type={showPwd ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required className="input-premium pl-9 pr-9 w-full"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 text-text-muted hover:text-text-secondary">
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
              className={cn("btn btn-primary w-full justify-center py-2.5 text-[13.5px] mt-1", loading && "opacity-70 cursor-not-allowed")}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight className="w-3.5 h-3.5" /></span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-text-muted mt-5">
          Admin?{" "}
          <a href="/admin/login" className="text-primary hover:text-blue-400 transition-colors font-medium">Admin Portal</a>
        </p>
      </motion.div>
    </div>
  );
}
