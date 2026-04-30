import { ErrorDisplay } from "@/components/ErrorDisplay";
import { blurFirst, useAppForm } from "@/components/form/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildCouponFormValues, couponValuesToRequest } from "@/features/admin/lib/coupon-utils";
import { formatCurrency, formatOrderDate } from "@/features/admin/lib/order-utils";
import { adminCouponKeys, adminCouponService } from "@/features/admin/services/coupon-service";
import type { AdminCouponResponse } from "@/features/admin/types/coupon";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/admin/coupons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, Ticket } from "lucide-react";
import { useState } from "react";

const positiveNumberValidator = blurFirst(
  z.string().refine(v => !Number.isNaN(Number.parseFloat(v)) && Number.parseFloat(v) > 0, "Must be a positive number"),
);

const PAGE_SIZES = [10, 25, 50];

function CreateCouponDialog({ onSuccess }: Readonly<{ onSuccess: () => void }>) {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const createMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: adminCouponService.create,
    onSuccess: () => {
      setOpen(false);
      onSuccess();
    },
    onError: err => setApiError(getApiErrorMessage(err, "Failed to create coupon")),
  });

  const form = useAppForm({
    defaultValues: buildCouponFormValues(),
    onSubmit: ({ value }) => {
      setApiError(null);
      createMutation.mutate(couponValuesToRequest(value));
    },
  });

  function handleOpenChange(o: boolean) {
    setOpen(o);
    if (!o) {
      form.reset();
      setApiError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Create Coupon
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Coupon</DialogTitle>
        </DialogHeader>
        <form
          id="create-coupon-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="amountOffInput" validators={positiveNumberValidator}>
                {({ TextField }) => <TextField label="Amount Off (€) *" type="number" placeholder="5.00" />}
              </form.AppField>
              <form.AppField name="pointCostInput">
                {({ TextField }) => <TextField label="Points Cost" type="number" placeholder="0" />}
              </form.AppField>
            </div>
            <form.AppField name="codeInput">
              {({ TextField }) => <TextField label="Code (auto-generated if blank)" placeholder="MM-PROMO2024" />}
            </form.AppField>
            <form.AppField name="userIdInput">
              {({ TextField }) => <TextField label="Assign to User ID (optional)" placeholder="UUID of user" />}
            </form.AppField>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="maxRedemptionsInput">
                {({ TextField }) => <TextField label="Max Redemptions" type="number" placeholder="Unlimited" />}
              </form.AppField>
              <form.AppField name="expiryDateInput">
                {({ TextField }) => <TextField label="Expiry Date" type="date" />}
              </form.AppField>
            </div>
          </div>
          {apiError && <p className="text-sm text-destructive mt-3">{apiError}</p>}
        </form>
        <DialogFooter>
          <form.Subscribe selector={state => state.isSubmitting}>
            {isSubmitting => (
              <Button type="submit" form="create-coupon-form" disabled={isSubmitting || createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CouponsTableBodyProps {
  isLoading: boolean;
  coupons: AdminCouponResponse[];
  pageSize: number;
  onDeactivate: (id: string) => void;
  isDeactivating: boolean;
}

function CouponsTableBody({
  isLoading,
  coupons,
  pageSize,
  onDeactivate,
  isDeactivating,
}: Readonly<CouponsTableBodyProps>) {
  if (isLoading) {
    return Array.from({ length: pageSize }, (_, i) => `skel-${i}`).map(key => (
      <TableRow key={key}>
        {Array.from({ length: 8 }, (_, j) => `cell-${j}`).map(cellKey => (
          <TableCell key={cellKey}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  if (coupons.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
          <Ticket className="mx-auto mb-2 size-8 opacity-40" />
          <p>No coupons found</p>
        </TableCell>
      </TableRow>
    );
  }

  return coupons.map(coupon => (
    <TableRow key={coupon.id}>
      <TableCell>
        <span className="font-mono text-xs">{coupon.code}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{coupon.name ?? <span className="text-muted-foreground">—</span>}</span>
      </TableCell>
      <TableCell>
        {coupon.userId ? (
          <span className="font-mono text-xs text-muted-foreground">{coupon.userId.slice(0, 8)}…</span>
        ) : (
          <span className="text-muted-foreground text-xs">Public</span>
        )}
      </TableCell>
      <TableCell className="font-medium">{formatCurrency(coupon.amountOff)}</TableCell>
      <TableCell>
        <span className="text-sm tabular-nums">
          {coupon.timesRedeemed}
          {coupon.maxRedemptions == null ? "" : ` / ${coupon.maxRedemptions}`}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            coupon.active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400",
          )}
        >
          {coupon.active ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{formatOrderDate(coupon.createdAt)}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          disabled={!coupon.active || !!coupon.couponOfferId || isDeactivating}
          onClick={() => onDeactivate(coupon.id)}
        >
          Deactivate
        </Button>
      </TableCell>
    </TableRow>
  ));
}

export function AdminCoupons() {
  "use no memo";

  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/coupons/" });
  const queryClient = useQueryClient();

  const filter = {
    page: search.page,
    size: search.size,
    ...(search.active !== undefined && { active: search.active }),
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: adminCouponKeys.list(filter),
    queryFn: () => adminCouponService.findAll(filter),
    placeholderData: keepPreviousData,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => adminCouponService.patch(id, { active: false }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminCouponKeys.all });
    },
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
      queryKey: adminCouponKeys.list(nextFilter),
      queryFn: () => adminCouponService.findAll(nextFilter),
    });
  }

  if (isError) return <ErrorDisplay />;

  const hasFilters = search.active !== undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Coupons</h2>
        <CreateCouponDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: adminCouponKeys.all })} />
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <Select
          value={search.active === undefined ? "_all" : String(search.active)}
          onValueChange={val => setSearch({ active: val === "_all" ? undefined : val === "true", page: 0 })}
        >
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All statuses</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ search: { page: 0, size: search.size } })}
            className="mb-0.5"
          >
            Clear
          </Button>
        )}
      </div>

      <div className={cn("rounded-md border transition-opacity", isPlaceholderData && "opacity-60")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount Off</TableHead>
              <TableHead>Redeemed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Deactivate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <CouponsTableBody
              isLoading={isLoading}
              coupons={data?.content ?? []}
              pageSize={search.size}
              onDeactivate={id => deactivateMutation.mutate(id)}
              isDeactivating={deactivateMutation.isPending}
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
    </div>
  );
}
