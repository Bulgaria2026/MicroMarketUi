import type { CouponRequest } from "@/features/admin/types/coupon";

export interface CouponFormValues {
  codeInput: string;
  userIdInput: string;
  expiryDateInput: string;
  maxRedemptionsInput: string;
  amountOffInput: string;
  pointCostInput: string;
}

export function buildCouponFormValues(): CouponFormValues {
  return {
    codeInput: "",
    userIdInput: "",
    expiryDateInput: "",
    maxRedemptionsInput: "",
    amountOffInput: "",
    pointCostInput: "0",
  };
}

export function couponValuesToRequest(values: CouponFormValues): CouponRequest {
  return {
    code: values.codeInput.trim() || undefined,
    userId: values.userIdInput.trim() || undefined,
    amountOff: Number.parseFloat(values.amountOffInput),
    pointCost: Number.parseInt(values.pointCostInput) || 0,
    maxRedemptions: values.maxRedemptionsInput ? Number.parseInt(values.maxRedemptionsInput) : undefined,
    expiryDate: values.expiryDateInput ? new Date(values.expiryDateInput).toISOString() : undefined,
  };
}
