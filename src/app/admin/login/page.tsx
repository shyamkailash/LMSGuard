"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ADMIN_ACCOUNTS, getAdminByEmail } from "@/data/adminData";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1300));
    const admin = getAdminByEmail(email);
    sessionStorage.setItem("adminProfile", JSON.stringify(admin));
    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background:"var(--bg)" }}>
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
        style={{ background:"linear-gradient(160deg,#3B0764 0%,#6D28D9 50%,#7C3AED 100%)" }}>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10" style={{ background:"white" }}/>
        <div className="absolute -bottom-24 -right-12 w-72 h-72 rounded-full opacity-10" style={{ background:"white" }}/>
        <div className="relative"><div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)" }}>
              <Shield size={17} style={{ color:"rgba(255,255,255,0.9)" }}/>
            </div>
            <div>
              <p className="text-sm font-bold text-white">LMSGuard AI</p>
              <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.55)" }}>Examination Monitor</p>
            </div>
          </div></div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background:"rgba(255,255,255,0.15)", color:"white", border:"1px solid rgba(255,255,255,0.2)" }}>
            <Shield size={11}/> Admin · Full Control Access
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight">Admin Control<br/>Portal</h2>
          <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.7)" }}>
            Complete system management — users, departments, exams, monitoring and reports.
          </p>
          <div className="space-y-2 pt-2">
            {["Manage all students & invigilators","Create & assign examinations","System-wide monitoring control","College-level report generation"].map(f=>(
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={13} style={{ color:"#C4B5FD" }}/>
                <span className="text-sm" style={{ color:"rgba(255,255,255,0.8)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>
          © 2026 Institute of Engineering & Technology
        </p>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-5 left-5">
          <Link href="/">
            <motion.button whileHover={{ x:-2 }} className="flex items-center gap-1.5 text-sm"
              style={{ color:"var(--text-muted)" }}>
              <ArrowLeft size={14}/> Back
            </motion.button>
          </Link>
        </div>
        <div className="absolute top-5 right-5"></div>
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
                 style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
              <Shield size={20} className="text-white"/>
            </div>
          </div>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold mb-1" style={{ color:"var(--text-primary)" }}>Admin Access</h1>
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>Sign in to the Admin Control Portal</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color:"var(--text-secondary)" }}>Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}/>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="your@email.com" className="input-field pl-10 !rounded-xl"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color:"var(--text-secondary)" }}>Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}/>
                  <input type={showPass?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••••" className="input-field pl-10 pr-11 !rounded-xl"/>
                  <button type="button" onClick={()=>setShowPass(v=>!v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}>
                    {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                    exit={{ opacity:0, height:0 }}
                    className="flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-xl"
                    style={{ color:"var(--danger)", background:"var(--danger-soft)", border:"1px solid var(--danger-border)" }}>
                    <AlertCircle size={13}/> {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background:"linear-gradient(135deg,#7C3AED,#6D28D9)", boxShadow:"0 4px 16px rgba(124,58,237,0.3)" }}>
                {loading ? (
                  <>
                    <motion.div animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:"linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"/>
                    Signing in…
                  </>
                ) : <><Shield size={14}/> Admin Sign In</>}
              </motion.button>
            </form>
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
                <span className="text-[11px]" style={{ color:"var(--text-muted)" }}>Demo accounts</span>
                <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
              </div>
              {ADMIN_ACCOUNTS.map(a => (
                <motion.button key={a.id} whileHover={{ scale:1.01 }} type="button"
                  onClick={()=>{ setEmail(a.email); setPassword("admin123"); }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left mb-2 transition-all"
                  style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(124,58,237,0.25)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background:"linear-gradient(135deg,#7C3AED,#6D28D9)" }}>{a.avatar}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold" style={{ color:"var(--text-primary)" }}>{a.name}</p>
                    <p className="text-[10px] truncate" style={{ color:"var(--text-muted)" }}>{a.role} · {a.email}</p>
                  </div>
                </motion.button>
              ))}
              <p className="text-center text-[11px] mt-2" style={{ color:"var(--text-muted)" }}>Password: any text</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
