"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield, LayoutDashboard, Users, GraduationCap, Eye, BookOpen,
  Monitor, AlertTriangle, BarChart3, Settings, ChevronLeft,
  ChevronRight, LogOut, Bell, ChevronDown, Building2, Layers
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label:"Dashboard",     href:"/admin/dashboard",    icon:LayoutDashboard },
    ],
  },
  {
    label: "User Management",
    items: [
      { label:"Students",      href:"/admin/students",     icon:GraduationCap  },
      { label:"Invigilators",  href:"/admin/invigilators", icon:Eye            },
    ],
  },
  {
    label: "Academics",
    items: [
      { label:"Departments",   href:"/admin/departments",  icon:Building2      },
      { label:"Classes",       href:"/admin/classes",      icon:Layers         },
      { label:"Exams",         href:"/admin/exams",        icon:BookOpen       },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label:"Mon. Control",  href:"/admin/monitoring",   icon:Monitor        },
      { label:"Violations",    href:"/admin/violations",   icon:AlertTriangle  },
    ],
  },
  {
    label: "Reports & Settings",
    items: [
      { label:"Reports",       href:"/admin/reports",      icon:BarChart3      },
      { label:"Sys. Settings", href:"/admin/settings",     icon:Settings       },
    ],
  },
];

export default function AdminLayout({ children, title, subtitle }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notifs,    setNotifs]    = useState(5);
  const [admin,     setAdmin]     = useState(null);
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("adminProfile");
      if (raw) setAdmin(JSON.parse(raw));
    } catch {}
  }, []);

  const displayName = admin?.name || "Admin";
  const initials    = displayName.split(" ").map(n=>n[0]).join("").slice(0,2);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:"var(--bg)" }}>
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 220 }}
        transition={{ duration:0.25, ease:"easeInOut" }}
        className="flex flex-col h-full shrink-0 z-20 overflow-visible"
        style={{ background:"var(--sidebar)", borderRight:"1px solid var(--border)" }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-4 shrink-0 overflow-hidden"
             style={{ borderBottom:"2px solid #1B4D1E" }}>
          <div className="shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
              <Shield size={15} className="text-white"/>
            </div>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-8 }} transition={{ duration:0.15 }} className="overflow-hidden min-w-0">
                <p className="text-[11px] font-bold leading-tight truncate"
                   style={{ color:"var(--text-muted)" }}>
                  Institute
                </p>
                <p className="text-[9px] leading-tight truncate"
                   style={{ color:"var(--text-muted)" }}>
                  of Engg. & Technology
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield size={8} style={{ color:"var(--primary)" }}/>
                  <span className="text-[9px] font-semibold" style={{ color:"var(--primary)" }}>
                    Admin Portal
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Gold accent bar */}
        <div className="h-0.5 w-full yellow-stripe opacity-70 shrink-0"/>

        {/* Admin badge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
              exit={{ opacity:0, height:0 }}
              className="mx-3 mt-3 px-3 py-1.5 rounded-lg flex items-center gap-2"
              style={{ background:"rgba(245,200,0,0.12)", border:"1px solid rgba(245,200,0,0.2)" }}>
              <Shield size={10} style={{ color:"var(--primary)" }}/>
              <span className="text-[11px] font-semibold" style={{ color:"var(--primary)" }}>Full Control</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:"var(--accent)" }}/>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {NAV_GROUPS.map(({ label, items }) => (
            <div key={label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color:"var(--text-muted)" }}>
                    {label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {items.map(({ label:lbl, href, icon:Icon }) => {
                  const active = pathname === href || pathname.startsWith(href+"/");
                  return (
                    <Link key={href} href={href}>
                      <motion.div whileHover={{ x: collapsed ? 0 : 3 }} whileTap={{ scale:0.97 }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer
                          transition-all duration-150 group relative ${
                          active
                            ? "bg-[rgba(27,77,30,0.12)] border-l-2 border-[#1B4D1E]"
                            : "hover:bg-[var(--primary-muted)]"
                        }`}
                        style={{ paddingLeft: active ? "10px" : undefined }}>
                        <Icon size={15} className="shrink-0"
                          style={{ color: active ? "#1B4D1E" : "var(--text-muted)" }}/>
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                              exit={{ opacity:0, x:-6 }} transition={{ duration:0.12 }}
                              className="text-sm font-medium whitespace-nowrap"
                              style={{ color: active ? "#1B4D1E" : "var(--text-secondary)" }}>
                              {lbl}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {/* Tooltip */}
                        {collapsed && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium
                            whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100
                            transition-opacity z-50 shadow-lg"
                            style={{ background:"var(--card)", color:"var(--text-primary)",
                                     border:"1px solid var(--border)" }}>
                            {lbl}
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 pt-2 shrink-0" style={{ borderTop:"1px solid var(--border)" }}>
          <Link href="/admin/login">
            <motion.div whileHover={{ x: collapsed ? 0 : 3 }}
              onClick={() => sessionStorage.clear()}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer
                transition-all text-[var(--text-muted)] hover:text-[var(--danger)]
                hover:bg-[var(--danger-muted)] group relative">
              <LogOut size={15} className="shrink-0"/>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:-6 }} transition={{ duration:0.12 }}
                    className="text-sm font-medium whitespace-nowrap">
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium
                  whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100
                  transition-opacity z-50 shadow-lg"
                  style={{ background:"var(--card)", color:"var(--text-primary)",
                           border:"1px solid var(--border)" }}>
                  Logout
                </div>
              )}
            </motion.div>
          </Link>
        </div>

        {/* Collapse toggle */}
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
          onClick={() => setCollapsed(c=>!c)}
          className="absolute -right-3.5 top-16 w-7 h-7 rounded-full flex items-center
            justify-center transition-all z-30 shadow-md"
          style={{ background:"var(--card)", border:"1px solid var(--border)",
                   color:"var(--text-muted)" }}>
          {collapsed ? <ChevronRight size={13}/> : <ChevronLeft size={13}/>}
        </motion.button>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-5 shrink-0"
          style={{ background:"var(--card)", borderBottom:"1px solid var(--border)",
                   boxShadow:"var(--shadow)" }}>
          <div className="min-w-0">
            <h1 className="font-semibold text-base truncate" style={{ color:"var(--text-primary)" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs truncate" style={{ color:"var(--text-muted)" }}>{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Full Control badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background:"rgba(245,200,0,0.12)", border:"1px solid var(--primary-border)",
                       color:"var(--primary)" }}>
              <Shield size={10}/> Full Control
            </div>
            {/* Notifs */}
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={() => setNotifs(0)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:"var(--bg-deep)", border:"1px solid var(--border)",
                       color:"var(--text-secondary)" }}>
              <Bell size={16}/>
              {notifs > 0 && (
                <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px]
                    font-bold flex items-center justify-center"
                  style={{ background:"var(--danger)" }}>
                  {notifs}
                </motion.span>
              )}
            </motion.button>
            
            {/* User */}
            <div className="flex items-center gap-2 pl-3"
                 style={{ borderLeft:"1px solid var(--border)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                   style={{ background:"linear-gradient(135deg,#7C3AED,#6D28D9)" }}>
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold" style={{ color:"var(--text-primary)" }}>
                  {displayName}
                </p>
                <p className="text-[10px]" style={{ color:"var(--primary)" }}>Admin</p>
              </div>
              <ChevronDown size={11} style={{ color:"var(--text-muted)" }}/>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
