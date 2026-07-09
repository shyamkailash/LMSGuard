"use client";

import { Activity, Fingerprint, KeyRound, MonitorCheck, ShieldCheck, UserRound } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PasswordChangePanel } from "@/components/profile/PasswordChangePanel";
import { useAuth } from "@/hooks/useAuth";

function roleLabel(role?: string) {
  if (role === "Student") {
    return "Student";
  }

  if (role === "Invigilator") {
    return "Invigilator";
  }

  return "Administrator";
}

function profileSubtitle(role: string | undefined, loginId: string, department: string, institution: string) {
  if (role === "Student") {
    return `${loginId || "Student ID pending"} | ${department || "Department pending"}`;
  }

  if (role === "Invigilator") {
    return `${loginId || "Invigilator ID pending"} | ${department || "Department pending"}`;
  }

  return `${institution || "Institution workspace"} | LMSGuard Control`;
}

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();
  const role = userProfile?.role;
  const loginId = userProfile?.managedId || userProfile?.studentID || userProfile?.invigilatorID || userProfile?.email || "";
  const department = userProfile?.department || "";
  const institution = userProfile?.institution || "";
  const displayName = userProfile?.name || (loading ? "Loading profile" : "LMSGuard user");
  const label = roleLabel(role);
  const isStudent = role === "Student";
  const isInvigilator = role === "Invigilator";

  const metrics = isStudent
    ? [
        ["Current exam", "Ready", "Secure browser check pending", 64, "emerald"],
        ["Completed exams", "0", "This semester", 8, "cyan"],
        ["Open violations", "0", "No active flags", 4, "emerald"],
        ["Security score", "96", "Password and device ready", 96, "amber"],
      ]
    : isInvigilator
      ? [
          ["Assigned exams", "0", "Awaiting assignment", 18, "cyan"],
          ["Students monitored", "0", "Current session", 12, "violet"],
          ["Alerts handled", "0", "Today", 8, "emerald"],
          ["Security score", "96", "Password and device ready", 96, "amber"],
        ]
      : [
          ["Managed accounts", "Ready", "Student and invigilator creation enabled", 86, "emerald"],
          ["Avg response", "38s", "Live alerts", 92, "cyan"],
          ["Sessions", "12", "Trusted devices", 64, "violet"],
          ["Security score", "96", "MFA and SSO active", 96, "amber"],
        ];

  const detailCards = isStudent
    ? [
        [Fingerprint, "Student profile", `Login ID: ${loginId || "Pending"}`],
        [KeyRound, "Security", "Your password can be changed here. Your Student ID stays fixed."],
        [MonitorCheck, "Exam device", "Use the secure exam browser and keep monitoring permissions active."],
        [Activity, "Recent activity", "Your student exam activity will appear here."],
      ]
    : isInvigilator
      ? [
          [Fingerprint, "Invigilator profile", `Login ID: ${loginId || "Pending"}`],
          [KeyRound, "Security", "Your password can be changed here. Your Invigilator ID stays fixed."],
          [MonitorCheck, "Sessions", "Assigned exam sessions and monitored devices appear here."],
          [Activity, "Recent activity", "Exam control and alert review activity will appear here."],
        ]
      : [
          [Fingerprint, "Preferences", "Theme: system, language: English, alerts: high priority first."],
          [KeyRound, "Security", "MFA enabled, SSO configured, API keys rotated 2 days ago."],
          [MonitorCheck, "Sessions", "Windows workstation, Chrome secure profile, mobile approval device."],
          [Activity, "Recent activity", "Created accounts, assigned exams, and reviewed alerts appear here."],
        ];

  const securityControls = isStudent
    ? ["Student ID fixed", "Password change enabled", "Secure exam mode ready"]
    : isInvigilator
      ? ["Invigilator ID fixed", "Password change enabled", "Exam controls protected"]
      : ["MFA required", "Session timeout 30m", "API keys scoped"];

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="aurora-panel overflow-hidden rounded-[2rem] p-6">
          <div className="flex items-center gap-5">
            <div className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-400/30 via-cyan-300/15 to-green-300/20 text-white ring-1 ring-white/10">
              <UserRound className="size-9" />
            </div>
            <div className="min-w-0">
              <StatusBadge tone="online">{label}</StatusBadge>
              <h1 className="mt-3 truncate text-4xl font-semibold text-zinc-50">{displayName}</h1>
              <p className="mt-2 text-zinc-400">{profileSubtitle(role, loginId, department, institution)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {metrics.map(([title, value, detail, progress, tone]) => (
            <MetricCard key={title as string} title={title as string} value={value as string} detail={detail as string} progress={progress as number} tone={tone as "emerald" | "cyan" | "violet" | "amber"} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {detailCards.map(([Icon, title, copy]) => {
            const TileIcon = Icon as typeof Fingerprint;
            return (
              <article key={title as string} className="aurora-card p-5">
                <div className="flex items-start gap-4">
                  <div className="grid size-11 place-items-center rounded-2xl bg-blue-400/10 text-blue-100 ring-1 ring-blue-300/20">
                    <TileIcon className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-zinc-50">{title as string}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{copy as string}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <PasswordChangePanel />

        <section className="aurora-panel rounded-[2rem] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-green-300" />
            <h2 className="text-xl font-semibold text-zinc-50">Active security controls</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {securityControls.map((item) => (
              <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 text-sm text-zinc-300">{item}</div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
