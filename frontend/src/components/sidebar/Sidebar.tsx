"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MonitorDot,
  RadioTower,
  Settings,
  ShieldAlert,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const supportItems = [
  { label: "Help", href: "/settings", icon: HelpCircle },
  { label: "Documentation", href: "/reports", icon: FileText },
  { label: "Logout", href: "/login", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const dashboardHref = pathname.startsWith("/student")
    ? "/student/dashboard"
    : pathname.startsWith("/invigilator")
      ? "/invigilator/dashboard"
      : "/admin/dashboard";
  const mainItems = [
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    { label: "Active Exams", href: "/active-exams", icon: BookOpenCheck },
    { label: "Live Monitoring", href: "/live-monitoring", icon: MonitorDot },
    { label: "Violations", href: "/violations", icon: ShieldAlert },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-72 shrink-0 p-4 lg:block">
      <div className="aurora-panel sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-3xl p-4">
        <Link href="/dashboard" className="mb-6 block rounded-2xl p-2">
          <Logo />
        </Link>

        <div className="mb-5 rounded-2xl border border-violet-300/15 bg-violet-400/8 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-violet-100">
            <RadioTower className="size-3.5" />
            AI inference fabric
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1">
            {[82, 68, 91].map((value) => (
              <div key={value} className="h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-300 to-cyan-300"
                  style={{ width: `${value}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <nav className="space-y-1">
          {mainItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.label === "Dashboard" && pathname === "/dashboard");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-zinc-400 transition",
                  "hover:bg-white/[0.065] hover:text-zinc-50",
                  active &&
                    "bg-gradient-to-r from-violet-400/18 to-indigo-400/10 text-zinc-50 ring-1 ring-violet-300/18",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-white/8 pt-4">
          {supportItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.055] hover:text-zinc-100"
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
