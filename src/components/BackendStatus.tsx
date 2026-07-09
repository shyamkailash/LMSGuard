"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

type Status = "loading" | "connected" | "error";

interface StatusConfig {
  icon:   React.ReactNode;
  label:  string;
  color:  string;
  bg:     string;
  border: string;
}

export default function BackendStatus() {
  const [status,  setStatus]  = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    fetch(`${apiUrl}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ message: string }>;
      })
      .then((data) => {
        setMessage(data.message);
        setStatus("connected");
      })
      .catch(() => {
        setMessage("Backend unreachable");
        setStatus("error");
      });
  }, []);

  const cfg: Record<Status, StatusConfig> = {
    loading: {
      icon:   <Loader2 size={12} className="animate-spin" />,
      label:  "Connecting…",
      color:  "var(--warning)",
      bg:     "var(--warning-soft)",
      border: "var(--warning-border)",
    },
    connected: {
      icon:   <Wifi size={12} />,
      label:  message,
      color:  "var(--success)",
      bg:     "var(--success-soft)",
      border: "var(--success-border)",
    },
    error: {
      icon:   <WifiOff size={12} />,
      label:  message,
      color:  "var(--danger)",
      bg:     "var(--danger-soft)",
      border: "var(--danger-border)",
    },
  };

  const { icon, label, color, bg, border } = cfg[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
      {status === "connected" && (
        <span
          className="w-1.5 h-1.5 rounded-full pulse-dot"
          style={{ background: color }}
        />
      )}
    </motion.div>
  );
}
