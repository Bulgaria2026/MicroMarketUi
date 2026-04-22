import { api } from "@/lib/api";
import type { Order, OrderDetail, OrderFilter } from "@/features/admin/types/order";
import type { PageResponse } from "@/types/api";

export const orderService = {
  findAll: async (filter: OrderFilter): Promise<PageResponse<Order>> => {
    const res = await api.get<PageResponse<Order>>("/order", { params: filter });
    return res.data;
  },
  findById: async (id: string): Promise<OrderDetail> => {
    const res = await api.get<OrderDetail>(`/order/${id}`);
    return res.data;
  },
};

export const orderKeys = {
  all: ["orders"] as const,
  list: (filter: OrderFilter) => ["orders", "list", filter] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};
