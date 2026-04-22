import { AdminProducts } from "@/features/admin/pages/Products";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});
