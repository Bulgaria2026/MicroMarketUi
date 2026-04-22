import type { Order, OrderStatus } from "@/features/admin/types/order";
import type { ColumnDef } from "@tanstack/react-table";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(0, 8)}…</span>,
  },
  {
    accessorKey: "customerId",
    header: "Customer",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.customerId.slice(0, 8)}…</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[row.original.status]}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => row.original.orderItems.length,
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.original.orderItems.reduce(
        (sum, item) => sum + item.quantity * Number.parseFloat(item.priceAtPurchase),
        0,
      );
      return formatCurrency(total);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
  },
];
