import { blurFirst } from "@/components/form/form";
import type { Product, ProductRequest } from "@/features/products/types/product";
import { z } from "zod";

export interface ProductFormValues {
  name: string;
  description: string;
  priceInput: string;
  discountInput: string;
  amountInput: string;
  enabled: boolean;
}

export function buildProductFormValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    priceInput: product?.price !== undefined ? String(product.price) : "",
    discountInput: product?.discount !== undefined ? String(product.discount) : "0",
    amountInput: product?.amount !== undefined ? String(product.amount) : "",
    enabled: product?.enabled ?? true,
  };
}

export function productValuesToRequest(values: ProductFormValues): ProductRequest {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number.parseFloat(values.priceInput),
    discount: Number.parseInt(values.discountInput) || 0,
    amount: Number.parseInt(values.amountInput),
    enabled: values.enabled,
  };
}

export const productNameValidator = blurFirst(
  z.string().trim().min(1, "Name is required").max(255, "Max 255 characters"),
);

export const productDescriptionValidator = blurFirst(
  z.string().trim().min(1, "Description is required").max(1000, "Max 1000 characters"),
);

export const productPriceValidator = blurFirst(
  z.string().refine(v => {
    const n = Number.parseFloat(v);
    return !Number.isNaN(n) && n > 0;
  }, "Must be a positive number"),
);

export const productDiscountValidator = blurFirst(
  z.string().refine(v => {
    const n = Number.parseInt(v);
    return !Number.isNaN(n) && n >= 0 && n <= 100;
  }, "Must be 0–100"),
);

export const productAmountValidator = blurFirst(
  z.string().refine(v => {
    const n = Number.parseInt(v);
    return !Number.isNaN(n) && n >= 0;
  }, "Must be 0 or more"),
);
