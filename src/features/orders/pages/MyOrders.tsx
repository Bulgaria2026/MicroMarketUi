import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_CLASSES, formatCurrency, formatOrderDateTime } from "@/features/admin/lib/order-utils";
import type { Order, OrderStatus } from "@/features/admin/types/order";
import { ownOrderKeys, ownOrderService } from "@/features/orders/services/own-order-service";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/_public/orders";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  PAYMENT_FAILED: "Payment Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const PAGE_SIZES = [5, 10, 25];

function OrderCard({ order }: Readonly<{ order: Order }>) {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="font-mono font-semibold text-sm">{order.orderNumber}</span>
          <span className="text-sm text-muted-foreground">{formatOrderDateTime(order.createdAt)}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            STATUS_CLASSES[order.status],
          )}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <Separator />

      {/* Items */}
      <div className="divide-y divide-border">
        {order.orderItems.map(item => (
          <div key={item.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                {item.productName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate">{item.productName}</span>
            </div>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <span className="text-sm text-muted-foreground">
                {item.quantity} ×{" "}
                {item.originalUnitPrice !== item.priceAtPurchase && (
                  <span className="line-through mr-1">{formatCurrency(item.originalUnitPrice)}</span>
                )}
                {formatCurrency(item.priceAtPurchase)}
              </span>
              <span className="text-sm font-medium w-20 text-right">
                {formatCurrency(item.quantity * item.priceAtPurchase)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex flex-col items-end gap-1 px-5 py-3">
        {order.couponAmountOff != null && order.couponAmountOff > 0 && (
          <span className="text-xs text-green-600 dark:text-green-400">
            Coupon{order.couponCode ? ` ${order.couponCode}` : ""}: -{formatCurrency(order.couponAmountOff)}
          </span>
        )}
        {order.subtotal - order.paidTotal - (order.couponAmountOff ?? 0) > 0.001 && (
          <span className="text-xs text-green-600 dark:text-green-400">
            Product discounts: -{formatCurrency(order.subtotal - order.paidTotal - (order.couponAmountOff ?? 0))}
          </span>
        )}
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-semibold text-sm w-20 text-right">{formatCurrency(order.paidTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Separator />
      <div className="divide-y divide-border">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-end px-5 py-3 gap-6">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <Package className="size-12 opacity-30 mb-3" />
      <p className="font-medium">No orders yet</p>
      <p className="text-sm mt-1">Your order history will appear here.</p>
    </div>
  );
}

export function MyOrders() {
  "use no memo";

  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/orders" });
  const queryClient = useQueryClient();

  const filter = {
    page: search.page,
    size: search.size,
    ...(search.fromDate && { fromDate: new Date(search.fromDate).toISOString() }),
    ...(search.toDate && { toDate: new Date(search.toDate).toISOString() }),
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ownOrderKeys.list(filter),
    queryFn: () => ownOrderService.findOwn(filter),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.page.totalPages ?? 0;
  const orders: Order[] = data?.content ?? [];

  function setSearch(patch: Partial<typeof search>) {
    navigate({ search: prev => ({ ...prev, ...patch }) });
  }

  function setPage(page: number) {
    setSearch({ page });
  }

  function prefetchPage(page: number) {
    const nextFilter = { ...filter, page };
    queryClient.prefetchQuery({
      queryKey: ownOrderKeys.list(nextFilter),
      queryFn: () => ownOrderService.findOwn(nextFilter),
    });
  }

  function clearFilters() {
    navigate({ search: { page: 0, size: search.size } });
  }

  const hasFilters = search.fromDate || search.toDate;

  if (isError) {
    return <ErrorDisplay />;
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <Field className="w-auto">
          <FieldLabel>Date range</FieldLabel>
          <DateRangePicker
            from={search.fromDate}
            to={search.toDate}
            onChange={(from, to) => setSearch({ fromDate: from, toDate: to, page: 0 })}
          />
        </Field>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="mb-0.5">
            Clear
          </Button>
        )}
      </div>

      {/* Order cards */}
      <div className={cn("space-y-4 transition-opacity", isPlaceholderData && "opacity-60")}>
        {isLoading && (
          <>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </>
        )}
        {!isLoading && orders.length === 0 && <EmptyOrders />}
        {!isLoading && orders.map(order => <OrderCard key={order.id} order={order} />)}
      </div>

      {/* Pagination */}
      {!isLoading && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Per page:</span>
            <Select value={String(search.size)} onValueChange={val => setSearch({ size: Number(val), page: 0 })}>
              <SelectTrigger className="h-7 text-sm w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(s => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              Page {search.page + 1} of {totalPages || 1}
              {data && <span className="ml-1">({data.page.totalElements} total)</span>}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage(search.page - 1)}
                onMouseEnter={() => search.page > 0 && prefetchPage(search.page - 1)}
                disabled={search.page === 0 || isPlaceholderData}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage(search.page + 1)}
                onMouseEnter={() => search.page < totalPages - 1 && prefetchPage(search.page + 1)}
                disabled={search.page >= totalPages - 1 || isPlaceholderData}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
