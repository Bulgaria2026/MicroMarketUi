export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "PAYMENT_FAILED" | "CANCELLED" | "REFUNDED";

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  originalUnitPrice: number;
  priceAtPurchase: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerId: string;
  email: string;
  stripeCheckoutSessionId: string;
  totalAmount: number;
  orderItems: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  orderNumber?: string;
  email?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
