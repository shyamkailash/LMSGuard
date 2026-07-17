"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/store/sidebarStore";
import {
  LayoutDashboard, Users, BookOpen, Building2, GraduationCap,
  UserCog, MonitorPlay, BarChart3, FileText, AlertTriangle,
  Settings, ChevronDown, Shield, ClipboardList, Activity,
  Layers, PanelLeftClose, PanelLeftOpen, Cpu,
} from "lucide-react";
import type { ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────── */
interface NavChild {
  id:    string;
  label: string;
  href:  string;
  icon:  ReactNode;
}
interface NavGroup {
  id:       string;
  label:    string;
  icon:     ReactNode;
  section?: string;
  children: NavChild[];
}
interface NavItem {
  id:      string;
  label:   string;
  href:    string;
  icon:    ReactNode;
  badge?:  string;
  section?: string;
}
type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

/* ── Admin navigation definition ────────────────────────── */
const ADMIN_NAV: NavEntry[] = [
  {
    id: "dashboard", label: "Dashboard", href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-[15px] h-[15px]" />,
    section: "OVERVIEW",
  },
  {
    id: "academics", label: "Administration",
    icon: <Layers className="w-[15px] h-[15px]" />,
    section: "MANAGE",
    children: [
      { id: "departments",  label: "Departments",  href: "/admin/departments",  icon: <Building2     className="w-3.5 h-3.5" /> },
      { id: "classes",      label: "Classes",      href: "/admin/classes",      icon: <BookOpen      className="w-3.5 h-3.5" /> },
      { id: "subjects",     label: "Subjects",     href: "/admin/subjects",     icon: <FileText      className="w-3.5 h-3.5" /> },
    ],
  },
  {
    id: "people", label: "People",
    icon: <Users className="w-[15px] h-[15px]" />,
    children: [
      { id: "students",     label: "Students",     href: "/admin/students",     icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { id: "invigilators", label: "Invigilators", href: "/admin/invigilators", icon: <UserCog       className="w-3.5 h-3.5" /> },
    ],
  },
  {
    id: "exams", label: "Examinations",
    icon: <ClipboardList className="w-[15px] h-[15px]" />,
    section: "EXAMS",
    children: [
      { id: "exams-list",   label: "All Exams",    href: "/admin/exams",        icon: <ClipboardList className="w-3.5 h-3.5" /> },
      { id: "assignments",  label: "Assignments",  href: "/admin/assignments",  icon: <FileText      className="w-3.5 h-3.5" /> },
      { id: "sessions",     label: "Sessions",     href: "/admin/sessions",     icon: <Activity      className="w-3.5 h-3.5" /> },
    ],
  },
  {
    id: "monitoring", label: "Monitoring", href: "/admin/monitoring",
    icon: <MonitorPlay className="w-[15px] h-[15px]" />,
    badge: "LIVE",
    section: "LIVE",
  },
  {
    id: "violations", label: "Violations", href: "/admin/violations",
    icon: <AlertTriangle className="w-[15px] h-[15px]" />,
  },
  {
    id: "reports", label: "Reports", href: "/admin/reports",
    icon: <FileText className="w-[15px] h-[15px]" />,
    section: "INSIGHTS",
  },
  {
    id: "analytics", label: "Analytics", href: "/admin/analytics",
    icon: <BarChart3 className="w-[15px] h-[15px]" />,
  },
  {
    id: "settings", label: "Settings", href: "/admin/settings",
    icon: <Settings className="w-[15px] h-[15px]" />,
    section: "SYSTEM",
  },
];

const INVIGILATOR_NAV: NavEntry[] = [
  { id: "dashboard",  label: "Dashboard",  href: "/dashboard",  icon: <LayoutDashboard className="w-[15px] h-[15px]" />, section: "OVERVIEW" },
  {
    id: "session-flow", label: "Exam Session",
    icon: <MonitorPlay className="w-[15px] h-[15px]" />,
    section: "SESSION",
    children: [
      { id: "inv-exams",       label: "Assigned Exams",  href: "/invigilator/exams",          icon: <ClipboardList   className="w-3.5 h-3.5" /> },
      { id: "inv-classes",     label: "Choose Class",    href: "/invigilator/classes",         icon: <BookOpen        className="w-3.5 h-3.5" /> },
      { id: "inv-waiting",     label: "Waiting Room",    href: "/invigilator/waiting-room",    icon: <Users           className="w-3.5 h-3.5" /> },
      { id: "inv-session",     label: "Live Session",    href: "/invigilator/session",         icon: <Activity        className="w-3.5 h-3.5" /> },
    ],
  },
  { id: "monitoring",    label: "Monitoring",       href: "/monitoring",                     icon: <MonitorPlay      className="w-[15px] h-[15px]" />, badge: "LIVE", section: "LIVE" },
  { id: "inv-attendance",label: "Attendance",       href: "/invigilator/attendance",         icon: <Users            className="w-[15px] h-[15px]" /> },
  { id: "inv-alerts",    label: "Alerts",           href: "/invigilator/alerts",             icon: <AlertTriangle    className="w-[15px] h-[15px]" /> },
  { id: "violations",    label: "Violations",       href: "/violations",                     icon: <AlertTriangle    className="w-[15px] h-[15px]" />, section: "REPORTS" },
  { id: "reports",       label: "Reports",          href: "/reports",                        icon: <FileText         className="w-[15px] h-[15px]" /> },
  { id: "settings",      label: "Settings",         href: "/settings",                       icon: <Settings         className="w-[15px] h-[15px]" />, section: "SYSTEM" },
];

/* ── Helpers ─────────────────────────────────────────────── */
function useIsActive(href: string) {
  const pathname = usePathname();
  // Exact match for root dashboards, prefix match for others
  const exactRoutes = ["/admin/dashboard", "/dashboard"];
  if (exactRoutes.includes(href)) return pathname === href;
  return pathname.startsWith(href);
}

/* ── Tooltip for collapsed mode ────────────────────────── */
function NavTooltip({ label, show }: { label: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg bg-surface-2 border border-surface-2
      text-[12px] font-medium text-text-primary whitespace-nowrap z-50 shadow-lg
      pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      {label}
    </div>
  );
}

/* ── Single nav link ─────────────────────────────────────── */
function NavLinkItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const active = useIsActive(item.href);

  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={cn(
          "nav-link relative",
          active && "active",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? item.label : undefined}
      >
        <span className="nav-icon shrink-0">{item.icon}</span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden flex-1 truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {!collapsed && item.badge && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-success/14 text-success border border-success/22 leading-none tracking-wide">
            {item.badge}
          </span>
        )}
        {active && !collapsed && (
          <motion.div
            layoutId="active-indicator"
            className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary"
          />
        )}
      </Link>
      <NavTooltip label={item.label} show={collapsed} />
    </div>
  );
}

/* ── Group nav item ────────────────────────────────────── */
function NavGroupItem({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const { openGroups, toggleGroup } = useSidebarStore();
  const isOpen = openGroups[group.id] ?? false;
  const pathname = usePathname();
  const hasActiveChild = group.children.some((c) =>
    pathname === c.href || pathname.startsWith(c.href)
  );

  return (
    <div className="relative group">
      <button
        onClick={() => !collapsed && toggleGroup(group.id)}
        className={cn(
          "nav-link w-full",
          hasActiveChild && "text-text-secondary",
          collapsed && "justify-center px-2"
        )}
      >
        <span className={cn("nav-icon shrink-0", hasActiveChild && "text-primary/80")}>
          {group.icon}
        </span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 text-left truncate"
            >
              {group.label}
            </motion.span>
          )}
        </AnimatePresence>
        {!collapsed && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-subtle shrink-0"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-3.5 pl-3 border-l border-white/6 mt-0.5 mb-1 space-y-0.5">
              {group.children.map((child) => {
                const childActive = pathname === child.href || pathname.startsWith(child.href);
                return (
                  <Link
                    key={child.id}
                    href={child.href}
                    className={cn("nav-link text-[12.5px] py-[6px]", childActive && "active")}
                  >
                    <span className="nav-icon shrink-0">{child.icon}</span>
                    <span className="truncate">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavTooltip label={group.label} show={collapsed} />
    </div>
  );
}

/* ── Section separator ─────────────────────────────────── */
function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-1 border-t border-white/5" />;
  return (
    <div className="px-3 pt-4 pb-1.5">
      <p className="text-[10px] font-semibold text-text-subtle tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}

/* ── Main Sidebar ──────────────────────────────────────── */
interface SidebarProps {
  variant?: "admin" | "invigilator";
}

export function Sidebar({ variant = "admin" }: SidebarProps) {
  const { collapsed, toggle } = useSidebarStore();
  const nav = variant === "admin" ? ADMIN_NAV : INVIGILATOR_NAV;

  // Group entries by their section label
  const rendered: ReactNode[] = [];
  let lastSection = "";

  nav.forEach((entry, i) => {
    const section = (entry as NavItem).section ?? "";
    if (section && section !== lastSection) {
      rendered.push(
        <SectionLabel key={`sec-${i}`} label={section} collapsed={collapsed} />
      );
      lastSection = section;
    }
    if (isGroup(entry)) {
      rendered.push(
        <NavGroupItem key={entry.id} group={entry} collapsed={collapsed} />
      );
    } else {
      rendered.push(
        <NavLinkItem key={entry.id} item={entry} collapsed={collapsed} />
      );
    }
  });

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 232 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col bg-sidebar border-r border-white/5 shrink-0 overflow-hidden"
    >
      {/* Brand */}
      <div className={cn(
        "flex items-center gap-3 border-b border-white/5",
        collapsed ? "justify-center px-0 py-4" : "px-4 py-4"
      )}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(37,99,235,0.4)]">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-px -right-px w-2.5 h-2.5 rounded-full bg-success border-2 border-sidebar" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="whitespace-nowrap leading-none">
                <div className="text-[14px] font-bold text-text-primary tracking-tight">LMSGuard</div>
                <div className="text-[10.5px] text-text-muted font-medium mt-px">V2.0 · AI Platform</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-2 px-2 space-y-0.5">
        {rendered}
      </nav>

      {/* AI Status pill */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-2 mb-2"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/8 border border-success/14">
              <Cpu className="w-3.5 h-3.5 text-success shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-success leading-tight">AI Engine Active</p>
                <p className="text-[10px] text-success/70 leading-tight">98.7% detection rate</p>
              </div>
              <div className="live-dot shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={toggle}
          className={cn(
            "nav-link w-full group",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <PanelLeftOpen  className="w-4 h-4 shrink-0 text-text-muted" />
            : <PanelLeftClose className="w-4 h-4 shrink-0 text-text-muted" />
          }
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[12.5px] text-text-muted"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
