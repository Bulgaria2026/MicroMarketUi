import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/features/products/types/product";
import { cn } from "@/lib/utils";
// eslint-disable-next-line no-restricted-imports
import { formatOrderDate } from "../lib/order-utils";

export const productsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.slice(0, 8)}…
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="text-sm">
        €{Number(row.original.price).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Stock",
    cell: ({ row }) => {
      const amount = row.original.amount;

      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            amount > 0
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {amount > 0 ? `${amount} in stock` : "Out of stock"}
        </span>
      );
    },
  },
  {
    accessorKey: "enabled",
    header: "Status",
    cell: ({ row }) => {
      const enabled = row.original.enabled;
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
            enabled
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              enabled ? "bg-emerald-500 dark:bg-emerald-400" : "bg-zinc-400 dark:bg-zinc-500",
            )}
          />
          {enabled ? "Enabled" : "Disabled"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <span className="text-muted-foreground">{formatOrderDate(row.original.createdAt)}</span>,
  },
];
