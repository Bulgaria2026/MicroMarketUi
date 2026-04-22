import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ordersColumns } from "@/features/admin/components/orders-columns";
import { orderKeys, orderService } from "@/features/admin/services/order-service";
import type { Order, OrderStatus } from "@/features/admin/types/order";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/admin/orders/index";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

interface OrdersTableBodyProps {
  isLoading: boolean;
  rows: Row<Order>[];
  pageSize: number;
  onRowClick: (orderId: string) => void;
}

function OrdersTableBody({ isLoading, rows, pageSize, onRowClick }: Readonly<OrdersTableBodyProps>) {
  if (isLoading) {
    return Array.from({ length: pageSize }).map((_, i) => (
      <TableRow key={i}>
        {ordersColumns.map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={ordersColumns.length} className="py-16 text-center text-muted-foreground">
          <ShoppingBag className="mx-auto mb-2 size-8 opacity-40" />
          <p>No orders found</p>
        </TableCell>
      </TableRow>
    );
  }

  return rows.map(row => (
    <TableRow
      key={row.id}
      className="cursor-pointer"
      tabIndex={0}
      role="button"
      onClick={() => onRowClick(row.original.id)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick(row.original.id);
        }
      }}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
}

const STATUS_OPTIONS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PAGE_SIZES = [10, 25, 50];

export function AdminOrders() {
  "use no memo";

  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/orders/" });
  const queryClient = useQueryClient();

  const filter = {
    page: search.page,
    size: search.size,
    ...(search.status && { status: search.status }),
    ...(search.customerId?.trim() && { customerId: search.customerId.trim() }),
    ...(search.fromDate && { fromDate: new Date(search.fromDate).toISOString() }),
    ...(search.toDate && { toDate: new Date(search.toDate).toISOString() }),
  };

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: orderKeys.list(filter),
    queryFn: () => orderService.findAll(filter),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.page.totalPages ?? 0;

  function setSearch(patch: Partial<typeof search>) {
    navigate({ search: prev => ({ ...prev, ...patch }) });
  }

  function setPage(page: number) {
    setSearch({ page });
  }

  function prefetchPage(page: number) {
    const nextFilter = { ...filter, page };
    queryClient.prefetchQuery({
      queryKey: orderKeys.list(nextFilter),
      queryFn: () => orderService.findAll(nextFilter),
    });
  }

  function clearFilters() {
    navigate({ search: { page: 0, size: search.size } });
  }

  const hasFilters = search.status || search.customerId || search.fromDate || search.toDate;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.content ?? [],
    columns: ordersColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Orders</h2>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <Field className="w-auto">
          <FieldLabel>Status</FieldLabel>
          <Select
            value={search.status ?? "_all"}
            onValueChange={val => setSearch({ status: val === "_all" ? undefined : (val as OrderStatus), page: 0 })}
          >
            <SelectTrigger className="h-8 text-sm w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(o => (
                <SelectItem key={o.value || "_all"} value={o.value || "_all"}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="w-auto">
          <FieldLabel>From</FieldLabel>
          <Input
            type="date"
            value={search.fromDate ?? ""}
            onChange={e => setSearch({ fromDate: e.target.value || undefined, page: 0 })}
            className="h-8 text-sm"
          />
        </Field>

        <Field className="w-auto">
          <FieldLabel>To</FieldLabel>
          <Input
            type="date"
            value={search.toDate ?? ""}
            onChange={e => setSearch({ toDate: e.target.value || undefined, page: 0 })}
            className="h-8 text-sm"
          />
        </Field>

        <Field className="w-auto">
          <FieldLabel>Customer ID</FieldLabel>
          <Input
            placeholder="UUID…"
            value={search.customerId ?? ""}
            onChange={e => setSearch({ customerId: e.target.value || undefined, page: 0 })}
            className="h-8 text-sm w-52"
          />
        </Field>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="mb-0.5">
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className={cn("rounded-md border transition-opacity", isPlaceholderData && "opacity-60")}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <OrdersTableBody
              isLoading={isLoading}
              rows={table.getRowModel().rows}
              pageSize={search.size}
              onRowClick={orderId => navigate({ to: "/admin/orders/$orderId", params: { orderId } })}
            />
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
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
            Page {search.page + 1} of {totalPages}
            {data && <span className="ml-1">({data.page.totalElements} total)</span>}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(search.page - 1)}
              onMouseEnter={() => search.page > 0 && prefetchPage(search.page - 1)}
              disabled={search.page === 0 || isLoading || isPlaceholderData}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(search.page + 1)}
              onMouseEnter={() => search.page < totalPages - 1 && prefetchPage(search.page + 1)}
              disabled={search.page >= totalPages - 1 || isLoading || isPlaceholderData}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
