import { AdminProductDetail } from "@/features/admin/pages/ProductsDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/$productId")({
  component: AdminProductDetail,
});
