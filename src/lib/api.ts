import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { AuthResponse } from "../types/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const refreshAuth = async (): Promise<AuthResponse> => {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(token => ({ accessToken: token, expiresIn: 0 }));
  }

  isRefreshing = true;
  try {
    const response = await api.post<AuthResponse>("/auth/refresh");
    setAccessToken(response.data.accessToken);
    processQueue(null, response.data.accessToken);
    return response.data;
  } catch (error) {
    setAccessToken(null);
    processQueue(error, null);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Proactively refresh before the token expires to avoid a round-trip 401
api.interceptors.request.use(async config => {
  if (config.url?.includes("/auth/refresh")) {
    return config;
  }

  let tokenToUse = accessToken;

  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime + 60) {
        const data = await refreshAuth();
        tokenToUse = data.accessToken;
      }
    } catch {
      setAccessToken(null);
      tokenToUse = null;
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (tokenToUse) {
    config.headers.Authorization = `Bearer ${tokenToUse}`;
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

      try {
        const data = await refreshAuth();
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
