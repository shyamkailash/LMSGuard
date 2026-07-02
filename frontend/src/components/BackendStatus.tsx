"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

type Status = "loading" | "connected" | "error";

export default function BackendStatus() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    fetch(`${apiUrl}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { message: string }) => {
        setMessage(data.message);
        setStatus("connected");
      })
      .catch(() => {
        setMessage("Cannot reach backend");
        setStatus("error");
      });
  }, []);

  const config = {
    loading: {
      icon: <Loader2 size={14} className="animate-spin" />,
      label: "Connecting…",
      color: "var(--warning)",
      bg: "var(--warning-muted)",
      border: "rgba(217,119,6,0.25)",
    },
    connected: {
      icon: <Wifi size={14} />,
      label: message,
      color: "var(--success)",
      bg: "var(--success-muted)",
      border: "rgba(22,163,74,0.25)",
    },
    error: {
      icon: <WifiOff size={14} />,
      label: message,
      color: "var(--danger)",
      bg: "var(--danger-muted)",
      border: "rgba(220,38,38,0.25)",
    },
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
      }}
    >
      {config.icon}
      <span>{config.label}</span>
      {status === "connected" && (
        <span
          className="w-1.5 h-1.5 rounded-full live-blink"
          style={{ background: config.color }}
        />
      )}
    </motion.div>
  );
}
