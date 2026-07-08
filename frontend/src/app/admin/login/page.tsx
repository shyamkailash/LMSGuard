"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Lock, AlertCircle, ArrowLeft,
  CheckCircle, Shield, Hash, UserPlus, LogIn
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { loginUser, registerUser } from "@/lib/api";

type FormMode = "login" | "register";

function InputRow({
  label, id, icon: Icon, type = "text", value, onChange, placeholder, required = true,
}: {
  label: string; id: string; icon: React.ElementType;
  type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }} />
        <input id={id} required={required}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? ""}
          className="input-field pl-10 !rounded-xl"
          style={{ paddingRight: isPassword ? "2.75rem" : undefined }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<FormMode>("login");

  // Login state
  const [adminId, setAdminId] = useState("");
  const [pass,    setPass]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Register state
  const [rFullName,  setRFullName]  = useState("");
  const [rAdminId,   setRAdminId]   = useState("");
  const [rPass,      setRPass]      = useState("");
  const [rConfirm,   setRConfirm]   = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError,   setRegError]   = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // ── Login ──────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!adminId.trim() || !pass.trim()) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      // POST /api/auth/login
      const res = await loginUser({ role: "admin", identifier: adminId.trim(), password: pass });
      const u = res.user;
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("role",            "admin");
      sessionStorage.setItem("user_id",         String(u.id));
      sessionStorage.setItem("identifier",      u.identifier);
      sessionStorage.setItem("full_name",       u.full_name);
      sessionStorage.setItem("name",            u.full_name);
      sessionStorage.setItem("adminProfile", JSON.stringify({
        name: u.full_name, id: u.identifier, role: "Admin",
      }));
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      if (msg.includes("BACKEND_DOWN")) {
        setError("⚠️ Backend server is not running. Start it with: uvicorn main:app --reload --port 8000");
      } else if (msg.includes("401")) {
        setError("Invalid Admin ID or password.");
      } else {
        setError(msg.replace(/^\d+:/, ""));
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Register ───────────────────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!rFullName.trim() || !rAdminId.trim() || !rPass.trim()) {
      setRegError("Full Name, Admin ID and Password are required."); return;
    }
    if (rPass !== rConfirm) { setRegError("Passwords do not match."); return; }
    if (rPass.length < 4)   { setRegError("Password must be at least 4 characters."); return; }

    setRegError(""); setRegLoading(true);
    try {
      await registerUser({
        role:       "admin",
        full_name:  rFullName.trim(),
        identifier: rAdminId.trim(),
        password:   rPass,
      });
      setRegSuccess(true);
      setAdminId(rAdminId.trim());
      setPass(rPass);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Registration failed.";
      if (raw.includes("BACKEND_DOWN")) {
        setRegError("⚠️ Backend server is not running. Start it with: uvicorn main:app --reload --port 8000");
      } else if (raw.includes("400") || raw.toLowerCase().includes("already registered")) {
        setRegError("This Admin ID is already registered.");
      } else {
        setRegError(raw.replace(/^\d+:/, ""));
      }
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#3B0764 0%,#6D28D9 55%,#7C3AED 100%)" }}>
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
            <Shield size={11} /> Admin Control Login
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Admin<br />Control Panel
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            Full system management — users, departments, exams, security controls and reports.
          </p>
          <div className="space-y-2 pt-2">
            {["Manage all students & invigilators", "Create & assign examinations",
              "System-wide security controls", "College-level report generation"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={13} style={{ color: "#C4B5FD" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          LMSGuard · Examination Security Platform
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute top-5 left-5">
          <Link href="/login">
            <motion.button whileHover={{ x: -2 }} className="flex items-center gap-1.5 text-sm"
              style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={14} /> Back
            </motion.button>
          </Link>
        </div>
        <div className="absolute top-5 right-5"><ThemeToggle /></div>

        <div className="w-full max-w-sm py-10">

          {/* Mode tabs */}
          <div className="flex rounded-xl overflow-hidden mb-8 border" style={{ borderColor: "var(--border)" }}>
            {(["login", "register"] as FormMode[]).map(m => (
              <button key={m} type="button"
                onClick={() => { setMode(m); setError(""); setRegError(""); setRegSuccess(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all"
                style={{
                  background: mode === m ? "linear-gradient(135deg,#7C3AED,#6D28D9)" : "var(--card)",
                  color: mode === m ? "white" : "var(--text-secondary)",
                }}>
                {m === "login" ? <LogIn size={14} /> : <UserPlus size={14} />}
                {m === "login" ? "Login" : "Create Admin ID"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── Login ── */}
            {mode === "login" && (
              <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
                    Admin Control Login
                  </h1>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Enter your Admin ID and password.
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <InputRow label="Admin ID" id="a-id" icon={Hash}
                    value={adminId} onChange={setAdminId} placeholder="e.g. ADMIN001" />
                  <InputRow label="Password" id="a-pass" icon={Lock} type="password"
                    value={pass} onChange={setPass} placeholder="••••••••••" />

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

                  <motion.button id="admin-login-submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#7C3AED,#6D28D9)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
                    {loading ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />Signing in…</>
                    ) : <><Shield size={14} /> Admin Sign In</>}
                  </motion.button>
                </form>

                <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
                  No account?{" "}
                  <button type="button" className="font-semibold" style={{ color: "var(--purple)" }}
                    onClick={() => setMode("register")}>Create Admin ID</button>
                </p>
              </motion.div>
            )}

            {/* ── Register ── */}
            {mode === "register" && (
              <motion.div key="register" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>

                {regSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(124,58,237,0.12)" }}>
                      <CheckCircle size={28} style={{ color: "var(--purple)" }} />
                    </div>
                    <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Admin ID Created!</h2>
                    <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                      Your admin account has been registered. You can now log in.
                    </p>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setMode("login")}
                      className="w-full py-3 rounded-xl text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg,#7C3AED,#6D28D9)" }}>
                      Go to Login
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
                        Create Admin ID
                      </h1>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Register a new admin account.
                      </p>
                    </div>
                    <form onSubmit={handleRegister} className="space-y-3">
                      <InputRow label="Full Name" id="ra-name" icon={Shield}
                        value={rFullName} onChange={setRFullName} placeholder="Your full name" />
                      <InputRow label="Admin ID" id="ra-id" icon={Hash}
                        value={rAdminId} onChange={setRAdminId} placeholder="e.g. ADMIN001" />
                      <InputRow label="Password" id="ra-pass" icon={Lock} type="password"
                        value={rPass} onChange={setRPass} placeholder="Min 4 characters" />
                      <InputRow label="Confirm Password" id="ra-confirm" icon={Lock} type="password"
                        value={rConfirm} onChange={setRConfirm} placeholder="Re-enter password" />

                      <AnimatePresence>
                        {regError && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-xl"
                            style={{ color: "var(--danger)", background: "var(--danger-soft)", border: "1px solid var(--danger-border)" }}>
                            <AlertCircle size={13} /> {regError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button id="admin-register-submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        type="submit" disabled={regLoading}
                        className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg,#7C3AED,#6D28D9)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
                        {regLoading ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />Creating…</>
                        ) : <><UserPlus size={14} /> Create Admin ID</>}
                      </motion.button>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
