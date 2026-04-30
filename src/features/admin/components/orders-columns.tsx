import { formatCurrency, formatOrderDate, STATUS_CLASSES } from "@/features/admin/lib/order-utils";
import type { Order } from "@/features/admin/types/order";
import type { ColumnDef } from "@tanstack/react-table";

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.orderNumber}</span>,
  },
  {
    accessorKey: "email",
    header: "Customer",
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[row.original.status]}`}
      >
        {row.original.status.replace("_", " ")}
      </span>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => row.original.orderItems.length,
  },
  {
    accessorKey: "paidTotal",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.paidTotal),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <span className="text-muted-foreground">{formatOrderDate(row.original.createdAt)}</span>,
  },
];
