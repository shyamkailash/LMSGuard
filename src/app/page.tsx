"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, Zap, Eye, Brain, ArrowRight, CheckCircle2,
  MonitorPlay, Users, BarChart3, Lock,
} from "lucide-react";

const FEATURES = [
  { icon: <Brain className="w-5 h-5" />,      title: "AI-Powered Detection",   desc: "Real-time behavioral analysis with 98.7% accuracy across all exam sessions." },
  { icon: <Eye className="w-5 h-5" />,         title: "Live Screen Monitoring",  desc: "Monitor every student's screen, active windows, and application usage live." },
  { icon: <MonitorPlay className="w-5 h-5" />, title: "Multi-Session Control",   desc: "Manage hundreds of concurrent exam sessions with a single unified dashboard." },
  { icon: <BarChart3 className="w-5 h-5" />,   title: "Deep Analytics",          desc: "Comprehensive reports on risk patterns, violations, and exam performance." },
  { icon: <Lock className="w-5 h-5" />,        title: "Secure Browser Lock",     desc: "Prevent tab switching, application access, and clipboard misuse automatically." },
  { icon: <Users className="w-5 h-5" />,       title: "Role-Based Access",       desc: "Dedicated portals for admins, invigilators, and students with fine-grained controls." },
];

const STATS = [
  { value: "98.7%", label: "AI Accuracy"     },
  { value: "99.9%", label: "Uptime"          },
  { value: "50K+",  label: "Exams Monitored" },
  { value: "<50ms", label: "Alert Latency"   },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background mesh-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-white/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-text-primary tracking-tight">LMSGuard</span>
            <span className="badge badge-primary text-[10px]">V2.0</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="btn btn-ghost text-[13px]">Admin</Link>
            <Link href="/login" className="btn btn-ghost text-[13px]">Invigilator</Link>
            <Link href="/student/login" className="btn btn-primary text-[13px]">Student Portal</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-[12px] font-medium text-primary">AI-Powered · Real-Time · Enterprise</span>
            </div>
            <h1 className="text-5xl font-bold text-text-primary tracking-tight leading-[1.15] mb-5">
              Examination monitoring<br />
              <span className="gradient-text-blue">reimagined with AI</span>
            </h1>
            <p className="text-[16px] text-text-muted leading-relaxed max-w-xl mx-auto mb-8">
              LMSGuard V2 delivers real-time proctoring, AI violation detection, and live
              analytics — built for institutions that demand enterprise reliability.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/admin/login" className="btn btn-primary px-6 py-2.5 text-[14px] gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="btn btn-secondary px-6 py-2.5 text-[14px]">
                Invigilator Login
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-4 gap-4 mt-16"
          >
            {STATS.map((s, i) => (
              <div key={i} className="card p-4 text-center">
                <div className="text-[22px] font-bold text-text-primary tracking-tight">{s.value}</div>
                <div className="text-[12px] text-text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t border-white/5 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-text-primary tracking-tight mb-3">
              Everything you need to run secure exams
            </h2>
            <p className="text-[14px] text-text-muted max-w-lg mx-auto">
              Purpose-built for academic institutions with zero compromise on reliability or accuracy.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="card p-5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-[14px] font-semibold text-text-primary mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[24px] font-bold text-text-primary mb-4 tracking-tight">
            Ready to secure your examinations?
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            {["No setup fee", "99.9% uptime SLA", "24/7 support"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[13px] text-text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/admin/login" className="btn btn-primary px-8 py-2.5 text-[14px] gap-2 inline-flex">
            Access Admin Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[12px] text-text-muted">LMSGuard V2.0 · AI Examination Monitoring Platform</span>
          </div>
          <span className="text-[12px] text-text-muted">© 2026 SSIET. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
