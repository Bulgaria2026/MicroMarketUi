import { api } from "@/lib/api";

export interface CheckoutStatusResponse {
  orderNumber: string;
  status: "PENDING_PAYMENT" | "PAID" | "PAYMENT_FAILED" | "CANCELLED" | "REFUNDED";
}

export interface PlaceOrderResponse {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  checkoutUrl: string;
}

export const checkoutService = {
  getSessionStatus: async (sessionId: string): Promise<CheckoutStatusResponse> => {
    const res = await api.get<CheckoutStatusResponse>(`/checkout/sessions/${sessionId}/status`);
    return res.data;
  },
  placeOrder: async (
    items: Array<{ productId: string; quantity: number }>,
    email?: string,
  ): Promise<PlaceOrderResponse> => {
    const res = await api.post<PlaceOrderResponse>("/order", { items, email: email ?? null });
    return res.data;
  },
};
