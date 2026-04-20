import axios, { isAxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let refreshPromise: Promise<RefreshResponse> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const refreshAuth = (): Promise<RefreshResponse> => {
  if (refreshPromise !== null) {
    return refreshPromise;
  }

  refreshPromise = api
    .post<RefreshResponse>("/auth/refresh")
    .then(response => {
      setAccessToken(response.data.accessToken);
      return response.data;
    })
    .catch(error => {
      setAccessToken(null);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return error.response?.data?.detail ?? fallback;
  }
  return fallback;
}

// Proactively refresh before the token expires to avoid a round-trip 401
api.interceptors.request.use(async config => {
  if (config.url?.includes("/auth/refresh")) {
    return config;
  }

  if (!accessToken) {
    return config;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime + 60) {
      const data = await refreshAuth();
      setAccessToken(data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch {
    setAccessToken(null);
    throw new Error("Session expired. Please sign in again.");
  }

  return config;
});

// Fallback: retry once on 401 in case the proactive refresh was skipped
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")) {
      originalRequest._retry = true;

      const data = await refreshAuth();
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    }
    throw error;
  },
);
