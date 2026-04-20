import { api } from "@/lib/api";
import type { AuthResponse } from "@/features/auth/types";

interface Credentials {
  email: string;
  password: string;
}

export const authService = {
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
};
