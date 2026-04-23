import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usersColumns } from "@/features/admin/components/users-columns";
import { userKeys, userService } from "@/features/admin/services/user-service";
import type { Customer, UserRole, UserStatus } from "@/features/admin/types/user";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/admin/users/index";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

const ROLE_OPTIONS: { label: string; value: UserRole | "" }[] = [
  { label: "All roles", value: "" },
  { label: "User", value: "USER" },
  { label: "Administrator", value: "ADMINISTRATOR" },
];

const STATUS_OPTIONS: { label: string; value: UserStatus | "" }[] = [
  { label: "All statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const PAGE_SIZES = [10, 25, 50];

interface UsersTableBodyProps {
  isLoading: boolean;
  rows: Row<Customer>[];
  pageSize: number;
  onRowClick: (customer: Customer) => void;
}

function UsersTableBody({ isLoading, rows, pageSize, onRowClick }: Readonly<UsersTableBodyProps>) {
  if (isLoading) {
    return Array.from({ length: pageSize }, (_, i) => `skeleton-row-${i}`).map(rowKey => (
      <TableRow key={rowKey}>
        {usersColumns.map(col => (
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
        <TableCell colSpan={usersColumns.length} className="py-16 text-center text-muted-foreground">
          <Users className="mx-auto mb-2 size-8 opacity-40" />
          <p>No users found</p>
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
      onClick={() => onRowClick(row.original)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick(row.original);
        }
      }}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
}

export function AdminUsers() {
  "use no memo";

  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/users/" });
  const queryClient = useQueryClient();

  const filter = {
    page: search.page,
    size: search.size,
    ...(search.email?.trim() && { email: search.email.trim() }),
    ...(search.role && { role: search.role }),
    ...(search.status && { status: search.status }),
    ...(search.createdFrom && { createdFrom: new Date(search.createdFrom).toISOString() }),
    ...(search.createdTo && { createdTo: new Date(search.createdTo).toISOString() }),
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: userKeys.list(filter),
    queryFn: () => userService.findAllCustomers(filter),
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
      queryKey: userKeys.list(nextFilter),
      queryFn: () => userService.findAllCustomers(nextFilter),
    });
  }

  function clearFilters() {
    navigate({ search: { page: 0, size: search.size } });
  }

  function handleRowClick(customer: Customer) {
    navigate({
      to: "/admin/users/$userId",
      params: { userId: customer.id },
      search: { type: customer.type, email: customer.email, createdAt: customer.createdAt },
    });
  }

  const hasFilters = search.email || search.role || search.status || search.createdFrom || search.createdTo;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.content ?? [],
    columns: usersColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  if (isError) {
    return <ErrorDisplay />;
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Users</h2>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <Field className="w-auto">
          <FieldLabel>Email</FieldLabel>
          <Input
            placeholder="Search email…"
            value={search.email ?? ""}
            onChange={e => setSearch({ email: e.target.value || undefined, page: 0 })}
            className="h-8 text-sm w-56"
          />
        </Field>

        <Field className="w-auto">
          <FieldLabel>Role</FieldLabel>
          <Select
            value={search.role ?? "_all"}
            onValueChange={val => setSearch({ role: val === "_all" ? undefined : (val as UserRole), page: 0 })}
          >
            <SelectTrigger className="h-8 text-sm w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map(o => (
                <SelectItem key={o.value || "_all"} value={o.value || "_all"}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="w-auto">
          <FieldLabel>Status</FieldLabel>
          <Select
            value={search.status ?? "_all"}
            onValueChange={val => setSearch({ status: val === "_all" ? undefined : (val as UserStatus), page: 0 })}
          >
            <SelectTrigger className="h-8 text-sm w-36">
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
          <FieldLabel>Joined</FieldLabel>
          <DateRangePicker
            from={search.createdFrom}
            to={search.createdTo}
            onChange={(from, to) => setSearch({ createdFrom: from, createdTo: to, page: 0 })}
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
            <UsersTableBody
              isLoading={isLoading}
              rows={table.getRowModel().rows}
              pageSize={search.size}
              onRowClick={handleRowClick}
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
