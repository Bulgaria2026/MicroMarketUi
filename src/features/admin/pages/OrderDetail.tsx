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
                <TableHead>Original Price</TableHead>
                <TableHead>Price at Purchase</TableHead>
                <TableHead>Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.originalUnitPrice)}</TableCell>
                  <TableCell>{formatCurrency(item.priceAtPurchase)}</TableCell>
                  <TableCell>{formatCurrency(item.quantity * item.priceAtPurchase)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
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
        <h2 className="text-2xl font-semibold">
          {order ? `Order ${order.orderNumber}` : "Order Details"}
        </h2>
      </div>

      <OrderDetailContent isLoading={isLoading} isError={isError} order={order} />
    </div>
  );
}
