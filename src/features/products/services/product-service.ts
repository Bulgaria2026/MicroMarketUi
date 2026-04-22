import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";
import type { Product } from "../types/product";

export const productService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PageResponse<Product>>("/product", { params }).then(r => r.data),
};
