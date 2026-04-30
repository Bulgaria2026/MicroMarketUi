import { api } from "@/lib/api";
import type { AdminCouponResponse, CouponFilter, CouponPatchRequest, CouponRequest } from "@/features/admin/types/coupon";
import type { PageResponse } from "@/types/api";

export const adminCouponService = {
  findAll: async (filter: CouponFilter): Promise<PageResponse<AdminCouponResponse>> => {
    const res = await api.get<PageResponse<AdminCouponResponse>>("/coupon", { params: { ...filter, sort: "createdAt,desc" } });
    return res.data;
  },
  findById: async (id: string): Promise<AdminCouponResponse> => {
    const res = await api.get<AdminCouponResponse>(`/coupon/${id}`);
    return res.data;
  },
  create: async (body: CouponRequest): Promise<AdminCouponResponse> => {
    const res = await api.post<AdminCouponResponse>("/coupon", body);
    return res.data;
  },
  patch: async (id: string, body: CouponPatchRequest): Promise<AdminCouponResponse> => {
    const res = await api.patch<AdminCouponResponse>(`/coupon/${id}`, body);
    return res.data;
  },
};

export const adminCouponKeys = {
  all: ["admin", "coupons"] as const,
  list: (filter: CouponFilter) => ["admin", "coupons", "list", filter] as const,
  detail: (id: string) => ["admin", "coupons", "detail", id] as const,
};
