import { api } from "@/lib/api";
import type { CouponResponse } from "@/features/rewards/types/coupon";
import type { PageResponse } from "@/types/api";

export const ownCouponService = {
  findOwn: async (params?: { active?: boolean; page?: number; size?: number }): Promise<PageResponse<CouponResponse>> => {
    const res = await api.get<PageResponse<CouponResponse>>("/coupon/own", { params });
    return res.data;
  },
};

export const ownCouponKeys = {
  all: ["rewards", "coupons"] as const,
  list: (params?: object) => ["rewards", "coupons", "list", params] as const,
};
