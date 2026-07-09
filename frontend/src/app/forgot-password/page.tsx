"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { getFriendlyAuthError, resetPassword } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess("Password reset email sent. Check your inbox for the Firebase reset link.");
    } catch (authError) {
      setError(getFriendlyAuthError(authError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6">
      <div className="aurora-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:block">
          <Logo />
          <h1 className="mt-10 max-w-2xl text-5xl font-semibold leading-tight text-white">Recover access with Firebase password reset.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
            LMSGuard sends Firebase reset links directly to verified institution email accounts.
          </p>
        </section>

        <section className="mx-auto w-full max-w-lg">
          <div className="aurora-panel rounded-[2rem] p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <Logo compact />
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                <ArrowLeft className="size-4" />
                Login
              </Link>
            </div>

            <div className="grid size-12 place-items-center rounded-2xl bg-blue-400/10 text-blue-100 ring-1 ring-blue-300/20">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-white">Reset password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your account email. Firebase will send a secure reset link.
            </p>

            <form className="mt-8 space-y-4" onSubmit={submitReset}>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  required
                  className="aurora-input pl-10"
                  type="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </span>
              {error ? <p className="rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100">{error}</p> : null}
              {success ? <p className="rounded-xl border border-green-300/20 bg-green-400/10 px-3 py-2 text-sm text-green-100">{success}</p> : null}
              <Button type="submit" size="lg" disabled={loading} className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500">
                {loading ? "Sending reset link" : "Send reset email"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
