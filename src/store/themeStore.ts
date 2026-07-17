"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark";  // V2 is dark-only

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "lmsguard-theme" }
  )
);
