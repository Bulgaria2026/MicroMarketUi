import { api } from "@/lib/api";
import type { Product} from "@/features/admin/types/product";
import type { PageResponse } from "@/types/api";

export const productService = {
    findAll: async (): Promise<PageResponse<Product>> => {
        const res = await api.get<PageResponse<Product>>("/product");
        return res.data;
    },
    findById: async (id: string): Promise<Product> => {
        const res = await api.get<Product>(`/product/${id}`);
        return res.data;
    }
};