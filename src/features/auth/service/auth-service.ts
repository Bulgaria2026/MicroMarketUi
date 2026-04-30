import type { AuthResponse } from "@/features/auth/types";
import { api } from "@/lib/api";

interface Credentials {
  email: string;
  password: string;
}

export const authService = {
  getOwnUser: async (): Promise<AuthResponse> => {
    const res = await api.get("/user/own");
    return res.data;
  },

  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", credentials);
    return res.data;
  },

  register: async (credentials: Credentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", credentials);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/refresh");
    return res.data;
  },
};
