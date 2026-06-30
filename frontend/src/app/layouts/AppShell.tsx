import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <div className="aurora-grid pointer-events-none fixed inset-0 opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(124_58_237/0.10),transparent_34rem)]" />
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="w-full flex-1 px-4 py-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
