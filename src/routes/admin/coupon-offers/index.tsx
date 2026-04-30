import { AdminCouponOffers } from "@/features/admin/pages/CouponOffers";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  active: z.boolean().optional(),
});

export const Route = createFileRoute("/admin/coupon-offers/")({
  validateSearch: searchSchema,
  component: AdminCouponOffers,
});
