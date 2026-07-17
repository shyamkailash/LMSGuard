"use client";
import { create } from "zustand";
import type { Notification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/mock/notifications";

interface UIState {
  sidebarCollapsed: boolean;
  notifications: Notification[];
  unreadCount: number;
  theme: "dark";
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  addNotification: (n: Notification) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
  theme: "dark",

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
}));
