"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, KeyRound, UserRound } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Basic Information", icon: UserRound },
  { title: "College Details", icon: Building2 },
  { title: "Security", icon: KeyRound },
  { title: "Verification", icon: CheckCircle2 },
];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const Icon = steps[step].icon;

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6">
      <div className="aurora-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <section className="aurora-panel w-full rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo />
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="space-y-4">
              {steps.map((item, index) => {
                const StepIcon = item.icon;
                const active = index === step;
                const complete = index < step;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setStep(index)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-violet-300/25 bg-violet-400/12 text-zinc-50"
                        : "border-white/8 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.055]"
                    }`}
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-white/7">
                      <StepIcon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-zinc-500">{complete ? "Complete" : `Step ${index + 1}`}</span>
                    </span>
                  </button>
                );
              })}
            </aside>
            <form className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6">
              <div className="mb-8 flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-cyan-400/10 text-violet-100 ring-1 ring-violet-300/20">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-zinc-50">{steps[step].title}</h1>
                  <p className="mt-1 text-sm text-zinc-400">Set up your LMSGuard institution workspace.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="aurora-input" placeholder={step === 0 ? "Full name" : step === 1 ? "College name" : step === 2 ? "Password" : "Verification code"} />
                <input className="aurora-input" placeholder={step === 0 ? "Institution email" : step === 1 ? "Department count" : step === 2 ? "Confirm password" : "Authorized contact"} />
                <input className="aurora-input sm:col-span-2" placeholder={step === 0 ? "Role" : step === 1 ? "Accreditation ID" : step === 2 ? "Recovery email" : "Admin approval reference"} />
              </div>
              <div className="mt-8 flex justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>
                  Previous
                </Button>
                <Button type="button" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="bg-violet-500 hover:bg-violet-400">
                  {step === steps.length - 1 ? "Finish setup" : "Continue"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
