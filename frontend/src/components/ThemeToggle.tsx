"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const THEME_KEY = "lmsg_theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Read saved theme on mount and apply it
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const isDark = saved === "dark";
    setDark(isDark);
    applyTheme(isDark);
  }, []);

  function applyTheme(isDark: boolean) {
    const html = document.documentElement;
    if (isDark) {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
  }

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    applyTheme(next);
  }

  return (
    <motion.button
      id="theme-toggle"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
      style={{
        background: "var(--bg-subtle)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}>
      <motion.div
        key={dark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </motion.div>
    </motion.button>
  );
}
