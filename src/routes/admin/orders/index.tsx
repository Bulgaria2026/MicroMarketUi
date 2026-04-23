import { AdminOrders } from "@/features/admin/pages/Orders";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING_PAYMENT", "PAID", "PAYMENT_FAILED", "CANCELLED", "REFUNDED"]).optional(),
  orderNumber: z.string().optional(),
  email: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const Route = createFileRoute("/admin/orders/")({
  validateSearch: searchSchema,
  component: AdminOrders,
});
