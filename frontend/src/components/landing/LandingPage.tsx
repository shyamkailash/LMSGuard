"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BrainCircuit,
  CalendarClock,
  ChevronRight,
  Eye,
  FileText,
  Fingerprint,
  Globe2,
  LockKeyhole,
  MonitorDot,
  MousePointer2,
  Moon,
  Network,
  Play,
  RadioTower,
  ScanEye,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Timer,
  Workflow,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/Providers/ThemeProvider";
import {
  detectionSignals,
  faqs,
  workflowNodes,
} from "@/mock/platform";

const features = [
  { title: "Live Monitoring", detail: "Screen, identity, app focus, keyboard, and network signals in one real-time grid.", icon: MonitorDot, className: "lg:col-span-2" },
  { title: "AI Detection", detail: "Vision and behavior models separate signal from noise before alerts are raised.", icon: BrainCircuit, className: "" },
  { title: "Violation Reports", detail: "Evidence packets, notes, timelines, and committee-ready exports.", icon: FileText, className: "" },
  { title: "Browser Detection", detail: "Window changes, blocked apps, tabs, clipboard, and secure-browser drift.", icon: ScanEye, className: "" },
  { title: "Real-Time Alerts", detail: "Severity-aware notifications with view, dismiss, and remark workflows.", icon: BellRing, className: "lg:col-span-2" },
  { title: "LMS Integration", detail: "Roster, exam schedule, and report exports designed for modern LMS flows.", icon: Network, className: "" },
];

const stats = [
  ["50+", "Universities"],
  ["500K+", "Exams Monitored"],
  ["99.8%", "Detection Accuracy"],
];

const testimonials = [
  ["The first proctoring UI our committee could understand in minutes.", "Dr. Kavya Raman", "Controller of Exams"],
  ["Alerts are contextual instead of noisy. Our invigilators finally work from priority.", "Prof. Meera Shah", "Digital Learning Lead"],
  ["The reporting layer looks like something we can present to leadership.", "Imran Ali", "Dean of Online Programs"],
];

function AmbientField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-grid absolute inset-0 opacity-45" />
      <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px]" />
      <motion.div
        className="absolute right-[-12rem] top-[-18rem] h-[38rem] w-[52rem] rounded-full bg-[radial-gradient(circle_at_center,rgb(37_99_235/0.34),transparent_62%)] blur-3xl"
        animate={{ x: [0, 24, -16, 0], y: [0, 12, -8, 0], opacity: [0.62, 0.9, 0.68, 0.62] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20rem] left-[-16rem] h-[34rem] w-[54rem] rounded-full bg-[radial-gradient(circle_at_center,rgb(6_182_212/0.18),transparent_64%)] blur-3xl"
        animate={{ x: [0, -20, 18, 0], y: [0, -10, 8, 0], opacity: [0.48, 0.76, 0.52, 0.48] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[36%] top-[18%] h-[24rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgb(14_165_233/0.11),transparent_70%)] blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.44, 0.28] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {Array.from({ length: 28 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute size-1 rounded-full bg-cyan-100/45 shadow-[0_0_18px_rgb(6_182_212/0.35)]"
          style={{
            left: `${8 + ((index * 13) % 84)}%`,
            top: `${10 + ((index * 17) % 78)}%`,
          }}
          animate={{ opacity: [0.12, 0.72, 0.12], y: [0, -18, 0], scale: [1, 1.7, 1] }}
          transition={{ duration: 5 + (index % 7), repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 900" aria-hidden="true">
        <defs>
          <linearGradient id="network-line" x1="0" x2="1">
            <stop stopColor="#2563EB" />
            <stop offset="0.5" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }, (_, index) => (
          <motion.circle
            key={index}
            cx={100 + index * 72}
            cy={index % 2 ? 210 + (index % 5) * 42 : 130 + (index % 6) * 54}
            r="2.6"
            fill={index % 4 === 0 ? "#06B6D4" : "#93c5fd"}
            animate={{ opacity: [0.2, 0.92, 0.2], y: [0, -10, 0] }}
            transition={{ duration: 3.4 + index * 0.16, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <path d="M86 310 C240 120, 442 470, 620 238 S960 152, 1120 342" fill="none" stroke="url(#network-line)" strokeWidth="1" strokeDasharray="6 18" opacity="0.42" />
        <path d="M110 620 C320 420, 460 650, 720 480 S970 398, 1110 560" fill="none" stroke="url(#network-line)" strokeWidth="1" strokeDasharray="5 16" opacity="0.28" />
      </svg>
    </div>
  );
}

function HeroVisualization() {
  const nodes = [
    { x: 70, y: 122, r: 4 },
    { x: 138, y: 62, r: 5 },
    { x: 232, y: 82, r: 3 },
    { x: 306, y: 138, r: 5 },
    { x: 266, y: 238, r: 4 },
    { x: 160, y: 282, r: 5 },
    { x: 74, y: 224, r: 3 },
  ];

  return (
    <motion.div
      className="relative mx-auto mt-10 hidden min-h-[460px] w-full max-w-[760px] items-center justify-center md:flex lg:mt-0 lg:min-h-[620px]"
      initial={{ opacity: 0, x: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.18 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(37_99_235/0.24),transparent_42%),radial-gradient(circle_at_62%_44%,rgb(6_182_212/0.18),transparent_30%)] blur-3xl" />
      <motion.div
        className="absolute size-[34rem] rounded-full border border-cyan-200/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute size-[27rem] rounded-full border border-blue-200/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute h-[18rem] w-[36rem] rounded-full border border-cyan-300/20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute h-[36rem] w-[18rem] rounded-full border border-blue-300/15"
        animate={{ rotate: [80, 440] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative grid size-[25rem] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(103_232_249/0.28),transparent_28%),radial-gradient(circle_at_center,rgb(37_99_235/0.16),rgb(2_6_23/0.02)_58%,transparent_70%)] shadow-[0_0_90px_rgb(37_99_235/0.22)]">
        <motion.div
          className="absolute inset-4 rounded-full border border-cyan-200/20"
          animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.38, 0.76, 0.38] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 380 380"
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="hero-globe-line" x1="0" x2="1">
              <stop stopColor="#2563EB" stopOpacity="0.2" />
              <stop offset="0.52" stopColor="#67E8F9" stopOpacity="0.72" />
              <stop offset="1" stopColor="#2563EB" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {[70, 112, 150, 190, 230, 268, 310].map((y) => (
            <ellipse key={y} cx="190" cy="190" rx={132 - Math.abs(190 - y) * 0.34} ry="18" fill="none" stroke="url(#hero-globe-line)" strokeWidth="0.8" opacity="0.58" />
          ))}
          {[0, 28, 56, 84, 112, 140].map((rotation) => (
            <ellipse key={rotation} cx="190" cy="190" rx="128" ry="46" fill="none" stroke="url(#hero-globe-line)" strokeWidth="0.8" opacity="0.52" transform={`rotate(${rotation} 190 190)`} />
          ))}
          <circle cx="190" cy="190" r="132" fill="none" stroke="#67E8F9" strokeOpacity="0.28" strokeWidth="1" />
        </motion.svg>

        <motion.div
          className="relative grid size-28 place-items-center rounded-[2rem] border border-cyan-200/20 bg-slate-950/45 text-cyan-100 shadow-[0_0_60px_rgb(6_182_212/0.28)] backdrop-blur-sm"
          animate={{ y: [0, -10, 0], scale: [1, 1.035, 1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldCheck className="size-12" />
        </motion.div>
      </div>

      <svg className="absolute h-[25rem] w-[25rem]" viewBox="0 0 380 380">
        {nodes.map((node, index) => (
          <path
            key={`path-${index}`}
            d={`M190 190 L${node.x} ${node.y}`}
            stroke="#67E8F9"
            strokeOpacity="0.18"
            strokeWidth="1"
            strokeDasharray="5 10"
          />
        ))}
        {nodes.map((node, index) => (
          <motion.circle
            key={`node-${index}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={index % 2 ? "#93C5FD" : "#67E8F9"}
            animate={{ opacity: [0.28, 1, 0.28], scale: [1, 1.7, 1] }}
            transition={{ duration: 2.8 + index * 0.24, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          />
        ))}
      </svg>

      {[
        "left-12 top-24",
        "right-10 top-36",
        "bottom-28 left-20",
        "bottom-20 right-24",
      ].map((position, index) => (
        <motion.div
          key={position}
          className={`absolute ${position} size-2 rounded-full bg-cyan-200 shadow-[0_0_24px_rgb(103_232_249/0.8)]`}
          animate={{ y: [0, -22, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3.8 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-medium text-cyan-200">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-balance text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-400">{copy}</p>
    </div>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const navItems = [
    ["Features", "#features"],
    ["Workflow", "#workflow"],
    ["Dashboard", "#dashboard"],
    ["About", "#about"],
  ];

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AmbientField />
      <header className="sticky inset-x-0 top-0 z-50 px-4 pt-4">
        <motion.div
          className={`mx-auto flex h-[70px] max-w-[1400px] items-center justify-between rounded-full border px-4 shadow-2xl backdrop-blur-xl transition-all duration-500 sm:px-5 lg:px-6 ${
            scrolled
              ? "border-slate-200 bg-white/90 shadow-slate-300/40 dark:border-white/[0.1] dark:bg-[rgba(15,23,42,.62)] dark:shadow-black/40"
              : "border-slate-200 bg-white/80 shadow-slate-300/30 dark:border-white/[0.08] dark:bg-[rgba(15,23,42,.55)] dark:shadow-black/30"
          }`}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Logo />
          <nav className="hidden items-center gap-2 rounded-full text-sm text-slate-700 dark:text-slate-400 md:flex">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full px-4 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-900/[0.06] hover:text-slate-950 hover:shadow-[0_0_24px_rgb(6_182_212/0.12)] dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
            >
              {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
            <Button asChild variant="ghost" className="hidden rounded-full px-4 text-slate-700 hover:bg-slate-900/[0.06] hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="h-11 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-5 text-white shadow-lg shadow-blue-950/40 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_28px_rgb(6_182_212/0.28)]">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </motion.div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1400px] items-center gap-8 px-5 pb-24 pt-16 md:pt-20 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
        <motion.div
          className="max-w-[580px]"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.65, ease: "easeOut" }}>
            <StatusBadge tone="review">AI-powered Examination Platform</StatusBadge>
          </motion.div>
          <motion.h1
            className="mt-7 text-5xl font-bold leading-[0.95] tracking-normal text-balance text-white md:text-6xl xl:text-[72px]"
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <span className="block">AI-Powered</span>
            <span className="block text-[0.76em]">
              Examination Monitoring
            </span>
            <span className="block bg-gradient-to-r from-black via-slate-100 to-cyan-200 bg-clip-text">
              Platform
            </span>
          </motion.h1>
          <motion.p
            className="mt-7 max-w-[560px] text-lg leading-[1.8] text-slate-400 md:text-xl"
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            LMSGuard provides intelligent AI-powered online examination monitoring with real-time identity verification, behavior analysis, automated violation detection, and comprehensive academic integrity reporting.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <Button asChild size="lg" className="h-14 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-7 text-base text-white shadow-xl shadow-blue-950/50 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_40px_rgb(6_182_212/0.38)]">
              <Link href="/signup">Get Started <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/15 bg-transparent px-7 text-base text-slate-200 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-cyan-300/35 hover:bg-cyan-400/10 hover:text-white hover:shadow-[0_0_30px_rgb(37_99_235/0.22)]">
              <a href="#dashboard"><Play className="size-4" /> Watch Demo</a>
            </Button>
          </motion.div>
          <motion.div
            className="mt-12 grid max-w-[560px] grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-5"
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            {stats.map(([value, label], index) => (
              <div key={label} className={index === 0 ? "pr-4" : "px-4"}>
                <p className="text-2xl font-semibold text-white md:text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <HeroVisualization />
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <SectionHeader eyebrow="Feature bento" title="Everything invigilators expect, without the old admin-dashboard drag." copy="A dense but calm operating surface for streaming, AI inference, alerts, reports, audit logs, and LMS-ready workflows." />
        <div className="grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article key={feature.title} className={`aurora-card group overflow-hidden p-6 ${feature.className}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.01 }}>
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-blue-400/10 text-blue-100 ring-1 ring-blue-300/20">
                    <Icon className="size-5" />
                  </div>
                  <Sparkles className="size-4 text-cyan-200 opacity-0 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">{feature.detail}</p>
                <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300" initial={{ width: 0 }} whileInView={{ width: `${62 + index * 5}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <SectionHeader eyebrow="AI workflow" title="From student session to defensible report in one continuous timeline." copy="The monitoring pipeline is visible, explainable, and designed around intervention only when evidence justifies it." />
        <div className="aurora-panel rounded-[2rem] p-5">
          <div className="grid gap-3 lg:grid-cols-6">
            {workflowNodes.map((node, index) => (
              <motion.div key={node.title} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-4" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <div className="mb-4 grid size-10 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20">{index + 1}</div>
                <h3 className="font-semibold text-white">{node.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{node.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm text-cyan-200">AI detection showcase</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-white">Signals move, priorities stay clear.</h2>
          <p className="mt-4 text-slate-400">Face confidence, browser behavior, idle detection, window monitoring, and network quality are presented as readable evidence instead of panic.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [Fingerprint, "Identity drift", "Secondary face probability held for 12s."],
              [MousePointer2, "Idle detection", "No input for 78 seconds during high-risk answer."],
              [LockKeyhole, "Browser lock", "Clipboard and tab switching blocked by policy."],
              [Timer, "Exam timer", "Adaptive alert pacing respects remaining time."],
            ].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Fingerprint;
              return (
                <div key={title as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <ItemIcon className="size-5 text-blue-200" />
                  <p className="mt-3 font-medium text-white">{title as string}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{copy as string}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="aurora-panel rounded-[2rem] p-5">
          <div className="grid gap-4">
            {detectionSignals.map((signal, index) => (
              <motion.div key={signal.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4" whileHover={{ x: 4 }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{signal.label}</span>
                  <span className="text-sm font-medium text-white">{signal.value}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/8">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400" initial={{ width: 0 }} whileInView={{ width: `${signal.value}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.08 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <SectionHeader eyebrow="Dashboard preview" title="A full command room, not a template." copy="Live students, alert triage, heatmaps, charts, and network telemetry move as one connected experience." />
        <div className="premium-border aurora-panel overflow-hidden rounded-[2rem] p-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Monitoring heatmap</p>
                  <h3 className="text-xl font-semibold text-white">Risk distribution</h3>
                </div>
                <StatusBadge tone="online">Live pulse</StatusBadge>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 56 }, (_, index) => (
                  <motion.div key={index} className="aspect-square rounded-lg border border-white/8" animate={{ backgroundColor: ["rgba(59,130,246,0.12)", index % 7 === 0 ? "rgba(239,68,68,0.45)" : index % 5 === 0 ? "rgba(245,158,11,0.38)" : "rgba(34,197,94,0.28)", "rgba(59,130,246,0.12)"] }} transition={{ duration: 3 + (index % 6), repeat: Infinity, ease: "easeInOut" }} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {["Repeated focus change", "Network recovered", "Report generated"].map((item, index) => (
                <motion.div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{item}</p>
                    <RiskBadge score={[72, 28, 44][index]} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{index === 0 ? "Aarav Mehta, Distributed Systems" : index === 1 ? "ECE room stream normalized" : "Cloud Security evidence packet"}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map(([quote, name, role], index) => (
            <motion.article key={name} className="aurora-card p-6" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <BadgeCheck className="size-5 text-green-300" />
              <p className="mt-5 text-lg leading-8 text-white">&ldquo;{quote}&rdquo;</p>
              <p className="mt-6 font-medium text-slate-200">{name}</p>
              <p className="mt-1 text-sm text-slate-500">{role}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-20">
        <SectionHeader eyebrow="FAQ" title="Built for academic integrity teams." copy="The experience is designed for demos, pilots, and production-minded frontend handoff." />
        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="aurora-card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-white">
                {question}
                <ChevronRight className="size-5 text-slate-500 transition group-open:rotate-90" />
              </summary>
              <p className="mt-4 text-sm leading-6 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl px-5 pb-10">
        <div className="aurora-panel flex flex-col justify-between gap-6 rounded-[2rem] p-6 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">LMSGuard connects monitoring, evidence, and reporting into a premium SaaS experience for modern examination teams.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[Globe2, Activity, ShieldCheck, Workflow, CalendarClock, Eye, RadioTower, ShieldAlert].map((Icon, index) => (
              <div key={index} className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300">
                <Icon className="size-4" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
