"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useClock } from "@/hooks/useClock";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import {
  Search, Bell, ChevronRight, LogOut, User, Settings,
  Clock, Sun, Check, BellOff,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/types";

interface TopbarProps {
  variant?: "admin" | "invigilator";
}

const BREADCRUMB_MAP: Record<string, string> = {
  admin:        "Admin",
  dashboard:    "Dashboard",
  departments:  "Departments",
  classes:      "Classes",
  students:     "Students",
  invigilators: "Invigilators",
  exams:        "Exams",
  monitoring:   "Monitoring",
  violations:   "Violations",
  reports:      "Reports",
  analytics:    "Analytics",
  settings:     "Settings",
  login:        "Login",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((p, i) => ({
    label: BREADCRUMB_MAP[p] ?? p.charAt(0).toUpperCase() + p.slice(1),
    href: "/" + parts.slice(0, i + 1).join("/"),
    isLast: i === parts.length - 1,
  }));
}

function NotificationItem({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const colorMap = {
    violation: "bg-danger/10 text-danger",
    warning:   "bg-warning/10 text-warning",
    info:      "bg-primary/10 text-primary",
    success:   "bg-success/10 text-success",
  };

  return (
    <button
      onClick={() => onRead(n.id)}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 transition-colors text-left",
        n.read ? "hover:bg-surface-2/50" : "bg-primary/5 hover:bg-primary/8"
      )}
    >
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold", colorMap[n.type])}>
        {n.type === "violation" ? "!" : n.type === "warning" ? "⚠" : n.type === "success" ? "✓" : "i"}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-[12.5px] font-medium truncate", n.read ? "text-text-secondary" : "text-text-primary")}>{n.title}</p>
        <p className="text-[11.5px] text-text-muted mt-0.5 line-clamp-1">{n.message}</p>
        <p className="text-[11px] text-text-muted/60 mt-1">
          {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
        </p>
      </div>
      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />}
    </button>
  );
}

export function Topbar({ variant = "admin" }: TopbarProps) {
  const { time, date } = useClock();
  const { notifications, unreadCount, markRead, markAllRead } = useUIStore();
  const { userName, userAvatar, userEmail, role, logout } = useAuthStore();
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = () => {
    logout();
    router.push(variant === "admin" ? "/admin/login" : "/login");
  };

  return (
    <header className="h-14 border-b border-white/5 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-5 shrink-0 sticky top-0 z-30">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12.5px]" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-text-subtle" />}
            {crumb.isLast ? (
              <span className="text-text-primary font-medium">{crumb.label}</span>
            ) : (
              <span className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden lg:flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
            className="h-8 w-48 bg-surface-2 border border-white/6 rounded-lg pl-8 pr-3 text-[12.5px] text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:w-60 transition-all duration-300"
          />
        </div>

        {/* Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 h-8 rounded-lg bg-surface-2 border border-white/6">
          <Clock className="w-3 h-3 text-text-muted" />
          <span className="text-[12px] font-medium text-text-secondary font-feature tabular-nums">{time}</span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="icon-btn relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-danger text-white text-[9.5px] font-bold rounded-full flex items-center justify-center border border-surface leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-80 glass rounded-xl border border-white/8 shadow-xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
                  <span className="text-[13px] font-semibold text-text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1.5 text-[11.5px] text-primary hover:text-blue-400 transition-colors">
                      <Check className="w-3 h-3" />Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-white/4">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-10 text-text-muted gap-2">
                      <BellOff className="w-8 h-8 opacity-40" />
                      <span className="text-[13px]">No notifications</span>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <NotificationItem key={n.id} n={n} onRead={markRead} />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-1 pr-2 h-9 rounded-xl hover:bg-surface-2 transition-colors border border-transparent hover:border-white/6"
          >
            <Avatar initials={userAvatar ?? userName?.slice(0, 2) ?? "U"} size="sm" />
            <div className="hidden lg:block text-left">
              <div className="text-[12.5px] font-semibold text-text-primary leading-tight truncate max-w-[100px]">
                {userName ?? "User"}
              </div>
              <div className="text-[10.5px] text-text-muted leading-tight capitalize">{role}</div>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-white/8 shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/6">
                  <p className="text-[13px] font-semibold text-text-primary">{userName}</p>
                  <p className="text-[11.5px] text-text-muted truncate">{userEmail}</p>
                </div>
                <div className="p-1.5">
                  <ProfileMenuBtn icon={<User className="w-3.5 h-3.5" />} label="Profile" onClick={() => { setProfileOpen(false); router.push(variant === "admin" ? "/admin/settings" : "/settings"); }} />
                  <ProfileMenuBtn icon={<Settings className="w-3.5 h-3.5" />} label="Settings" onClick={() => { setProfileOpen(false); router.push(variant === "admin" ? "/admin/settings" : "/settings"); }} />
                  <ProfileMenuBtn icon={<Sun className="w-3.5 h-3.5" />} label="Appearance" />
                  <div className="my-1 border-t border-white/6" />
                  <ProfileMenuBtn icon={<LogOut className="w-3.5 h-3.5" />} label="Sign out" className="text-danger hover:bg-danger/10" onClick={handleLogout} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function ProfileMenuBtn({
  icon, label, onClick, className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-text-secondary hover:bg-surface-2 transition-colors",
        className
      )}
    >
      <span className="text-text-muted">{icon}</span>
      {label}
    </button>
  );
}
