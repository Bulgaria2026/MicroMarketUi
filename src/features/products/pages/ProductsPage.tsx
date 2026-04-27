import { getRouteApi } from "@tanstack/react-router";
import { ProductGrid } from "@/features/products/components/ProductGrid";

const routeApi = getRouteApi("/_public/");

export function ProductsPage() {
  const { name } = routeApi.useSearch();
  return <ProductGrid name={name} />;
}
