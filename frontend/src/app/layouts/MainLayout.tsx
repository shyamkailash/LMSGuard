import type { ReactNode } from "react";

import { AppShell } from "@/app/layouts/AppShell";

export function MainLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
