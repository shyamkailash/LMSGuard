"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Zap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { MOCK_ADMIN_ACCOUNTS } from "@/mock/invigilators";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const [email,    setEmail]    = useState("admin@ssiet.ac.in");
  const [password, setPassword] = useState("admin123");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const account = MOCK_ADMIN_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!account) {
      setError("Invalid credentials. Try admin@ssiet.ac.in / admin123");
      setLoading(false);
      return;
    }

    login({
      role:       "admin",
      userId:     account.id,
      userName:   account.name,
      userEmail:  account.email,
      userAvatar: account.avatar,
      userDept:   account.department,
    });
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        className="w-full max-w-[400px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 relative">
            <Shield className="w-7 h-7 text-primary" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <Zap className="w-2 h-2 text-white" />
            </div>
          </div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Admin Portal</h1>
          <p className="text-[13.5px] text-text-muted mt-1">LMSGuard V2 · AI Monitoring Platform</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ssiet.ac.in"
                  required
                  className="input-premium pl-9 w-full"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-premium pl-9 pr-9 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/8 border border-danger/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-danger/90">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "btn btn-primary w-full justify-center py-2.5 text-[13.5px] mt-1",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-xl bg-surface-2 border border-white/5">
            <p className="text-[11.5px] text-text-muted text-center">
              Demo: <span className="text-text-secondary font-medium">admin@ssiet.ac.in</span> / <span className="text-text-secondary font-medium">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] text-text-muted mt-5">
          Not an admin?{" "}
          <a href="/login" className="text-primary hover:text-blue-400 transition-colors font-medium">
            Invigilator login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
