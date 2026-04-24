import { ProductGrid } from "@/features/products/components/ProductGrid";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: () => <ProductGrid />,
});
