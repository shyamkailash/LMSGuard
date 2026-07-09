"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { getFriendlyAuthError, signUpWithEmail } from "@/services/authService";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the security and data processing terms.");
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail({
        name,
        email,
        password,
        role: "Admin",
        institution,
        department,
      });
      setSuccess("Account created. You can login now; verify the email link when it reaches your inbox.");
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (authError) {
      setError(getFriendlyAuthError(authError));
      setLoading(false);
    }
  }

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

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <aside className="space-y-4">
              {[
                [UserRound, "Identity", "Name, email, and role"],
                [Building2, "Institution", "School and department"],
                [KeyRound, "Security", "Password and terms"],
                [CheckCircle2, "Verification", "Email verification optional"],
              ].map(([Icon, title, detail]) => {
                const TileIcon = Icon as typeof UserRound;
                return (
                  <div key={title as string} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                    <TileIcon className="size-5 text-cyan-200" />
                    <p className="mt-3 font-medium text-zinc-50">{title as string}</p>
                    <p className="mt-1 text-sm text-zinc-500">{detail as string}</p>
                  </div>
                );
              })}
            </aside>

            <form className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6" onSubmit={submitSignup}>
              <div className="mb-8 flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-zinc-50">Create LMSGuard account</h1>
                  <p className="mt-1 text-sm text-zinc-400">Admin accounts are created here. Student and Invigilator IDs are created from the Admin dashboard.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input required className="aurora-input" placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} />
                <span className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input required className="aurora-input pl-10" type="email" placeholder="admin@university.edu" value={email} onChange={(event) => setEmail(event.target.value)} />
                </span>
                <input className="aurora-input" value="Admin" readOnly />
                <input required className="aurora-input" placeholder="Institution" value={institution} onChange={(event) => setInstitution(event.target.value)} />
                <input required className="aurora-input" placeholder="Department" value={department} onChange={(event) => setDepartment(event.target.value)} />
                <input required minLength={6} className="aurora-input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                <input required minLength={6} className="aurora-input sm:col-span-2" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </div>

              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 size-4 rounded border-white/10 bg-white/5 accent-cyan-500"
                />
                <span>I agree to LMSGuard security, data processing, and institutional administrator terms.</span>
              </label>

              {error ? <p className="mt-5 rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100">{error}</p> : null}
              {success ? <p className="mt-5 rounded-xl border border-green-300/20 bg-green-400/10 px-3 py-2 text-sm text-green-100">{success}</p> : null}

              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/login">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-400">
                  {loading ? "Creating account" : "Create account"}
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
