"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  userDept: string | null;
  login: (params: {
    role: Role;
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    userDept?: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userId: null,
      userName: null,
      userEmail: null,
      userAvatar: null,
      userDept: null,

      login: ({ role, userId, userName, userEmail, userAvatar, userDept }) =>
        set({ isAuthenticated: true, role, userId, userName, userEmail, userAvatar: userAvatar ?? null, userDept: userDept ?? null }),

      logout: () =>
        set({ isAuthenticated: false, role: null, userId: null, userName: null, userEmail: null, userAvatar: null, userDept: null }),
    }),
    { name: "lmsguard-auth" }
  )
);
