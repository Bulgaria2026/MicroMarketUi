import { ProductGrid } from "@/features/products/ProductGrid";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: () => <ProductGrid />,
});
