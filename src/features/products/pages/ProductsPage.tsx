import { ProductGrid } from "@/features/products/components/ProductGrid";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/_public/");

export function ProductsPage() {
  const { name } = routeApi.useSearch();
  return <ProductGrid name={name} />;
}
