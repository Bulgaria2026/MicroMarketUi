import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/admin/services/product-service";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.findAll,
  });

  const products = data?.content ?? [];

  return (
    <section className="px-8 py-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Our most Popular Items
      </h2>

      <div className="
        grid gap-4
        grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
      ">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
