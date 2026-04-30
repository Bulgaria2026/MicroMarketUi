import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateProductDialog } from "@/features/admin/components/createproductdialog";
import { productsColumns } from "@/features/admin/components/products-columns";
import { productKeys, productService } from "@/features/products/services/product-service";
import type { Product } from "@/features/products/types/product";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/admin/products";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductsTableBodyProps {
  isLoading: boolean;
  rows: Row<Product>[];
  pageSize: number;
  onRowClick: (productId: string) => void;
}

function ProductsTableBody({ isLoading, rows, pageSize, onRowClick }: Readonly<ProductsTableBodyProps>) {
  if (isLoading) {
    return Array.from({ length: pageSize }, (_, i) => `skeleton-row-${i}`).map(rowKey => (
      <TableRow key={rowKey}>
        {productsColumns.map(col => (
          <TableCell key={col.id}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={productsColumns.length} className="py-16 text-center text-muted-foreground">
          <Package className="mx-auto mb-2 size-8 opacity-40" />
          <p>No products found</p>
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

const PAGE_SIZES = [10, 25, 50];

export function AdminProducts() {
  "use no memo";

  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/products/" });
  const [createOpen, setCreateOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(search.name ?? "");

  useEffect(() => {
    setNameDraft(search.name ?? "");
  }, [search.name]);

  useEffect(() => {
    const next = nameDraft.trim() || undefined;
    if (next === search.name) return;
    const t = setTimeout(() => {
      navigate({ search: prev => ({ ...prev, name: next, page: 0 }) });
    }, 300);
    return () => clearTimeout(t);
  }, [nameDraft, search.name, navigate]);

  const filter = {
    page: search.page,
    size: search.size,
    ...(search.name?.trim() && { name: search.name.trim() }),
    ...(search.enabled !== undefined && { enabled: search.enabled }),
    ...(search.minPrice !== undefined && { minPrice: search.minPrice }),
    ...(search.maxPrice !== undefined && { maxPrice: search.maxPrice }),
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => productService.findAllAdmin(filter),
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
      queryKey: productKeys.list(nextFilter),
      queryFn: () => productService.findAllAdmin(nextFilter),
    });
  }

  function clearFilters() {
    setNameDraft("");
    navigate({ search: { page: 0, size: search.size } });
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.content ?? [],
    columns: productsColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  if (isError) return <ErrorDisplay />;

  const hasFilters =
    !!search.name || search.enabled !== undefined || search.minPrice !== undefined || search.maxPrice !== undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <Field className="w-auto">
          <FieldLabel>Name</FieldLabel>
          <Input
            placeholder="Search name…"
            value={nameDraft}
            onChange={e => setNameDraft(e.target.value)}
            className="h-8 text-sm w-56"
          />
        </Field>

        <Field className="w-auto">
          <FieldLabel>Status</FieldLabel>
          <Select
            value={search.enabled === undefined ? "_all" : String(search.enabled)}
            onValueChange={val => setSearch({ enabled: val === "_all" ? undefined : val === "true", page: 0 })}
          >
            <SelectTrigger className="h-8 text-sm w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All statuses</SelectItem>
              <SelectItem value="true">Enabled</SelectItem>
              <SelectItem value="false">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field className="w-auto">
          <FieldLabel>Min price</FieldLabel>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={search.minPrice ?? ""}
            onChange={e => {
              const v = e.target.value;
              const n = v === "" ? undefined : Number(v);
              setSearch({ minPrice: n !== undefined && Number.isFinite(n) ? n : undefined, page: 0 });
            }}
            className="h-8 text-sm w-28"
          />
        </Field>

        <Field className="w-auto">
          <FieldLabel>Max price</FieldLabel>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="∞"
            value={search.maxPrice ?? ""}
            onChange={e => {
              const v = e.target.value;
              const n = v === "" ? undefined : Number(v);
              setSearch({ maxPrice: n !== undefined && Number.isFinite(n) ? n : undefined, page: 0 });
            }}
            className="h-8 text-sm w-28"
          />
        </Field>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="mb-0.5">
            Clear
          </Button>
        )}
      </div>

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
            <ProductsTableBody
              isLoading={isLoading}
              rows={table.getRowModel().rows}
              pageSize={search.size}
              onRowClick={productId =>
                navigate({
                  to: "/admin/products/$productId",
                  params: { productId },
                  search,
                })
              }
            />
          </TableBody>
        </Table>
      </div>

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

      <CreateProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: productKeys.all });
        }}
      />
    </div>
  );
}
