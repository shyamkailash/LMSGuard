"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  collapsed:   boolean;
  openGroups:  Record<string, boolean>;
  setCollapsed:    (v: boolean)    => void;
  toggle:          ()              => void;
  toggleGroup:     (id: string)   => void;
  setGroupOpen:    (id: string, open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed:  false,
      openGroups: { academics: true, people: true, exams: false },

      setCollapsed: (collapsed) => set({ collapsed }),
      toggle:       ()          => set((s) => ({ collapsed: !s.collapsed })),

      toggleGroup: (id) =>
        set((s) => ({
          openGroups: { ...s.openGroups, [id]: !s.openGroups[id] },
        })),

      setGroupOpen: (id, open) =>
        set((s) => ({
          openGroups: { ...s.openGroups, [id]: open },
        })),
    }),
    { name: "lmsguard-sidebar" }
  )
);
