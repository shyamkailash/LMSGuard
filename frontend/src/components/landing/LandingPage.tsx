"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  MonitorDot,
  RadioTower,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI Monitoring",
    detail: "Identity, focus, and behavior signals analyzed without visual noise.",
    icon: BrainCircuit,
  },
  {
    title: "Live Streaming",
    detail: "Invigilators scan active exams with calm risk prioritization.",
    icon: MonitorDot,
  },
  {
    title: "Violation Detection",
    detail: "Evidence is captured, sequenced, and queued for review.",
    icon: ShieldCheck,
  },
  {
    title: "Reports",
    detail: "Academic integrity summaries ready for committees and departments.",
    icon: FileText,
  },
];

const architecture = [
  "Student",
  "Screen Agent",
  "Streaming",
  "AI Detection",
  "Dashboard",
  "Reports",
];

const counters = [
  ["200k+", "Students protected"],
  ["98.7%", "Detection accuracy"],
  ["42s", "Average response"],
  ["80+", "Institutions supported"],
];

function InferenceField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="aurora-grid absolute inset-0 opacity-60" />
      <motion.div
        className="absolute left-1/4 top-20 size-80 rounded-full bg-violet-500/18 blur-3xl"
        animate={{ x: [0, 36, 0], y: [0, -26, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-12 right-1/5 size-96 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M8 56 C22 28, 38 74, 52 42 S78 31, 92 52" fill="none" stroke="url(#landing-line)" strokeWidth="0.22" strokeDasharray="3 7" />
        <path d="M12 30 C30 18, 44 37, 59 28 S79 25, 90 14" fill="none" stroke="url(#landing-line)" strokeWidth="0.16" strokeDasharray="2 8" />
        <defs>
          <linearGradient id="landing-line" x1="0" x2="1">
            <stop stopColor="#7c3aed" />
            <stop offset="0.55" stopColor="#4f46e5" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      {[
        "left-[14%] top-[30%]",
        "left-[31%] top-[18%]",
        "left-[52%] top-[38%]",
        "left-[74%] top-[24%]",
        "left-[82%] top-[56%]",
        "left-[38%] top-[68%]",
      ].map((position, index) => (
        <motion.span
          key={position}
          className={`absolute ${position} size-3 rounded-full bg-violet-200 shadow-[0_0_32px_rgb(124_58_237/0.45)]`}
          animate={{ scale: [1, 1.45, 1], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 3 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <InferenceField />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <a href="#features" className="hover:text-zinc-50">Features</a>
          <a href="#demo" className="hover:text-zinc-50">Demo</a>
          <a href="#architecture" className="hover:text-zinc-50">Architecture</a>
        </nav>
        <Button asChild variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center px-5 pb-20 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl"
        >
          <StatusBadge tone="review">Aurora Intelligence for academic integrity</StatusBadge>
          <h1 className="mt-7 max-w-5xl text-6xl font-semibold leading-[1.02] text-balance text-zinc-50 md:text-7xl xl:text-8xl">
            Academic Integrity Powered by AI
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            LMSGuard gives administrators and invigilators a premium command surface for real-time examination monitoring, violation evidence, and AI-assisted review.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5">
              <Link href="/login">
                Start Monitoring
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-5">
              <a href="#demo">Explore Platform</a>
            </Button>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08 }}
                className="aurora-card p-6"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-violet-400/10 text-violet-100 ring-1 ring-violet-300/20">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-zinc-50">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.detail}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="demo" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm text-violet-200">Interactive monitoring demo</p>
          <h2 className="mt-3 text-4xl font-semibold text-zinc-50">Risk changes without panic.</h2>
          <p className="mt-4 text-zinc-400">A violation emerges, the risk indicator rises, and review context appears without disrupting the whole monitoring surface.</p>
        </div>
        <div className="aurora-panel rounded-[2rem] p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {["Nila Thomas", "Aarav Mehta", "Rohan Iyer"].map((name, index) => (
              <motion.div
                key={name}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-4"
                animate={index === 1 ? { y: [0, -6, 0] } : undefined}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="aspect-video rounded-2xl bg-[radial-gradient(circle_at_50%_40%,rgb(124_58_237/0.22),transparent_8rem),#101018]" />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-100">{name}</p>
                    <p className="mt-1 text-xs text-zinc-500">Distributed Systems</p>
                  </div>
                  <RiskBadge score={index === 1 ? 86 : 28 + index * 12} />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            Alert: repeated focus changes detected. Evidence packet queued for invigilator review.
          </div>
        </div>
      </section>

      <section id="architecture" className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <div className="aurora-panel rounded-[2rem] p-6">
          <div className="mb-8 flex items-center gap-3">
            <RadioTower className="size-5 text-violet-200" />
            <h2 className="text-2xl font-semibold text-zinc-50">Monitoring architecture</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-6">
            {architecture.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm text-zinc-200"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-4 md:grid-cols-4">
          {counters.map(([value, label]) => (
            <div key={label} className="aurora-card p-6">
              <p className="text-4xl font-semibold text-zinc-50">{value}</p>
              <p className="mt-2 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-white/8 px-5 py-8 text-sm text-zinc-500 md:flex-row">
        <span>LMSGuard Aurora Intelligence</span>
        <span className="inline-flex items-center gap-2"><Sparkles className="size-4" /> Built for calm, evidence-led proctoring</span>
      </footer>
    </main>
  );
}
