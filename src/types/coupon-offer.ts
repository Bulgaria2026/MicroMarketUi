export interface CouponOfferResponse {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  expiryDate: string | null;
  pointCost: number;
  amountOff: number;
  maxPurchases: number | null;
  purchaseCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
