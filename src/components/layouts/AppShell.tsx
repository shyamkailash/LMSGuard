"use client";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  variant?: "admin" | "invigilator";
}

export function AppShell({ children, variant = "admin" }: AppShellProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar variant={variant} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar variant={variant} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
