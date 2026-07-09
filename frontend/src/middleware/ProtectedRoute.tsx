"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getRoleRedirect, requiresEmailVerification, type UserRole } from "@/services/authService";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

function AuthLoadingSkeleton() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <div className="aurora-grid pointer-events-none absolute inset-0 opacity-70" />
      <section className="aurora-panel relative w-full max-w-md rounded-[2rem] p-6">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20">
          <ShieldCheck className="size-6" />
        </div>
        <div className="mt-6 h-4 animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 grid gap-3">
          <div className="h-12 animate-pulse rounded-2xl bg-white/[0.06]" />
          <div className="h-12 animate-pulse rounded-2xl bg-white/[0.06]" />
          <div className="h-12 animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>
      </section>
    </main>
  );
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, userProfile, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!firebaseUser) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiresEmailVerification() && !firebaseUser.emailVerified) {
      router.replace("/login?verify=email");
      return;
    }

    if (!userProfile) {
      return;
    }

    if (allowedRoles?.length && !allowedRoles.includes(userProfile.role)) {
      router.replace(getRoleRedirect(userProfile.role));
    }
  }, [allowedRoles, firebaseUser, loading, pathname, router, userProfile]);

  if (loading || !firebaseUser || (requiresEmailVerification() && !firebaseUser.emailVerified) || !userProfile) {
    return <AuthLoadingSkeleton />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(userProfile.role)) {
    return <AuthLoadingSkeleton />;
  }

  return children;
}
