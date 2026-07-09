"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Navbar } from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="aurora-grid pointer-events-none fixed inset-0 opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(124_58_237/0.10),transparent_34rem)]" />
      <Sidebar
        collapsed={!desktopSidebarExpanded}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onDesktopExpand={() => setDesktopSidebarExpanded(true)}
        onDesktopCollapse={() => setDesktopSidebarExpanded(false)}
      />
      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col transition-[padding] duration-500 ease-out",
          desktopSidebarExpanded ? "lg:pl-72" : "lg:pl-24",
        )}
      >
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="w-full flex-1 px-4 py-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
