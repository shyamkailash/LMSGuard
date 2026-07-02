"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { INVIGILATORS, getInvigilatorByEmail } from "@/data/invigilatorData";

export default function InvigilatorLoginPage() {
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
    const inv = getInvigilatorByEmail(email);
    sessionStorage.setItem("invProfile",       JSON.stringify(inv));
    sessionStorage.setItem("invSelectedClass", "");
    sessionStorage.setItem("invSelectedExam",  "");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background:"var(--bg)" }}>
      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
        style={{ background:"linear-gradient(160deg,#1E3A8A 0%,#1D4ED8 50%,#2563EB 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10" style={{ background:"white" }}/>
        <div className="absolute -bottom-24 -right-12 w-72 h-72 rounded-full opacity-10" style={{ background:"white" }}/>
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full opacity-5" style={{ background:"white" }}/>

        <div className="relative">
          {/* Logo placeholder */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)" }}>
              <Shield size={17} style={{ color:"rgba(255,255,255,0.9)" }}/>
            </div>
            <div>
              <p className="text-sm font-bold text-white">LMSGuard AI</p>
              <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.55)" }}>Invigilator Portal</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background:"rgba(255,255,255,0.15)", color:"white", border:"1px solid rgba(255,255,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot"/>
            AI Monitoring Active
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Invigilator<br/>Control Portal
          </h2>
          <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.7)" }}>
            Monitor your assigned classroom in real-time. Receive AI-powered alerts,
            manage network issues, and generate class reports.
          </p>
          <div className="space-y-2 pt-2">
            {["Live student screen monitoring","AI violation detection","Network issue handling","Class-scoped exam reports"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={14} style={{ color:"#86EFAC" }}/>
                <span className="text-sm" style={{ color:"rgba(255,255,255,0.8)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>
          LMSGuard AI · Examination Monitoring Platform
        </p>
      </div>

      {/* ── Right form panel ── */}
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
          {/* Mobile logo placeholder */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
              <Shield size={22} className="text-white"/>
            </div>
          </div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold mb-1" style={{ color:"var(--text-primary)" }}>
                Welcome back
              </h1>
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>
                Sign in to your Invigilator account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color:"var(--text-secondary)" }}>Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color:"var(--text-muted)" }}/>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="your@email.com" className="input-field pl-10 !rounded-xl"/>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color:"var(--text-secondary)" }}>Password</label>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color:"var(--text-muted)" }}/>
                  <input type={showPass?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••••" className="input-field pl-10 pr-11 !rounded-xl"/>
                  <button type="button" onClick={()=>setShowPass(v=>!v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color:"var(--text-muted)" }}>
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
                style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)", boxShadow:"0 4px 16px rgba(37,99,235,0.3)" }}>
                {loading ? (
                  <>
                    <motion.div animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:"linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"/>
                    Signing in…
                  </>
                ) : <><Shield size={14}/> Sign In</>}
              </motion.button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
                <span className="text-[11px]" style={{ color:"var(--text-muted)" }}>Demo accounts</span>
                <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
              </div>
              <div className="space-y-2">
                {INVIGILATORS.slice(0,3).map(inv => (
                  <motion.button key={inv.id} whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                    type="button"
                    onClick={()=>{ setEmail(inv.email); setPassword("demo123"); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all"
                    style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--primary-border)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
                      {inv.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color:"var(--text-primary)" }}>{inv.name}</p>
                      <p className="text-[10px] truncate" style={{ color:"var(--text-muted)" }}>{inv.email}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-[11px] mt-3" style={{ color:"var(--text-muted)" }}>
                Password: any text · You choose class after login
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
