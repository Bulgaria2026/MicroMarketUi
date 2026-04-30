import type { CouponOfferResponse } from "@/types/coupon-offer";
export type { CouponOfferResponse } from "@/types/coupon-offer";

export type AdminCouponOfferResponse = CouponOfferResponse;

export interface CouponOfferRequest {
  name: string;
  description?: string | null;
  startDate?: string | null;
  expiryDate?: string | null;
  pointCost: number;
  amountOff: number;
  maxPurchases?: number | null;
  active?: boolean;
}

export interface CouponOfferFilter {
  active?: boolean;
  page?: number;
  size?: number;
}
