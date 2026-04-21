import { getAccessToken, isTokenNearExpiry, refreshAccessToken } from "@/features/auth/lib/token-store";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function isAuthRequest(url: string | undefined): boolean {
  return url?.includes("/auth/") ?? false;
}

export function installAuthInterceptors(api: AxiosInstance): void {
  api.interceptors.request.use(async config => {
    if (isAuthRequest(config.url)) return config;

    const current = getAccessToken();
    if (!current) return config;

    if (isTokenNearExpiry(current)) {
      try {
        const data = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${data.accessToken}`;
      } catch {
        // Proactive refresh failed; let the response interceptor handle the 401.
      }
    } else {
      config.headers.Authorization = `Bearer ${current}`;
    }

    return config;
  });

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthRequest(originalRequest.url)
      ) {
        originalRequest._retry = true;
        const data = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      }

      throw error;
    },
  );
}
