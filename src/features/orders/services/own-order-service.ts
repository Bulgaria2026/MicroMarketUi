import { api } from "@/lib/api";
import type { Order } from "@/features/admin/types/order";
import type { PageResponse } from "@/types/api";

export interface OwnOrderFilter {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export const ownOrderService = {
  findOwn: async (filter: OwnOrderFilter): Promise<PageResponse<Order>> => {
    const res = await api.get<PageResponse<Order>>("/order/own", { params: { ...filter, sort: "createdAt,desc" } });
    return res.data;
  },
};

export const ownOrderKeys = {
  all: ["own-orders"] as const,
  list: (filter: OwnOrderFilter) => ["own-orders", "list", filter] as const,
};
