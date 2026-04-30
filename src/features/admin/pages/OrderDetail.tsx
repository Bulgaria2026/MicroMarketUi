import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatOrderDateTime, STATUS_CLASSES } from "@/features/admin/lib/order-utils";
import { orderKeys, orderService } from "@/features/admin/services/order-service";
import type { Order } from "@/features/admin/types/order";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface OrderDetailContentProps {
  isLoading: boolean;
  isError: boolean;
  order: Order | undefined;
}

function OrderDetailContent({ isLoading, isError, order }: Readonly<OrderDetailContentProps>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 bg-muted rounded animate-pulse w-1/3" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorDisplay />;
  }

  if (!order) {
    return <p className="text-muted-foreground">Order not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-0.5">Order #</p>
          <p className="font-mono">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Order ID</p>
          <p className="font-mono text-xs">{order.id}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Customer</p>
          <p>{order.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Status</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              STATUS_CLASSES[order.status],
            )}
          >
            {order.status.replace("_", " ")}
          </span>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Created</p>
          <p>{formatOrderDateTime(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Last updated</p>
          <p>{formatOrderDateTime(order.updatedAt)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-3">Items</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Price at Purchase</TableHead>
                <TableHead>Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map(item => {
                const discountPct =
                  item.originalUnitPrice > 0 && item.originalUnitPrice !== item.priceAtPurchase
                    ? Math.round((1 - item.priceAtPurchase / item.originalUnitPrice) * 100)
                    : 0;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.originalUnitPrice)}</TableCell>
                    <TableCell>
                      {discountPct > 0 ? (
                        <span className="text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-1.5 py-0.5 rounded-md">
                          -{discountPct}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(item.priceAtPurchase)}</TableCell>
                    <TableCell>{formatCurrency(item.quantity * item.priceAtPurchase)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              {order.subtotal !== order.paidTotal && (
                <>
                  {order.couponAmountOff != null && order.couponAmountOff > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-medium text-green-600 dark:text-green-400">
                        Coupon{order.couponCode ? ` (${order.couponCode})` : ""}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        -{formatCurrency(order.couponAmountOff)}
                      </TableCell>
                    </TableRow>
                  )}
                  {order.subtotal - order.paidTotal - (order.couponAmountOff ?? 0) > 0.001 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-medium text-green-600 dark:text-green-400">
                        Product discounts
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        -{formatCurrency(order.subtotal - order.paidTotal - (order.couponAmountOff ?? 0))}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium">
                  {order.subtotal == order.paidTotal ? "Total" : "Total Paid"}
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(order.paidTotal)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}

export function AdminOrderDetail() {
  const { orderId } = useParams({ from: "/admin/orders/$orderId" });

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<Order>({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderService.findById(orderId),
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/admin/orders">
            <ArrowLeft />
          </Link>
        </Button>
        <h2 className="text-2xl font-semibold">{order ? `Order ${order.orderNumber}` : "Order Details"}</h2>
      </div>

      <OrderDetailContent isLoading={isLoading} isError={isError} order={order} />
    </div>
  );
}
