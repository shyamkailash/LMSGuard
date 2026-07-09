"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";
import { Bell, Command, Menu, Moon, Search, Sun, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/Providers/ThemeProvider";
import { platformApi } from "@/lib/api/platform";

const CLOCK_PLACEHOLDER = "Syncing";

function subscribeToClock(onStoreChange: () => void) {
  const initial = window.setTimeout(onStoreChange, 0);
  const id = window.setInterval(onStoreChange, 30_000);
  return () => {
    window.clearTimeout(initial);
    window.clearInterval(id);
  };
}

function getClockSnapshot() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function getServerClockSnapshot() {
  return CLOCK_PLACEHOLDER;
}

function useClock() {
  return useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot,
  );
}

type NavbarProps = {
  onOpenSidebar: () => void;
};

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const time = useClock();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const commands = [
    ["Dashboard", "/dashboard"],
    ["Open live monitoring", "/live-monitoring"],
    ["Review violations", "/violations"],
    ["Create exam", "/active-exams"],
    ["Search students", "/students"],
    ["Open invigilators", "/invigilators"],
    ["Notification center", "/notifications"],
    ["Profile", "/profile"],
    ["Export reports", "/reports"],
    ["Edit monitoring rules", "/settings"],
  ];
  const visibleCommands = commands.filter(([label]) =>
    label.toLowerCase().includes(commandQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    let active = true;

    async function loadUnreadNotifications() {
      try {
        const items = await platformApi.notifications(true);
        if (active) {
          setUnreadNotifications(items.length);
        }
      } catch {
        if (active) {
          setUnreadNotifications(0);
        }
      }
    }

    loadUnreadNotifications();
    const interval = window.setInterval(loadUnreadNotifications, 15_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="aurora-panel flex min-h-16 items-center gap-3 rounded-3xl px-4">
        <Button variant="ghost" size="icon" aria-label="Open sidebar" className="lg:hidden" onClick={onOpenSidebar}>
          <Menu className="size-4" />
        </Button>
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-left text-sm text-zinc-500 transition hover:border-cyan-300/20 hover:bg-white/[0.06] md:flex"
        >
          <Search className="size-4" />
          <span className="truncate">Search students, exams, evidence</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-lg border border-white/8 px-2 py-1 text-xs text-zinc-500">
            <Command className="size-3" /> K
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 sm:block">
            {time}
          </div>
          <Button variant="ghost" size="icon" aria-label="Theme" onClick={toggleTheme}>
            {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Link href="/notifications">
              <Bell className="size-4" />
              {unreadNotifications > 0 ? (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-cyan-300 px-1.5 text-[10px] font-semibold text-slate-950">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Profile">
            <Link href="/profile">
              <UserRound className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {commandOpen ? (
          <motion.div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="aurora-panel mx-auto mt-24 max-w-xl overflow-hidden rounded-[2rem]" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }}>
              <div className="flex items-center gap-3 border-b border-white/8 p-4">
                <Command className="size-5 text-cyan-200" />
                <input
                  autoFocus
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                  placeholder="Search students, exams, reports, settings"
                />
                <Button variant="ghost" size="icon" aria-label="Close command palette" onClick={() => setCommandOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>
              <div className="p-3">
                {visibleCommands.map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setCommandOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.055] hover:text-white">
                    {label}
                    <Command className="size-3 text-zinc-600" />
                  </Link>
                ))}
                {visibleCommands.length === 0 ? (
                  <div className="rounded-2xl px-4 py-6 text-center text-sm text-zinc-500">
                    No matching command
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
