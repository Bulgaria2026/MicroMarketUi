export interface AdminCouponResponse {
  id: string;
  code: string;
  name: string | null;
  userEmail: string | null;
  userId: string | null;
  couponOfferId: string | null;
  expiryDate: string | null;
  amountOff: number;
  pointCost: number;
  maxRedemptions: number | null;
  timesRedeemed: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponRequest {
  userId?: string | null;
  code?: string | null;
  name?: string | null;
  expiryDate?: string | null;
  pointCost?: number;
  amountOff: number;
  maxRedemptions?: number | null;
  active?: boolean;
}

export interface CouponPatchRequest {
  name?: string | null;
  active?: boolean;
}

export interface CouponFilter {
  email?: string;
  active?: boolean;
  page?: number;
  size?: number;
}
