"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpenCheck,
  FileText,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  MonitorDot,
  RadioTower,
  Settings,
  ShieldAlert,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const supportItems = [
  { label: "Help", href: "/settings", icon: HelpCircle },
  { label: "Documentation", href: "/reports", icon: FileText },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onDesktopExpand: () => void;
  onDesktopCollapse: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onDesktopExpand,
  onDesktopCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout, userProfile } = useAuth();
  const dashboardHref = userProfile?.role === "Student"
    ? "/student"
    : userProfile?.role === "Invigilator"
      ? "/invigilator"
      : "/admin";
  const mainItems = userProfile?.role === "Student"
    ? [
        { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
        { label: "Upcoming Exams", href: "/student/upcoming", icon: BookOpenCheck },
        { label: "Current Exam", href: "/student/current", icon: MonitorDot },
        { label: "Quiz", href: "/student/quiz", icon: FileText },
        { label: "Coding Tests", href: "/student/coding-tests", icon: RadioTower },
        { label: "Completed Exams", href: "/student/completed", icon: ShieldAlert },
        { label: "Results", href: "/student/results", icon: BarChart3 },
        { label: "Notifications", href: "/notifications", icon: Inbox },
        { label: "Profile", href: "/profile", icon: UsersRound },
        { label: "Settings", href: "/settings", icon: Settings },
      ]
    : userProfile?.role === "Invigilator"
      ? [
          { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
          { label: "Today's Exams", href: "/invigilator/exams/today", icon: BookOpenCheck },
          { label: "Running Exams", href: "/invigilator/exams/running", icon: MonitorDot },
          { label: "Assigned Exams", href: "/invigilator/exams/assigned", icon: FileText },
          { label: "Students", href: "/students", icon: UsersRound },
          { label: "Attendance", href: "/invigilator/attendance", icon: UserRoundCog },
          { label: "Live Monitoring", href: "/live-monitoring", icon: RadioTower },
          { label: "Security Panel", href: "/invigilator/security", icon: ShieldAlert },
          { label: "Notifications", href: "/notifications", icon: Inbox },
          { label: "Violations", href: "/violations", icon: ShieldAlert },
          { label: "Reports", href: "/reports", icon: BarChart3 },
          { label: "Profile", href: "/profile", icon: UsersRound },
          { label: "Settings", href: "/settings", icon: Settings },
        ]
      : [
          { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
          { label: "Active Exams", href: "/active-exams", icon: BookOpenCheck },
          { label: "Live Monitoring", href: "/live-monitoring", icon: MonitorDot },
          { label: "Violations", href: "/violations", icon: ShieldAlert },
          { label: "Students", href: "/students", icon: UsersRound },
          { label: "Invigilators", href: "/invigilators", icon: UserRoundCog },
          { label: "Reports", href: "/reports", icon: BarChart3 },
          { label: "Notifications", href: "/notifications", icon: Inbox },
          { label: "Settings", href: "/settings", icon: Settings },
        ];

  const sidebar = (mobile = false) => (
    <motion.div
      className={cn(
        "aurora-panel flex h-full flex-col rounded-3xl p-4",
        collapsed && !mobile ? "items-center" : "",
      )}
      initial={mobile ? { x: -320, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1, width: collapsed && !mobile ? 72 : 256 }}
      exit={mobile ? { x: -320, opacity: 0 } : undefined}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
    >
      <div className={cn("mb-6 flex items-center gap-2", collapsed && !mobile ? "justify-center" : "justify-between")}>
        <Link href="/dashboard" className="block rounded-2xl p-2" onClick={mobile ? onCloseMobile : undefined}>
          {collapsed && !mobile ? <Logo compact /> : <Logo />}
        </Link>
      </div>

        <AnimatePresence initial={false}>
          {(!collapsed || mobile) ? (
            <motion.div
              className="mb-5 rounded-2xl border border-violet-300/30 bg-violet-100/80 p-3 dark:border-violet-300/15 dark:bg-violet-400/8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
          <div className="flex items-center gap-2 text-xs font-medium text-violet-900 dark:text-violet-100">
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
            </motion.div>
          ) : null}
        </AnimatePresence>

        <nav className="w-full space-y-1">
          {mainItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.label === "Dashboard" && pathname === "/dashboard");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={mobile ? onCloseMobile : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-800 transition dark:text-zinc-400",
                  collapsed && !mobile && "justify-center px-0",
                  "hover:bg-slate-900/[0.08] hover:text-slate-950 dark:hover:bg-white/[0.065] dark:hover:text-zinc-50",
                  active &&
                    "bg-gradient-to-r from-violet-200 to-indigo-100 text-slate-950 ring-1 ring-violet-300/50 dark:from-violet-400/18 dark:to-indigo-400/10 dark:text-zinc-50 dark:ring-violet-300/18",
                )}
              >
                <Icon className="size-4" />
                {(!collapsed || mobile) ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto w-full space-y-1 border-t border-white/8 pt-4">
          {supportItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                onClick={mobile ? onCloseMobile : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-900/[0.08] hover:text-slate-950 dark:text-zinc-500 dark:hover:bg-white/[0.055] dark:hover:text-zinc-100",
                  collapsed && !mobile && "justify-center px-0",
                )}
              >
                <Icon className="size-4" />
                {(!collapsed || mobile) ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
          <button
            type="button"
            title="Logout"
            onClick={async () => {
              await logout();
              onCloseMobile();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-900/[0.08] hover:text-slate-950 dark:text-zinc-500 dark:hover:bg-white/[0.055] dark:hover:text-zinc-100",
              collapsed && !mobile && "justify-center px-0",
            )}
          >
            <LogOut className="size-4" />
            {(!collapsed || mobile) ? <span>Logout</span> : null}
          </button>
        </div>
    </motion.div>
  );

  return (
    <>
      <aside
        className="fixed bottom-4 left-4 top-4 z-40 hidden lg:block"
        onMouseEnter={onDesktopExpand}
        onMouseLeave={onDesktopCollapse}
        onFocusCapture={onDesktopExpand}
        onBlurCapture={(event) => {
          const nextFocusTarget = event.relatedTarget;
          if (!(nextFocusTarget instanceof Node) || !event.currentTarget.contains(nextFocusTarget)) {
            onDesktopCollapse();
          }
        }}
      >
        {sidebar(false)}
      </aside>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
          >
            <div className="h-full max-w-72" onClick={(event) => event.stopPropagation()}>
              {sidebar(true)}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
