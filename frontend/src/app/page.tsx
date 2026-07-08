"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield, Zap, Monitor, Lock, CheckCircle, ArrowRight
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const TAGS = [
  { label: "Real-time Monitoring", icon: Monitor },
  { label: "Exam Security",        icon: Lock    },
  { label: "AI Proctoring",        icon: Zap     },
  { label: "Admin Control",        icon: Shield  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Background decorative blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "#16A34A" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-5"
          style={{ background: "var(--primary)" }}
        />
      </div>

      {/* ── Top bar ── */}
      <header
        className="relative flex items-center justify-between px-8 py-4"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
          >
            <Shield size={17} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
              LMSGuard
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Examination Security Platform
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* ── Main content ── */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-2xl"
        >
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold"
            style={{
              background: "var(--primary-soft)",
              color: "var(--primary)",
              border: "1px solid var(--primary-border)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: "var(--success)" }}
            />
            LMSGuard Secure Access · Live Platform
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl font-extrabold mb-5 tracking-tight leading-[1.1]"
            style={{ color: "var(--text-primary)" }}
          >
            LMSGuard
          </h1>

          <p
            className="text-lg sm:text-xl font-semibold mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            AI-Powered Examination Security and Monitoring Platform
          </p>

          {/* Main card */}
          <div
            className="rounded-2xl p-6 mb-8 mx-auto max-w-lg text-left"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "var(--primary-muted)" }}
              >
                <Lock size={20} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h2
                  className="font-bold text-base mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  LMSGuard Secure Access
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Secure access to real-time exam monitoring, student activity tracking,
                  and examination control. Select your workspace to continue.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: "1px solid var(--border)" }}>
              {[
                "End-to-end encrypted examination sessions",
                "Role-based access control for all users",
                "Real-time AI-powered violation detection",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={12} style={{ color: "var(--success)", flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <motion.button
            id="continue-to-login"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-lg"
            style={{
              background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
              boxShadow: "0 8px 28px rgba(37,99,235,0.35)",
            }}
          >
            Continue to Login
            <ArrowRight size={18} />
          </motion.button>

          {/* Product tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {TAGS.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <Icon size={11} style={{ color: "var(--primary)" }} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative text-center pb-6">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          LMSGuard · Examination Security Platform · AI-Powered Proctoring
        </p>
      </footer>
    </div>
  );
}
