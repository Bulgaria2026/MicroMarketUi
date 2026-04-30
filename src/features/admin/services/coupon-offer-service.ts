import { api } from "@/lib/api";
import type { AdminCouponOfferResponse, CouponOfferFilter, CouponOfferRequest } from "@/features/admin/types/coupon-offer";
import type { PageResponse } from "@/types/api";

export const adminCouponOfferService = {
  findAll: async (filter: CouponOfferFilter): Promise<PageResponse<AdminCouponOfferResponse>> => {
    const res = await api.get<PageResponse<AdminCouponOfferResponse>>("/coupon-offer", { params: { ...filter, sort: "createdAt,desc" } });
    return res.data;
  },
  findById: async (id: string): Promise<AdminCouponOfferResponse> => {
    const res = await api.get<AdminCouponOfferResponse>(`/coupon-offer/${id}`);
    return res.data;
  },
  create: async (body: CouponOfferRequest): Promise<AdminCouponOfferResponse> => {
    const res = await api.post<AdminCouponOfferResponse>("/coupon-offer", body);
    return res.data;
  },
  update: async (id: string, body: CouponOfferRequest): Promise<AdminCouponOfferResponse> => {
    const res = await api.put<AdminCouponOfferResponse>(`/coupon-offer/${id}`, body);
    return res.data;
  },
};

export const adminCouponOfferKeys = {
  all: ["admin", "coupon-offers"] as const,
  list: (filter: CouponOfferFilter) => ["admin", "coupon-offers", "list", filter] as const,
  detail: (id: string) => ["admin", "coupon-offers", "detail", id] as const,
};
