export interface CouponResponse {
  id: string;
  code: string;
  name: string | null;
  expiryDate: string | null;
  amountOff: number;
  pointCost: number;
  maxRedemptions: number | null;
  timesRedeemed: number;
  active: boolean;
  couponOfferId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}
