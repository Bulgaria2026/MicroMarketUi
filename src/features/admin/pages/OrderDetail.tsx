import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orderKeys, orderService } from "@/features/admin/services/order-service";
import type { OrderDetail, OrderStatus } from "@/features/admin/types/order";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface OrderDetailContentProps {
  isLoading: boolean;
  order: OrderDetail | undefined;
}

function OrderDetailContent({ isLoading, order }: Readonly<OrderDetailContentProps>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 bg-muted rounded animate-pulse w-1/3" />
        ))}
      </div>
    );
  }

  if (!order) {
    return <p className="text-muted-foreground">Order not found.</p>;
  }

  const orderTotal = order.orderItems.reduce(
    (sum, item) => sum + item.quantity * Number.parseFloat(item.priceAtPurchase),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-0.5">Order ID</p>
          <p className="font-mono">{order.id}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Customer ID</p>
          <p className="font-mono">{order.customerId}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Status</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              STATUS_CLASSES[order.status],
            )}
          >
            {order.status}
          </span>
        </div>
        <div>
          <p className="text-muted-foreground mb-0.5">Created</p>
          <p>{formatDate(order.createdAt)}</p>
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
                <TableHead>Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.description}</p>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(Number.parseFloat(item.priceAtPurchase))}</TableCell>
                  <TableCell>{formatCurrency(item.quantity * Number.parseFloat(item.priceAtPurchase))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(orderTotal)}</TableCell>
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

  const { data: order, isLoading } = useQuery<OrderDetail>({
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
        <h2 className="text-2xl font-semibold">Order Details</h2>
      </div>

      <OrderDetailContent isLoading={isLoading} order={order} />
    </div>
  );
}
