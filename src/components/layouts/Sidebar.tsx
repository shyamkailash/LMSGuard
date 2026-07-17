"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import {
  LayoutDashboard, Users, BookOpen, Building2, GraduationCap,
  UserCog, MonitorPlay, BarChart3, FileText, AlertTriangle,
  Settings, ChevronDown, ChevronRight, Shield, Zap,
  ClipboardList, Activity,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
  section?: string;
}

const ADMIN_NAV: NavItem[] = [
  { id: "dashboard",    label: "Dashboard",     href: "/admin/dashboard",    icon: <LayoutDashboard className="w-4 h-4" /> },
  {
    id: "academics", label: "Academics", icon: <Building2 className="w-4 h-4" />,
    children: [
      { id: "departments",  label: "Departments",   href: "/admin/departments",   icon: <Building2     className="w-3.5 h-3.5" /> },
      { id: "classes",      label: "Classes",       href: "/admin/classes",       icon: <BookOpen      className="w-3.5 h-3.5" /> },
    ],
  },
  {
    id: "people", label: "People", icon: <Users className="w-4 h-4" />,
    children: [
      { id: "students",     label: "Students",      href: "/admin/students",      icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { id: "invigilators", label: "Invigilators",  href: "/admin/invigilators",  icon: <UserCog       className="w-3.5 h-3.5" /> },
    ],
  },
  { id: "exams",        label: "Exams",          href: "/admin/exams",         icon: <ClipboardList className="w-4 h-4" /> },
  { id: "monitoring",   label: "Monitoring",     href: "/admin/monitoring",    icon: <MonitorPlay   className="w-4 h-4" />, badge: "LIVE" },
  { id: "violations",   label: "Violations",     href: "/admin/violations",    icon: <AlertTriangle className="w-4 h-4" /> },
  { id: "reports",      label: "Reports",        href: "/admin/reports",       icon: <FileText      className="w-4 h-4" /> },
  { id: "analytics",    label: "Analytics",      href: "/admin/analytics",     icon: <BarChart3     className="w-4 h-4" /> },
  { id: "settings",     label: "Settings",       href: "/admin/settings",      icon: <Settings      className="w-4 h-4" /> },
];

const INVIGILATOR_NAV: NavItem[] = [
  { id: "dashboard",  label: "Dashboard",  href: "/dashboard",  icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "monitoring", label: "Monitoring", href: "/monitoring", icon: <MonitorPlay   className="w-4 h-4" />, badge: "LIVE" },
  { id: "reports",    label: "Reports",    href: "/reports",    icon: <FileText      className="w-4 h-4" /> },
  { id: "violations", label: "Violations", href: "/violations", icon: <AlertTriangle className="w-4 h-4" /> },
  { id: "settings",   label: "Settings",   href: "/settings",   icon: <Settings      className="w-4 h-4" /> },
];

interface SidebarProps {
  variant?: "admin" | "invigilator";
}

export function Sidebar({ variant = "admin" }: SidebarProps) {
  const pathname  = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ academics: true, people: true });

  const nav = variant === "admin" ? ADMIN_NAV : INVIGILATOR_NAV;

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const isActive = (href?: string) =>
    href ? pathname === href || (href !== "/admin/dashboard" && href !== "/dashboard" && pathname.startsWith(href)) : false;

  return (
    <motion.aside
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-white/5 transition-all duration-300 ease-in-out shrink-0",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
      initial={false}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/5", sidebarCollapsed && "justify-center px-0")}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-sidebar" />
        </div>
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="whitespace-nowrap">
                <div className="text-[14px] font-bold text-text-primary tracking-tight">LMSGuard</div>
                <div className="text-[10.5px] text-text-muted font-medium">V2.0 · AI Monitoring</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
        <div className="space-y-0.5">
          {nav.map((item) => {
            if (item.children) {
              const isGroupOpen = openGroups[item.id];
              const hasActiveChild = item.children.some((c) => isActive(c.href));

              return (
                <div key={item.id}>
                  <button
                    onClick={() => !sidebarCollapsed && toggleGroup(item.id)}
                    className={cn(
                      "nav-link w-full",
                      hasActiveChild && "text-text-secondary",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    <span className={cn("nav-icon shrink-0", hasActiveChild && "text-primary/80")}>{item.icon}</span>
                    <AnimatePresence initial={false}>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 text-left truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!sidebarCollapsed && (
                      <span className="text-text-subtle shrink-0">
                        {isGroupOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isGroupOpen && !sidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 pl-3 border-l border-white/6 mt-0.5 mb-1 space-y-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href!}
                              className={cn("nav-link text-[13px]", isActive(child.href) && "active")}
                            >
                              <span className="nav-icon shrink-0">{child.icon}</span>
                              <span className="truncate">{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href!}
                className={cn("nav-link", isActive(item.href) && "active", sidebarCollapsed && "justify-center px-2")}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-icon shrink-0">{item.icon}</span>
                <AnimatePresence initial={false}>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!sidebarCollapsed && item.badge && (
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-success/15 text-success border border-success/25 leading-none tracking-wide">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={toggleSidebar}
          className={cn("nav-link w-full justify-center", !sidebarCollapsed && "justify-start")}
          aria-label="Toggle sidebar"
        >
          <Activity className="w-4 h-4 shrink-0" />
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
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
