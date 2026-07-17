/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        /* ── Design System Tokens ── */
        background:  "#030712",
        surface:     "#111827",
        sidebar:     "#0F172A",
        "surface-2": "#1F2937",
        "surface-3": "#374151",
        border:      "#1F2937",
        "border-2":  "#374151",

        /* Brand */
        primary:   { DEFAULT: "#2563EB", hover: "#3B82F6", muted: "rgba(37,99,235,0.12)", border: "rgba(37,99,235,0.25)" },
        success:   { DEFAULT: "#22C55E", muted: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.25)"   },
        warning:   { DEFAULT: "#F59E0B", muted: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
        danger:    { DEFAULT: "#EF4444", muted: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)"   },
        muted:     { DEFAULT: "#6B7280", foreground: "#9CA3AF" },
        purple:    { DEFAULT: "#8B5CF6", muted: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" },
        cyan:      { DEFAULT: "#06B6D4", muted: "rgba(6,182,212,0.12)",  border: "rgba(6,182,212,0.25)"  },

        /* Text */
        "text-primary":   "#F9FAFB",
        "text-secondary": "#D1D5DB",
        "text-muted":     "#6B7280",
        "text-subtle":    "#374151",
      },
      boxShadow: {
        "xs":    "0 1px 2px rgba(0,0,0,0.3)",
        "sm":    "0 2px 4px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
        "md":    "0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)",
        "lg":    "0 8px 24px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
        "xl":    "0 16px 48px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.35)",
        "glow":  "0 0 0 1px rgba(37,99,235,0.3), 0 4px 24px rgba(37,99,235,0.15)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)"    },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)"     },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)"    },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(1)",    opacity: "0.8" },
          "100%": { transform: "scale(1.8)",  opacity: "0"   },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)"   },
          "50%":       { transform: "translateY(-4px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1"   },
          "50%":       { opacity: "0.2" },
        },
        "number-tick": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":        "fade-up 0.4s ease-out forwards",
        "fade-in":        "fade-in 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.35s ease-out forwards",
        "slide-in-left":  "slide-in-left 0.35s ease-out forwards",
        "scale-in":       "scale-in 0.25s ease-out forwards",
        shimmer:          "shimmer 1.8s infinite",
        "pulse-ring":     "pulse-ring 1.5s cubic-bezier(0.215,0.61,0.355,1) infinite",
        float:            "float 3s ease-in-out infinite",
        blink:            "blink 1.4s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial":        "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":         "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-1":                 "radial-gradient(at 40% 20%, rgba(37,99,235,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6,182,212,0.08) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
