import type { Product, ProductFilter, ProductRequest } from "@/features/products/types/product";
import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";

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
  findAll: async (page: number, size = 20, name?: string): Promise<PageResponse<Product>> => {
    const res = await api.get<PageResponse<Product>>("/product", {
      params: { page, size, ...(name ? { name } : {}) },
    });
    return res.data;
  },
  findAllAdmin: async (filter: ProductFilter): Promise<PageResponse<Product>> => {
    const res = await api.get<PageResponse<Product>>("/product", {
      params: { ...filter, sort: "createdAt,desc" },
    });
    return res.data;
  },
  create: async (body: ProductRequest): Promise<Product> => {
    const res = await api.post<Product>("/product", body);
    return res.data;
  },
  update: async (id: string, body: ProductRequest): Promise<Product> => {
    const res = await api.put<Product>(`/product/${id}`, body);
    return res.data;
  },
};
