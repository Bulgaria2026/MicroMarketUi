import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  name: z.string().optional(),
});

export const Route = createFileRoute("/_search/")({
  validateSearch: searchSchema,
  component: ProductsPage,
});
