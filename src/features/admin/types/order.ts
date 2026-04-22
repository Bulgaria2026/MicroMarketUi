export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: number;
  enabled: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDetail {
  id: string;
  product: OrderProduct;
  quantity: number;
  priceAtPurchase: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  customerId: string;
  orderItems: OrderItemDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customerId: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
