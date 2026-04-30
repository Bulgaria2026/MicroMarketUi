import { api } from "@/lib/api";
import type { Customer, CustomerFilter, Profile, User, UserPatch } from "@/features/admin/types/user";
import type { PageResponse } from "@/types/api";

export const userService = {
  findAllCustomers: async (filter: CustomerFilter): Promise<PageResponse<Customer>> => {
    const res = await api.get<PageResponse<Customer>>("/customer", { params: filter });
    return res.data;
  },
  findById: async (id: string): Promise<User> => {
    const res = await api.get<User>(`/user/${id}`);
    return res.data;
  },
  findProfileById: async (id: string): Promise<Profile> => {
    const res = await api.get<Profile>(`/profile/${id}`);
    return res.data;
  },
  patch: async (id: string, patch: UserPatch): Promise<User> => {
    const res = await api.patch<User>(`/user/${id}`, patch);
    return res.data;
  },
  updateProfilePoints: async (profileId: string, points: number): Promise<Profile> => {
    const res = await api.put<Profile>(`/profile/${profileId}`, { points });
    return res.data;
  },
};

export const userKeys = {
  all: ["users"] as const,
  list: (filter: CustomerFilter) => ["users", "list", filter] as const,
  detail: (id: string) => ["users", "detail", id] as const,
  profile: (id: string) => ["users", "profile", id] as const,
};
