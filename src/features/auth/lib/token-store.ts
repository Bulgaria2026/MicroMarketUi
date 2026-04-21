import { authService } from "@/features/auth/auth-service";
import type { AuthResponse } from "@/features/auth/types";
import { jwtDecode } from "jwt-decode";

let accessToken: string | null = null;
let refreshPromise: Promise<AuthResponse> | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function isTokenNearExpiry(token: string, thresholdSeconds = 60): boolean {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (!exp) return false;
    const now = Date.now() / 1000;
    return exp < now + thresholdSeconds;
  } catch {
    return true;
  }
}

export function refreshAccessToken(): Promise<AuthResponse> {
  if (refreshPromise !== null) return refreshPromise;

  refreshPromise = authService
    .refresh()
    .then(data => {
      setAccessToken(data.accessToken);
      return data;
    })
    .catch(error => {
      setAccessToken(null);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
