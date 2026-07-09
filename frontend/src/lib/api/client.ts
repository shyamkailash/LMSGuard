const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const BACKEND_TOKEN_KEY = "lmsguard:backend-token";

type ApiOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getStoredBackendToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(BACKEND_TOKEN_KEY) ?? "";
}

export function setStoredBackendToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BACKEND_TOKEN_KEY, token);
}

export function clearStoredBackendToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(BACKEND_TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token = getStoredBackendToken(), headers, ...init } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = `Backend returned ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      message = errorBody.detail || errorBody.message || message;
    } catch {
      // Keep the HTTP status message when the backend did not return JSON.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
