"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Mail, Lock, Eye, EyeOff, AlertCircle,
  ArrowRight, GraduationCap, UserCog, Key, Zap,
  CheckCircle2, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { MOCK_ADMIN_ACCOUNTS } from "@/mock/invigilators";
import { cn } from "@/lib/utils";

type PortalRole = "admin" | "invigilator" | "student";

interface PortalConfig {
  role: PortalRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
  accentBorder: string;
  defaultEmail: string;
  defaultPassword: string;
  redirectTo: string;
}

const PORTALS: PortalConfig[] = [
  {
    role: "admin",
    label: "Administrator",
    description: "Full system access & monitoring",
    icon: <Shield className="w-5 h-5" />,
    accent: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    defaultEmail: "admin@ssiet.ac.in",
    defaultPassword: "admin123",
    redirectTo: "/admin/dashboard",
  },
  {
    role: "invigilator",
    label: "Invigilator",
    description: "Exam monitoring & session control",
    icon: <UserCog className="w-5 h-5" />,
    accent: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    defaultEmail: "john.martin@ssiet.ac.in",
    defaultPassword: "inv123",
    redirectTo: "/dashboard",
  },
  {
    role: "student",
    label: "Student",
    description: "Access your exams & results",
    icon: <GraduationCap className="w-5 h-5" />,
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
    defaultEmail: "rahul@ssiet.ac.in",
    defaultPassword: "student123",
    redirectTo: "/student/dashboard",
  },
];

const INVIGILATOR_CREDS = [
  { name: "John Martin",    email: "john.martin@ssiet.ac.in",  dept: "CSE", classes: "CSE-3A, CSE-3B" },
  { name: "Sarah Thomas",   email: "sarah.thomas@ssiet.ac.in", dept: "CSE", classes: "CSE-3B" },
  { name: "Ravi Sharma",    email: "ravi.sharma@ssiet.ac.in",  dept: "ECE", classes: "ECE-3A" },
  { name: "Priya Nair",     email: "priya.nair@ssiet.ac.in",   dept: "IT",  classes: "IT-2A" },
];

function validateCredentials(role: PortalRole, email: string, password: string): boolean {
  if (role === "admin") {
    return MOCK_ADMIN_ACCOUNTS.some(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
  }
  if (role === "invigilator") {
    return email === "john.martin@ssiet.ac.in" && password === "inv123"
      || email === "sarah.thomas@ssiet.ac.in"  && password === "inv123"
      || email === "ravi.sharma@ssiet.ac.in"   && password === "inv123"
      || email === "priya.nair@ssiet.ac.in"    && password === "inv123";
  }
  if (role === "student") {
    return email === "rahul@ssiet.ac.in" && password === "student123";
  }
  return false;
}

export default function AuthPage() {
  const router = useRouter();
  const login  = useAuthStore((s) => s.login);

  const [selected, setSelected] = useState<PortalRole>("admin");
  const [email,    setEmail]    = useState("admin@ssiet.ac.in");
  const [password, setPassword] = useState("admin123");
  const [showPwd,  setShowPwd]  = useState(false);
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const portal = PORTALS.find((p) => p.role === selected)!;

  const selectPortal = (p: PortalConfig) => {
    setSelected(p.role);
    setEmail(p.defaultEmail);
    setPassword(p.defaultPassword);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 950));

    if (!validateCredentials(selected, email, password)) {
      setError("Invalid credentials. Please check and try again.");
      setLoading(false);
      return;
    }

    const account = MOCK_ADMIN_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    login({
      role:       selected,
      userId:     selected === "admin" ? (account?.id ?? "ADM001") : selected === "student" ? "STU001" : "INV001",
      userName:   selected === "admin" ? (account?.name ?? "Dr. Ramesh Kumar") : selected === "student" ? "Rahul Kumar" : "John Martin",
      userEmail:  email,
      userAvatar: selected === "admin" ? (account?.avatar ?? "RK") : selected === "student" ? "RK" : "JM",
      userDept:   selected === "admin" ? (account?.department ?? "CSE") : selected === "student" ? "Computer Science & Engineering" : "Computer Science & Engineering",
    });
    router.push(portal.redirectTo);
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex items-center justify-center px-4 py-10">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-primary/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-violet-500/3 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 relative">
            <Shield className="w-7 h-7 text-primary" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <Zap className="w-2 h-2 text-white" />
            </span>
          </div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">LMSGuard V2</h1>
          <p className="text-[13px] text-text-muted mt-1">AI Powered Examination Monitoring Platform</p>
          <p className="text-[11.5px] text-text-subtle mt-0.5">Sri Shakthi Institute of Engineering & Technology</p>
        </div>

        {/* Portal Selector */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {PORTALS.map((p) => (
            <button
              key={p.role}
              onClick={() => selectPortal(p)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 text-center",
                selected === p.role
                  ? `${p.accentBg} ${p.accentBorder} shadow-sm`
                  : "bg-surface border-white/6 hover:border-white/12 hover:bg-surface-2"
              )}
            >
              <span className={cn("transition-colors", selected === p.role ? p.accent : "text-text-muted")}>
                {p.icon}
              </span>
              <span className={cn(
                "text-[11.5px] font-semibold transition-colors",
                selected === p.role ? "text-text-primary" : "text-text-muted"
              )}>
                {p.label}
              </span>
              {selected === p.role && (
                <CheckCircle2 className={cn("w-3 h-3", p.accent)} />
              )}
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className="card p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {/* Role Header */}
              <div className={cn("flex items-center gap-3 p-3 rounded-xl border mb-5", portal.accentBg, portal.accentBorder)}>
                <span className={portal.accent}>{portal.icon}</span>
                <div>
                  <div className={cn("text-[12.5px] font-semibold", portal.accent)}>{portal.label} Login</div>
                  <div className="text-[11.5px] text-text-muted">{portal.description}</div>
                </div>
              </div>

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
                      placeholder="email@ssiet.ac.in"
                      required
                      autoComplete="email"
                      className="input-premium pl-9 w-full"
                    />
                  </div>
                </div>

                {/* Student Register Number */}
                {selected === "student" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[12.5px] font-medium text-text-secondary">Register Number</label>
                    <div className="relative flex items-center">
                      <Key className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                      <input
                        defaultValue="22CS101"
                        placeholder="22CS101"
                        className="input-premium pl-9 w-full font-mono"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12.5px] font-medium text-text-secondary">Password</label>
                    <button type="button" className="text-[11.5px] text-primary hover:text-blue-400 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="input-premium pl-9 pr-9 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      className="absolute right-3 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setRemember((v) => !v)}
                    className={cn(
                      "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer",
                      remember
                        ? "bg-primary border-primary"
                        : "bg-surface-2 border-white/12 hover:border-white/20"
                    )}
                  >
                    {remember && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[12.5px] text-text-secondary">Remember me for 30 days</span>
                </label>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/8 border border-danger/20"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                      <p className="text-[12.5px] text-danger/90">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "btn btn-primary w-full justify-center py-2.5 text-[13.5px]",
                    loading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying identity…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </form>

              {/* Demo Hint */}
              <div className="mt-4 p-3 rounded-xl bg-surface-2 border border-white/5">
                <p className="text-[11px] text-text-muted font-medium mb-1.5 uppercase tracking-wide">Demo credentials</p>
                {selected === "invigilator" ? (
                  <div className="space-y-1">
                    {INVIGILATOR_CREDS.slice(0, 2).map((c) => (
                      <button
                        key={c.email}
                        type="button"
                        onClick={() => { setEmail(c.email); setPassword("inv123"); }}
                        className="w-full flex items-center justify-between text-left p-1.5 rounded-lg hover:bg-surface-3 transition-colors group"
                      >
                        <div>
                          <span className="text-[12px] text-text-secondary font-medium">{c.name}</span>
                          <span className="text-[11px] text-text-muted ml-2">{c.dept} · {c.classes}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-text-subtle group-hover:text-text-muted transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-text-muted text-center">
                    <span className="text-text-secondary font-medium">{portal.defaultEmail}</span>
                    {" / "}
                    <span className="text-text-secondary font-medium">{portal.defaultPassword}</span>
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4 mt-5">
          {PORTALS.filter((p) => p.role !== selected).map((p) => (
            <button
              key={p.role}
              onClick={() => selectPortal(p)}
              className="text-[12px] text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <span className={p.accent}>{p.icon}</span>
              {p.label} login
            </button>
          ))}
        </div>

        <p className="text-center text-[11.5px] text-text-subtle mt-4">
          LMSGuard V2 · Protected by AES-256 · SSIET © 2026
        </p>
      </motion.div>
    </div>
  );
}
