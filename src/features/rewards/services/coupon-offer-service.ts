import { api } from "@/lib/api";
import type { CouponOfferResponse } from "@/features/rewards/types/coupon-offer";
import type { CouponResponse } from "@/features/rewards/types/coupon";

export const couponOfferCatalogService = {
  getCatalog: async (): Promise<CouponOfferResponse[]> => {
    const res = await api.get<CouponOfferResponse[]>("/coupon-offer/catalog");
    return res.data;
  },
  purchase: async (offerId: string): Promise<CouponResponse> => {
    const res = await api.post<CouponResponse>(`/coupon-offer/${offerId}/purchase`);
    return res.data;
  },
};

export const couponOfferCatalogKeys = {
  catalog: ["rewards", "coupon-offers", "catalog"] as const,
};
