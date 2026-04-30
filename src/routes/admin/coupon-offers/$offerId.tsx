import { AdminCouponOfferEdit } from "@/features/admin/pages/CouponOfferEdit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/coupon-offers/$offerId")({
  component: AdminCouponOfferEdit,
});
