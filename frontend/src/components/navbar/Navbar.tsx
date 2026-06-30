"use client";

import { useSyncExternalStore } from "react";
import { Bell, Command, Moon, Search, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

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

export function Navbar() {
  const time = useClock();

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="aurora-panel flex min-h-16 items-center gap-3 rounded-3xl px-4">
        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-zinc-500 md:flex">
          <Search className="size-4" />
          <span className="truncate">Search students, exams, evidence</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-lg border border-white/8 px-2 py-1 text-xs text-zinc-500">
            <Command className="size-3" /> K
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 sm:block">
            {time}
          </div>
          <Button variant="ghost" size="icon" aria-label="Theme">
            <Moon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-300" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Profile">
            <UserRound className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
