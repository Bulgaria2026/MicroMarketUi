import type { AdminCouponOfferResponse, CouponOfferRequest } from "@/features/admin/types/coupon-offer";

export interface OfferFormValues {
  name: string;
  description: string;
  startDateInput: string;
  expiryDateInput: string;
  pointCostInput: string;
  amountOffInput: string;
  maxPurchasesInput: string;
  active: boolean;
}

export function buildOfferFormValues(offer?: AdminCouponOfferResponse): OfferFormValues {
  return {
    name: offer?.name ?? "",
    description: offer?.description ?? "",
    startDateInput: offer?.startDate ? offer.startDate.slice(0, 10) : "",
    expiryDateInput: offer?.expiryDate ? offer.expiryDate.slice(0, 10) : "",
    pointCostInput: String(offer?.pointCost ?? ""),
    amountOffInput: String(offer?.amountOff ?? ""),
    maxPurchasesInput:
      offer?.maxPurchases !== null && offer?.maxPurchases !== undefined ? String(offer.maxPurchases) : "",
    active: offer?.active ?? true,
  };
}

export function offerValuesToRequest(values: OfferFormValues): CouponOfferRequest {
  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    startDate: values.startDateInput ? new Date(values.startDateInput).toISOString() : undefined,
    expiryDate: values.expiryDateInput ? new Date(values.expiryDateInput).toISOString() : undefined,
    pointCost: Number.parseInt(values.pointCostInput),
    amountOff: Number.parseFloat(values.amountOffInput),
    maxPurchases: values.maxPurchasesInput ? Number.parseInt(values.maxPurchasesInput) : undefined,
    active: values.active,
  };
}
