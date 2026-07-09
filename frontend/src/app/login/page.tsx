"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lightbulb, LockKeyhole, Mail } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/Providers/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import {
  getFriendlyAuthError,
  getManagedAccountEmail,
  getRoleRedirect,
  loginWithEmail,
  loginWithGoogle,
  requiresEmailVerification,
  resendCurrentUserEmailVerification,
  type UserRole,
} from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { setMode } = useTheme();
  const { firebaseUser, userProfile, loading: authLoading, error: authStateError } = useAuth();
  const [loginRole, setLoginRole] = useState<UserRole>("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [unverifiedLogin, setUnverifiedLogin] = useState(false);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const loginIdLabel = loginRole === "Admin" ? "Admin email" : loginRole === "Student" ? "Student ID" : "Invigilator ID or email";

  function pullLamp() {
    const nextLampState = !lampOn;
    setLampOn(nextLampState);
    setMode(nextLampState ? "light" : "dark");
  }

  useEffect(() => {
    if (
      redirectAfterAuth &&
      !authLoading &&
      firebaseUser &&
      userProfile &&
      (!requiresEmailVerification() || firebaseUser.emailVerified)
    ) {
      if (userProfile.role !== loginRole) {
        queueMicrotask(() => {
          setError(`This account is ${userProfile.role}. Select "Login to ${userProfile.role}" or use the correct ${loginRole} ID.`);
          setRedirectAfterAuth(false);
          setLoading(false);
        });
        return;
      }

      router.replace(getRoleRedirect(userProfile.role));
    }
  }, [authLoading, firebaseUser, loginRole, redirectAfterAuth, router, userProfile]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setUnverifiedLogin(false);
    setRedirectAfterAuth(false);
    setLoading(true);

    try {
      const user = await loginWithEmail(getManagedAccountEmail(email, loginRole), password, rememberMe);

      if (requiresEmailVerification() && !user.emailVerified) {
        setUnverifiedLogin(true);
        setMessage("Please verify your email using the link already sent to your inbox.");
        setLoading(false);
        return;
      }

      setRedirectAfterAuth(true);
    } catch (authError) {
      setError(getFriendlyAuthError(authError));
      setLoading(false);
    }
  }

  async function resendVerification() {
    setError("");
    setMessage("");
    setResendLoading(true);

    try {
      await resendCurrentUserEmailVerification();
      setMessage("We sent a fresh verification link. Check your inbox and spam folder.");
    } catch (authError) {
      setError(getFriendlyAuthError(authError));
    } finally {
      setResendLoading(false);
    }
  }

  async function submitGoogleLogin() {
    if (loginRole !== "Admin") {
      setError("Students and invigilators must use the ID/email and password created by Admin.");
      return;
    }

    setError("");
    setMessage("");
    setUnverifiedLogin(false);
    setRedirectAfterAuth(false);
    setLoading(true);

    try {
      await loginWithGoogle(rememberMe);
      setRedirectAfterAuth(true);
    } catch (authError) {
      setError(getFriendlyAuthError(authError));
      setLoading(false);
    }
  }

  return (
    <main className={`relative min-h-screen overflow-hidden px-5 py-6 transition-colors duration-700 lg:px-8 ${
      lampOn
        ? "bg-[#f7fbff] text-slate-950"
        : "bg-[#070b14] text-white"
    }`}>
      <div className={`aurora-grid pointer-events-none absolute inset-0 transition-opacity duration-700 ${lampOn ? "opacity-55" : "opacity-25"}`} />
      <div className={`pointer-events-none absolute inset-0 transition duration-700 ${
        lampOn
          ? "bg-[radial-gradient(circle_at_31%_18%,rgb(250_204_21/0.38),transparent_24rem),radial-gradient(circle_at_70%_18%,rgb(6_182_212/0.16),transparent_26rem)]"
          : "bg-[radial-gradient(circle_at_31%_18%,rgb(250_204_21/0.08),transparent_16rem),radial-gradient(circle_at_70%_18%,rgb(6_182_212/0.08),transparent_24rem)]"
      }`} />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_0.75fr]">
        <section className="hidden animate-login-drop lg:block">
          <Logo />
          <div className="relative mt-12 min-h-[520px]">
            <div className={`absolute left-20 top-0 h-44 w-px transition-colors duration-500 ${lampOn ? "bg-amber-700/50" : "bg-white/20"}`} />
            <button
              type="button"
              aria-label={lampOn ? "Turn lamp off" : "Pull lamp on"}
              onClick={pullLamp}
              className={`absolute left-[4.35rem] top-44 grid size-8 place-items-center rounded-full border shadow-lg transition duration-300 hover:translate-y-1 ${lampOn ? "animate-lamp-pull" : ""} ${
                lampOn
                  ? "border-amber-300 bg-amber-200 text-amber-950 shadow-amber-400/40"
                  : "border-white/15 bg-slate-950 text-white shadow-black/40"
              }`}
            >
              <Lightbulb className="size-4" />
            </button>
            <div className={`absolute left-0 top-12 h-24 w-40 rounded-t-full border transition duration-700 ${
              lampOn
                ? "border-amber-200/70 bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_44px_140px_rgb(250_204_21/0.55)]"
                : "border-white/10 bg-gradient-to-b from-slate-800 to-slate-950 shadow-[0_18px_70px_rgb(0_0_0/0.45)]"
            }`} />
            <div className={`absolute left-[-9rem] top-32 h-[30rem] w-[34rem] rounded-full blur-2xl transition-opacity duration-700 ${lampOn ? "animate-glow-down" : ""} ${
              lampOn
                ? "bg-[radial-gradient(circle_at_top,rgb(250_204_21/0.48),transparent_62%)] opacity-100"
                : "bg-[radial-gradient(circle_at_top,rgb(250_204_21/0.10),transparent_58%)] opacity-45"
            }`} />
            <div className="absolute left-4 top-32 max-w-xl animate-login-drop-delay">
              <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition duration-500 ${
                lampOn
                  ? "border-amber-300/50 bg-amber-100/80 text-amber-900"
                  : "border-amber-200/15 bg-amber-300/10 text-amber-100"
              }`}>
                 <button
                type="button"
                onClick={pullLamp}
                aria-label={lampOn ? "Turn lamp off" : "Pull lamp on"}
                
                className={`inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-100 ${lampOn ? "animate-lamp-pull" : ""}`}
              >
                <Lightbulb className="size-3.5" />
                {lampOn ? "Lamp on" : "Click lamp"}
              </button>
                <Lightbulb className="size-4" />
                {lampOn ? "Lamp is glowing" : "Click the lamp to light the room"}
              </p>
              <h1 className={`mt-8 text-5xl font-semibold leading-tight transition-colors duration-700 xl:text-6xl ${lampOn ? "text-slate-950" : "text-white"}`}>
                Step into your monitoring desk.
              </h1>
              <p className={`mt-5 max-w-lg text-lg leading-8 transition-colors duration-700 ${lampOn ? "text-slate-700" : "text-slate-300"}`}>
                A quieter login space for exam teams, students, and invigilators before the live dashboard opens.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md animate-login-drop-card">
          <div className="aurora-panel rounded-[2rem] p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <Logo compact />
              <button
                type="button"
                onClick={pullLamp}
                aria-label={lampOn ? "Turn lamp off" : "Pull lamp on"}
                className={`inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-100 ${lampOn ? "animate-lamp-pull" : ""}`}
              >
                <Lightbulb className="size-3.5" />
                {lampOn ? "Lamp on" : "Click lamp"}
              </button>
            </div>
            <h2 className="text-3xl font-semibold text-zinc-50">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {loginRole === "Admin"
                ? "Login with your Admin email to open the Admin dashboard."
                : `Login with your ${loginIdLabel} to open the ${loginRole} dashboard.`}
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {(["Admin", "Student", "Invigilator"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setLoginRole(role);
                    setEmail("");
                    setError("");
                    setMessage("");
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    loginRole === role
                      ? "border-cyan-300 bg-cyan-400 text-slate-950"
                      : "border-slate-300 bg-white/70 text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                  }`}
                >
                  Login to {role}
                </button>
              ))}
            </div>

            <form className="mt-8 space-y-5" onSubmit={submitLogin}>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">{loginIdLabel}</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    required
                    suppressHydrationWarning
                    className="aurora-input pl-10"
                    type={loginRole === "Admin" ? "email" : "text"}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </span>
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Password</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    required
                    suppressHydrationWarning
                    minLength={6}
                    className="aurora-input pl-10 pr-10"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    suppressHydrationWarning
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-zinc-400">
                  <input
                    type="checkbox"
                    suppressHydrationWarning
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="size-4 rounded border-white/10 bg-white/5 accent-cyan-500"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-cyan-200 hover:text-cyan-100">
                  Forgot password
                </Link>
              </div>

              {error || authStateError ? <p className="rounded-xl border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-100">{error || authStateError}</p> : null}
              {message ? (
                <div className="space-y-3 rounded-xl border border-cyan-300/40 bg-cyan-50 px-3 py-2 text-sm text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100">
                  <p>{message}</p>
                  {(unverifiedLogin || (firebaseUser && !firebaseUser.emailVerified)) ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 w-full rounded-xl"
                      disabled={resendLoading}
                      onClick={resendVerification}
                    >
                      {resendLoading ? "Sending link" : "Resend verification email"}
                    </Button>
                  ) : null}
                </div>
              ) : null}

              <Button type="submit" size="lg" disabled={loading || authLoading} className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white hover:opacity-95">
                {loading ? "Checking account" : "Login"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-5 grid gap-2">
              <Button type="button" variant="outline" className="h-11 w-full rounded-xl" disabled={loading || loginRole !== "Admin"} onClick={submitGoogleLogin}>
                {loginRole === "Admin" ? "Continue with Google" : "Use Admin-created credentials"}
              </Button>
              <Button type="button" variant="outline" className="h-11 w-full rounded-xl" disabled>
                Microsoft login optional
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-500">
              New institution?{" "}
              <Link href="/signup" className="text-cyan-200 hover:text-cyan-100">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
