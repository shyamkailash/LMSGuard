import Link from "next/link";
import { ArrowLeft, Radar, SearchX } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10">
      <div className="aurora-grid pointer-events-none absolute inset-0 opacity-70" />
      <section className="aurora-panel relative max-w-2xl rounded-[2rem] p-8 text-center">
        <div className="mx-auto mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto grid size-24 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <Radar className="size-10 text-cyan-200" />
        </div>
        <p className="mt-8 text-sm text-cyan-200">404 signal lost</p>
        <h1 className="mt-3 text-5xl font-semibold text-white">This exam surface is not online.</h1>
        <p className="mt-5 text-sm leading-6 text-slate-400">The page may have moved, expired, or never joined the monitoring session.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-blue-500 hover:bg-blue-400">
            <Link href="/dashboard"><ArrowLeft className="size-4" /> Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/live-monitoring"><SearchX className="size-4" /> Open monitoring</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
