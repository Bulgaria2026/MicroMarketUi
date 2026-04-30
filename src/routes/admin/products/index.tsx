import { AdminProducts } from "@/features/admin/pages/Products";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export const Route = createFileRoute("/admin/products/")({
  validateSearch: searchSchema,
  component: AdminProducts,
});
