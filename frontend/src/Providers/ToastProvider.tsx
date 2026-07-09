"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

type ToastTone = "success" | "error" | "info" | "warning";
type Toast = {
  id: string;
  title: string;
  body?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  notify: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClasses: Record<ToastTone, string> = {
  success: "border-green-300/50 bg-green-50 text-green-950 shadow-green-950/10 dark:border-green-300/20 dark:bg-green-500/15 dark:text-green-50",
  error: "border-red-300/50 bg-red-50 text-red-950 shadow-red-950/10 dark:border-red-300/20 dark:bg-red-500/15 dark:text-red-50",
  info: "border-cyan-300/50 bg-cyan-50 text-cyan-950 shadow-cyan-950/10 dark:border-cyan-300/20 dark:bg-cyan-500/15 dark:text-cyan-50",
  warning: "border-amber-300/60 bg-amber-50 text-amber-950 shadow-amber-950/10 dark:border-amber-300/20 dark:bg-amber-500/15 dark:text-amber-50",
};

const toneIcons = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
  warning: TriangleAlert,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function notify(toast: Omit<Toast, "id">) {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { ...toast, id }].slice(-4));
    window.setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 4200);
  }

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[90] grid w-[min(26rem,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone];
          return (
            <div key={toast.id} className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl ${toneClasses[toast.tone]}`}>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{toast.title}</p>
                  {toast.body ? <p className="mt-1 text-xs opacity-80">{toast.body}</p> : null}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}
                  className="rounded-full p-1 opacity-70 transition hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
