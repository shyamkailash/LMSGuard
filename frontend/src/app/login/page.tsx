"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { demoLogin, getSession, ROLE_HOME, UserRole } from "@/lib/session";

const ROLES: Array<{
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  accentSoft: string;
  cta: string;
}> = [
  {
    role: "admin",
    title: "Admin",
    subtitle: "System control",
    description: "Manage exams, users, and security controls across the entire LMSGuard deployment.",
    icon: Shield,
    accent: "linear-gradient(135deg,#7C3AED,#5B21B6)",
    accentSoft: "rgba(124,58,237,0.12)",
    cta: "Enter Admin Workspace",
  },
  {
    role: "invigilator",
    title: "Invigilator",
    subtitle: "Live monitoring",
    description: "Track events, review violations, and supervise active exam sessions in real time.",
    icon: Users,
    accent: "linear-gradient(135deg,#2563EB,#1D4ED8)",
    accentSoft: "rgba(37,99,235,0.12)",
    cta: "Enter Invigilator Workspace",
  },
  {
    role: "student",
    title: "Student",
    subtitle: "Exam portal",
    description: "Access assigned exams securely and submit work under live monitoring.",
    icon: GraduationCap,
    accent: "linear-gradient(135deg,#16A34A,#15803D)",
    accentSoft: "rgba(22,163,74,0.12)",
    cta: "Enter Student Portal",
  },
];

function RoleCard({
  role,
  title,
  subtitle,
  description,
  icon: Icon,
  accent,
  accentSoft,
  cta,
  onClick,
}: {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  accentSoft: string;
  cta: string;
  onClick: (role: UserRole) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(role)}
      className="group relative overflow-hidden rounded-3xl text-left p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
      />
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-70"
        style={{ background: accentSoft }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: accentSoft, border: "1px solid var(--border)" }}
        >
          <Icon size={20} style={{ color: "var(--text-primary)" }} />
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: accentSoft,
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {subtitle}
        </span>
      </div>
      <div className="relative mt-5">
        <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      </div>
      <div
        className="relative mt-5 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold"
        style={{
          background: accentSoft,
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}
      >
        <span>{cta}</span>
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace(ROLE_HOME[session.role]);
    }
  }, [router]);

  function handleDemoLogin(role: UserRole) {
    demoLogin(role);
    router.push(ROLE_HOME[role]);
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-28 -right-24 h-96 w-96 rounded-full blur-3xl opacity-20"
          style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
        />
        <div
          className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full blur-3xl opacity-15"
          style={{ background: "linear-gradient(135deg,#16A34A,#22C55E)" }}
        />
      </div>

      <header
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-8"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
          >
            <ShieldCheck size={18} className="text-white" />
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

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:px-8 lg:flex-row lg:items-center lg:py-16">
        <div className="max-w-xl lg:w-[44%]">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
            style={{
              background: "var(--primary-soft)",
              color: "var(--primary)",
              border: "1px solid var(--primary-border)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
            Secure first login
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl" style={{ color: "var(--text-primary)" }}>
            Choose your LMSGuard role and enter the right workspace.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7" style={{ color: "var(--text-muted)" }}>
            This is a demo-first login flow for now. We store a lightweight session in the browser and
            route each role to the correct dashboard.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Admin", icon: Shield, color: "var(--primary)" },
              { label: "Invigilator", icon: Users, color: "var(--primary)" },
              { label: "Student", icon: BookOpen, color: "var(--success)" },
            ].map(({ label, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-2xl p-3"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <Icon size={14} style={{ color }} />
                <p className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {label}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Browser session
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {ROLES.map((item) => (
            <RoleCard key={item.role} {...item} onClick={handleDemoLogin} />
          ))}
        </div>
      </section>
    </main>
  );
}
