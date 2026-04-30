export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  enabled: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  name?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  discount: number;
  enabled: boolean;
  amount: number;
}
