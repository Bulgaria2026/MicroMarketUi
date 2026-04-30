import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { productKeys, productService } from "@/features/products/services/product-service";
import type { Product, ProductRequest } from "@/features/products/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

function ProductEditForm({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [amount, setAmount] = useState(product.amount);
  const [enabled, setEnabled] = useState(product.enabled);

  const mutation = useMutation({
    mutationFn: (data: ProductRequest) =>
      productService.update(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(product.id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h3 className="text-lg font-medium">Edit</h3>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Price</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 w-full">
          <label className="text-sm text-muted-foreground">Stock</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm text-muted-foreground">Status</label>
          <select
            value={enabled ? "enabled" : "disabled"}
            onChange={e => setEnabled(e.target.value === "enabled")}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">Failed to update product</p>
      )}

      <Button
        onClick={() =>
          mutation.mutate({
            name,
            description: product.description,
            price,
            discount: product.discount,
            amount,
            enabled,
          })
        }
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

interface ProductDetailContentProps {
  isLoading: boolean;
  isError: boolean;
  product: Product | undefined;
}

function ProductDetailContent({
  isLoading,
  isError,
  product,
}: Readonly<ProductDetailContentProps>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 bg-muted rounded animate-pulse w-1/3" />
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
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {product.amount > 0
              ? `${product.amount} in stock`
              : "Out of stock"}
          </span>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Status</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              product.enabled
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-600"
            )}
          >
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

      <ProductEditForm product={product} />
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

        <h2 className="text-2xl font-semibold">
          {product ? product.name : "Product Details"}
        </h2>
      </div>

      <ProductDetailContent
        isLoading={isLoading}
        isError={isError}
        product={product}
      />
    </div>
  );
}
