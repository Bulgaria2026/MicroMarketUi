import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAppForm } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  buildProductFormValues,
  productAmountValidator,
  productDescriptionValidator,
  productDiscountValidator,
  productNameValidator,
  productPriceValidator,
  productValuesToRequest,
} from "@/features/admin/lib/product-utils";
import { productKeys, productService } from "@/features/products/services/product-service";
import type { Product } from "@/features/products/types/product";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

function ProductEditForm({ product }: Readonly<{ product: Product }>) {
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const updateMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: productService.update.bind(null, product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(product.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: err => setApiError(getApiErrorMessage(err, "Failed to update product")),
  });

  const form = useAppForm({
    defaultValues: buildProductFormValues(product),
    onSubmit: ({ value }) => {
      setApiError(null);
      updateMutation.mutate(productValuesToRequest(value));
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="rounded-lg border bg-card p-6 space-y-4"
    >
      <h3 className="text-lg font-medium">Edit</h3>

      <form.AppField name="name" validators={productNameValidator}>
        {({ TextField }) => <TextField label="Name *" placeholder="e.g. Sparkling Water" />}
      </form.AppField>

      <form.AppField name="description" validators={productDescriptionValidator}>
        {({ TextareaField }) => (
          <TextareaField label="Description *" placeholder="Write something about the product…" rows={3} />
        )}
      </form.AppField>

      <div className="grid grid-cols-2 gap-3">
        <form.AppField name="priceInput" validators={productPriceValidator}>
          {({ TextField }) => <TextField label="Price (€) *" type="number" placeholder="9.99" />}
        </form.AppField>

        <form.AppField name="discountInput" validators={productDiscountValidator}>
          {({ TextField }) => <TextField label="Discount (%) *" type="number" placeholder="0" />}
        </form.AppField>
      </div>

      <form.AppField name="amountInput" validators={productAmountValidator}>
        {({ TextField }) => <TextField label="Stock *" type="number" placeholder="0" />}
      </form.AppField>

      <form.AppField name="enabled">
        {({ state, handleChange }) => (
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Enabled</p>
              <p className="text-xs text-muted-foreground">Product is visible in the shop</p>
            </div>
            <Switch checked={state.value} onCheckedChange={handleChange} />
          </div>
        )}
      </form.AppField>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <div className="flex justify-end">
        <form.Subscribe selector={state => state.isSubmitting}>
          {isSubmitting => (
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {updateMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

interface ProductDetailContentProps {
  isLoading: boolean;
  isError: boolean;
  product: Product | undefined;
}

function ProductDetailContent({ isLoading, isError, product }: Readonly<ProductDetailContentProps>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => `detail-skeleton-${i}`).map(key => (
          <div key={key} className="h-5 bg-muted rounded animate-pulse w-1/3" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorDisplay />;
  }

  if (!product) {
    return <p className="text-muted-foreground">Product not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Product Name</p>
          <p className="font-medium">{product.name}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Product ID</p>
          <p className="font-mono text-xs">{product.id}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Price</p>
          <p className="font-medium">€{product.price.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Discount</p>
          <p>{product.discount}%</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Stock</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              product.amount > 0
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {product.amount > 0 ? `${product.amount} in stock` : "Out of stock"}
          </span>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Status</p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
              product.enabled
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                product.enabled ? "bg-emerald-500 dark:bg-emerald-400" : "bg-zinc-400 dark:bg-zinc-500",
              )}
            />
            {product.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Created</p>
          <p>{new Date(product.createdAt).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Last updated</p>
          <p>{new Date(product.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <ProductEditForm key={product.id} product={product} />
    </div>
  );
}

export function AdminProductDetail() {
  const { productId } = useParams({
    from: "/admin/products/$productId",
  });

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.findById(productId),
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/admin/products" search={{ page: 0, size: 10 }}>
            <ArrowLeft />
          </Link>
        </Button>

        <h2 className="text-2xl font-semibold">{product ? product.name : "Product Details"}</h2>
      </div>

      <ProductDetailContent isLoading={isLoading} isError={isError} product={product} />
    </div>
  );
}
