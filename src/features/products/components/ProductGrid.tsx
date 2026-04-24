import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/features/products/services/product-service";
import { ProductCard } from "@/features/products/pages/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";

export function ProductGrid() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const PAGE_SIZE = 20;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products"],
    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      productService.findAll(pageParam, PAGE_SIZE),

    getNextPageParam: (lastPage, pages) => {
      return lastPage.content.length < PAGE_SIZE
        ? undefined
        : pages.length;
    },
  });

  const products = data?.pages.flatMap((p) => p.content) ?? [];

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <section className="px-8 py-6 space-y-4">
      <h2 className="text-lg font-semibold">Our most Popular Items</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      <div ref={loadMoreRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="text-center text-sm text-muted-foreground py-4">
          loading more goodies…
        </p>
      )}
    </section>
  );
}
