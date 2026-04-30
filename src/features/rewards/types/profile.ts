export type PointChangeReason =
  | "ORDER_EARNED"
  | "PROMO_EARNED"
  | "COUPON_PURCHASED"
  | "ADMIN_ADJUSTMENT"
  | "REFUND";

export interface ProfileResponse {
  id: string;
  points: number;
  lastChangeReason: PointChangeReason;
  user: { id: string; email: string };
  createdAt: string;
  updatedAt: string;
}
