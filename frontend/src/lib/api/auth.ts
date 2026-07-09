import { apiRequest, setStoredBackendToken } from "./client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
  role?: "Admin" | "Invigilator" | "Faculty" | "Student";
  department_id?: number | null;
};

export type FirebaseSessionPayload = {
  uid: string;
  email: string;
  name?: string;
  role?: "Admin" | "Invigilator" | "Faculty" | "Student";
};

type TokenResponse = {
  access_token: string;
};

export function register(payload: RegisterPayload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createBackendSession(payload: RegisterPayload) {
  try {
    await register(payload);
  } catch {
    // Existing Firebase users may already have a matching PostgreSQL account.
  }

  const response = await login(payload) as TokenResponse;
  setStoredBackendToken(response.access_token);
  return response;
}

export async function createFirebaseSession(payload: FirebaseSessionPayload) {
  const response = await apiRequest("/auth/firebase-session", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as TokenResponse;
  setStoredBackendToken(response.access_token);
  return response;
}

export function getMe(token: string) {
  return apiRequest("/auth/me", { token });
}
