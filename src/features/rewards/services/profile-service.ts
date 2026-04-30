import { api } from "@/lib/api";
import type { ProfileResponse } from "@/features/rewards/types/profile";

export const rewardsProfileService = {
  getOwn: async (): Promise<ProfileResponse> => {
    const res = await api.get<ProfileResponse>("/profile/own");
    return res.data;
  },
};

export const rewardsProfileKeys = {
  own: ["rewards", "profile", "own"] as const,
};
