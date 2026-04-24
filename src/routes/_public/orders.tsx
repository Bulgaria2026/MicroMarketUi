import { MyOrders } from "@/features/orders/pages/MyOrders";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const Route = createFileRoute("/_public/orders")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/signin" });
    }
  },
  validateSearch: searchSchema,
  component: MyOrders,
});
