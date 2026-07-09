import type { ReactNode } from "react";

import { AppShell } from "@/app/layouts/AppShell";
import { ProtectedRoute } from "@/middleware/ProtectedRoute";
import type { UserRole } from "@/services/authService";

export function MainLayout({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
