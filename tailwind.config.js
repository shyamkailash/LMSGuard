/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* SSIET Brand — extracted from uploaded logo & portal */
        "brand-green":       "#1B4D1E",
        "brand-green-hover": "#2D6B31",
        "brand-green-deep":  "#0A1A0C",
        "brand-yellow":      "#F5C800",
        "brand-yellow-dark": "#D4AA00",
        "brand-mint":        "#D4EDDA",

        /* Semantic tokens (CSS variable backed) */
        bg:       "var(--bg)",
        "bg-deep":"var(--bg-deep)",
        card:     "var(--card)",
        sidebar:  "var(--sidebar)",
        border:   "var(--border)",
        primary:  "var(--primary)",
        accent:   "var(--accent)",
        success:  "var(--success)",
        warning:  "var(--warning)",
        danger:   "var(--danger)",
        purple:   "var(--purple)",
        "text-primary":   "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted":     "var(--text-muted)",
      },
      boxShadow: {
        sm: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "green":  "0 0 20px rgba(27,77,30,0.20)",
        "yellow": "0 0 20px rgba(245,200,0,0.25)",
      },
      backgroundImage: {
        "ssiet":        "linear-gradient(135deg,#1B4D1E,#0F2D12)",
        "ssiet-accent": "linear-gradient(135deg,#1B4D1E,#2D6B31)",
        "yellow-stripe":"linear-gradient(90deg,#1B4D1E,#F5C800,#1B4D1E)",
      },
    },
  },
  plugins: [],
};
