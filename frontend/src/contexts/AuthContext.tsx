"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { firebaseAuth } from "@/firebase/auth";
import { isFirebaseConfigured } from "@/firebase/config";
import {
  createUserProfile,
  getUserProfile,
  logoutUser,
  tryEnsureBackendSession,
  type UserProfile,
} from "@/services/authService";

type AuthContextValue = {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string;
  isEmailVerified: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const firebaseConfigured = isFirebaseConfigured();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const profile = (await getUserProfile(user.uid)) ?? (await createUserProfile(user));
    const backendSessionError = await tryEnsureBackendSession(user, profile);
    if (backendSessionError) {
      console.warn(backendSessionError);
    }
    setUserProfile(profile);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(firebaseAuth?.currentUser ?? null);
  }, [loadProfile]);

  useEffect(() => {
    if (!firebaseConfigured || !firebaseAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setLoading(true);
      setError("");
      setFirebaseUser(user);

      try {
        await loadProfile(user);
      } catch (authError) {
        setError(authError instanceof Error ? authError.message : "Unable to load user profile.");
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [firebaseConfigured, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      userProfile,
      loading,
      error,
      isEmailVerified: Boolean(firebaseUser?.emailVerified),
      refreshProfile,
      logout: logoutUser,
    }),
    [error, firebaseUser, loading, refreshProfile, userProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
