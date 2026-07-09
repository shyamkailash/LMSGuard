"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function GlobalBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    return null;
  }

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
 <button
  type="button"
  suppressHydrationWarning
  aria-label="Go back"
  onClick={goBack}
  className="fixed bottom-5 right-5 z-[70] inline-flex h-14 items-center gap-3 rounded-2xl border border-slate-300 bg-white/90 px-6 text-base font-semibold text-slate-900 shadow-2xl shadow-black/20 backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/20 dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:shadow-black/35 dark:hover:border-cyan-300/30 dark:hover:bg-slate-900"
>
  <ArrowLeft className="size-5" />
  Back
</button>
  );
}
