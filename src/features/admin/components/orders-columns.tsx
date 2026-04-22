import { formatCurrency, formatOrderDate, STATUS_CLASSES } from "@/features/admin/lib/order-utils";
import type { Order } from "@/features/admin/types/order";
import type { ColumnDef } from "@tanstack/react-table";

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
    cell: ({ row }) => <span className="text-muted-foreground">{formatOrderDate(row.original.createdAt)}</span>,
  },
];
