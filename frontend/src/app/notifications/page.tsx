"use client";

import { useMemo, useState } from "react";
import { BellRing, CheckCheck, Filter, Search } from "lucide-react";

import { MainLayout } from "@/app/layouts/MainLayout";
import { RiskBadge } from "@/components/common/RiskBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { notifications } from "@/mock/platform";

export default function NotificationsPage() {
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [remarkedIds, setRemarkedIds] = useState<string[]>([]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return notifications
      .map((item) => ({ ...item, read: item.read || readIds.includes(item.id) }))
      .filter((item) => !hiddenIds.includes(item.id))
      .filter((item) => {
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.body} ${item.id}`.toLowerCase().includes(normalized);
      const matchesRead = !unreadOnly || !item.read;
      return matchesQuery && matchesRead;
    });
  }, [hiddenIds, query, readIds, unreadOnly]);
  const unread = filtered.filter((item) => !item.read);
  const read = filtered.filter((item) => item.read);

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-cyan-200">Notification Center</p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-50">Alert inbox</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Grouped live alerts, read states, filters, and quick triage actions.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={unreadOnly ? "default" : "outline"} onClick={() => setUnreadOnly((value) => !value)}><Filter className="size-4" /> Unread</Button>
            <Button className="bg-blue-500 hover:bg-blue-400" onClick={() => setReadIds(notifications.map((item) => item.id))}><CheckCheck className="size-4" /> Mark all read</Button>
          </div>
        </section>

        <section className="aurora-panel rounded-[2rem] p-4">
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2">
            <Search className="size-4 text-zinc-500" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
              placeholder="Search alerts, students, severity, remarks"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              ["Unread", unread],
              ["Read", read],
            ].map(([group, items]) => (
              <div key={group as string} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-zinc-50">{group as string}</h2>
                  <StatusBadge tone={(items as typeof notifications).length ? "review" : "neutral"}>{(items as typeof notifications).length} items</StatusBadge>
                </div>
                {(items as typeof notifications).map((item) => (
                  <article key={item.id} className="aurora-card p-5">
                    <div className="flex items-start gap-4">
                      <div className="grid size-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20">
                        <BellRing className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-zinc-50">{item.title}</h3>
                          <RiskBadge score={item.severity} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{item.body}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => setReadIds((ids) => [...new Set([...ids, item.id])])}>View</Button>
                          <Button size="sm" variant="ghost" onClick={() => setHiddenIds((ids) => [...ids, item.id])}>Dismiss</Button>
                          <Button size="sm" variant="ghost" onClick={() => setRemarkedIds((ids) => [...new Set([...ids, item.id])])}>
                            {remarkedIds.includes(item.id) ? "Remark added" : "Add remark"}
                          </Button>
                          <span className="ml-auto text-xs text-zinc-500">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
