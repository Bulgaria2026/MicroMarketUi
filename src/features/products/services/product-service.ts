import type { Product, ProductFilter } from "@/features/products/types/product";
import { api } from "@/lib/api";

export const productKeys = {
  all: ["products"] as const,
  list: (filter: ProductFilter) => ["products", "list", filter] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export const productService = {
  findById: async (id: string): Promise<Product> => {
    const res = await api.get<Product>(`/product/${id}`);
    return res.data;
  },
};
