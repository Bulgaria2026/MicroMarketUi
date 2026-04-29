import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/features/products/types/product";
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
    accessorKey: "Amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            amount > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {amount > 0 ? `${amount} in stock` : "Out of stock"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <span className="text-muted-foreground">{formatOrderDate(row.original.createdAt)}</span>
  },
];
