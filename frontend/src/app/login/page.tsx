"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, Eye, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { authenticateWithMockBackend } from "@/services/auth";

function AINetwork() {
  const nodes = [
    { x: 16, y: 24 },
    { x: 38, y: 18 },
    { x: 62, y: 26 },
    { x: 78, y: 46 },
    { x: 54, y: 58 },
    { x: 30, y: 54 },
    { x: 45, y: 78 },
    { x: 72, y: 74 },
  ];

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/35 backdrop-blur-xl">
      <div className="aurora-grid absolute inset-0 opacity-80" />
      <div className="absolute left-12 top-12 size-64 rounded-full bg-violet-500/18 blur-3xl" style={{ animation: "aurora-drift 8s ease-in-out infinite" }} />
      <div className="absolute bottom-8 right-8 size-72 rounded-full bg-cyan-400/10 blur-3xl" style={{ animation: "aurora-drift 10s ease-in-out infinite reverse" }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" role="img" aria-label="Abstract AI monitoring network">
        <defs>
          <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="55%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {nodes.slice(0, -1).map((node, index) => {
          const next = nodes[index + 1];
          return (
            <line
              key={`${node.x}-${next.x}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke="url(#line-gradient)"
              strokeWidth="0.28"
              strokeDasharray="4 8"
              style={{ animation: "pulse-line 5s linear infinite" }}
            />
          );
        })}
        <line x1="16" y1="24" x2="54" y2="58" stroke="url(#line-gradient)" strokeWidth="0.22" strokeDasharray="3 7" style={{ animation: "pulse-line 6s linear infinite" }} />
        <line x1="38" y1="18" x2="78" y2="46" stroke="url(#line-gradient)" strokeWidth="0.22" strokeDasharray="3 7" style={{ animation: "pulse-line 6.6s linear infinite" }} />
        {nodes.map((node, index) => (
          <g key={`${node.x}-${node.y}`} style={{ animation: `float-node ${5 + index * 0.4}s ease-in-out infinite` }}>
            <circle cx={node.x} cy={node.y} r="3.2" fill="rgb(255 255 255 / 0.08)" stroke="rgb(255 255 255 / 0.18)" strokeWidth="0.4" />
            <circle cx={node.x} cy={node.y} r="1.2" fill={index % 3 === 0 ? "#06b6d4" : "#a78bfa"} />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
        {[
          ["98.2", "AI health"],
          ["14", "Live exams"],
          ["1.2k", "Students"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
            <p className="text-2xl font-semibold text-zinc-50">{value}</p>
            <p className="mt-1 text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    setLoading(true);
    try {
      const user = await authenticateWithMockBackend(email, password);
      window.localStorage.setItem("lmsguard:user", JSON.stringify(user));
      router.push(user.redirectTo);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6 lg:px-8">
      <div className="aurora-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:block">
          <div className="mb-8">
            <Logo />
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-balance text-zinc-50 xl:text-6xl">
            Calm examination intelligence, watching every signal with care.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Aurora Intelligence blends live proctoring, risk inference, and evidence review into one restrained control surface.
          </p>
          <div className="mt-10">
            <AINetwork />
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="aurora-panel rounded-[2rem] p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <Logo compact />
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-100">
                <ShieldCheck className="size-3.5" />
                Secure access
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-zinc-50">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Sign in to continue monitoring exams, evidence, and AI risk signals. Use admin, invigilator, or student in the email to test role routing.
              </p>
            </div>
            <form className="mt-8 space-y-5" onSubmit={submitLogin}>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Email</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="aurora-input pl-10"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@college.edu"
                  />
                </span>
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Password</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="aurora-input pl-10 pr-10"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                  />
                  <Eye className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                </span>
              </label>
              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-zinc-400">
                  <input type="checkbox" className="size-4 rounded border-white/10 bg-white/5 accent-violet-500" />
                  Remember me
                </label>
                <Link href="/settings" className="text-violet-200 hover:text-violet-100">
                  Forgot password
                </Link>
              </div>
              {error ? (
                <p className="rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white hover:opacity-95">
                {loading ? "Opening workspace" : "Login"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">
              New institution?{" "}
              <Link href="/signup" className="text-violet-200 hover:text-violet-100">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
