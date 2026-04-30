import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAppForm, blurFirst } from "@/components/form/form";
import { z } from "zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildOfferFormValues, offerValuesToRequest } from "@/features/admin/lib/offer-utils";
import { formatCurrency, formatOrderDate } from "@/features/admin/lib/order-utils";
import { adminCouponOfferKeys, adminCouponOfferService } from "@/features/admin/services/coupon-offer-service";
import type { AdminCouponOfferResponse } from "@/features/admin/types/coupon-offer";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/admin/coupon-offers";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Gift, Plus } from "lucide-react";
import { useState } from "react";

const nameValidator = blurFirst(z.string().min(1, "Name is required"));
const positiveNumberValidator = blurFirst(
  z.string().refine(v => !Number.isNaN(Number.parseFloat(v)) && Number.parseFloat(v) > 0, "Must be a positive number"),
);
const nonNegativeIntValidator = blurFirst(
  z.string().refine(v => !Number.isNaN(Number.parseInt(v)) && Number.parseInt(v) >= 0, "Must be 0 or more"),
);

const PAGE_SIZES = [10, 25, 50];

function CreateOfferDialog({ onSuccess }: Readonly<{ onSuccess: () => void }>) {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const createMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: adminCouponOfferService.create,
    onSuccess: () => {
      setOpen(false);
      onSuccess();
    },
    onError: err => setApiError(getApiErrorMessage(err, "Failed to create offer")),
  });

  const form = useAppForm({
    defaultValues: buildOfferFormValues(),
    onSubmit: ({ value }) => {
      setApiError(null);
      createMutation.mutate(offerValuesToRequest(value));
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
          Create Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Coupon Offer</DialogTitle>
        </DialogHeader>
        <form
          id="create-offer-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-3 mt-2">
            <form.AppField name="name" validators={nameValidator}>
              {({ TextField }) => <TextField label="Name *" placeholder="Summer discount" />}
            </form.AppField>
            <form.AppField name="description">
              {({ TextareaField }) => (
                <TextareaField label="Description" placeholder="Optional description shown to users" rows={2} />
              )}
            </form.AppField>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="amountOffInput" validators={positiveNumberValidator}>
                {({ TextField }) => <TextField label="Amount Off (€) *" type="number" placeholder="5.00" />}
              </form.AppField>
              <form.AppField name="pointCostInput" validators={nonNegativeIntValidator}>
                {({ TextField }) => <TextField label="Points Cost *" type="number" placeholder="100" />}
              </form.AppField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="maxPurchasesInput">
                {({ TextField }) => <TextField label="Max Purchases" type="number" placeholder="Unlimited" />}
              </form.AppField>
              <form.AppField name="active">
                {({ state, handleChange }) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={String(state.value)} onValueChange={(v: string) => handleChange(v === "true")}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.AppField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="startDateInput">
                {({ TextField }) => <TextField label="Start Date" type="date" />}
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
              <Button type="submit" form="create-offer-form" disabled={isSubmitting || createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface OffersTableBodyProps {
  isLoading: boolean;
  offers: AdminCouponOfferResponse[];
  pageSize: number;
}

function OffersTableBody({ isLoading, offers, pageSize }: Readonly<OffersTableBodyProps>) {
  const navigate = useNavigate();

  if (isLoading) {
    return Array.from({ length: pageSize }, (_, i) => `skel-${i}`).map(key => (
      <TableRow key={key}>
        {Array.from({ length: 7 }, (_, j) => `cell-${j}`).map(cellKey => (
          <TableCell key={cellKey}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  if (offers.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
          <Gift className="mx-auto mb-2 size-8 opacity-40" />
          <p>No coupon offers found</p>
        </TableCell>
      </TableRow>
    );
  }

  return offers.map(offer => (
    <TableRow
      key={offer.id}
      className="cursor-pointer"
      onClick={() => navigate({ to: "/admin/coupon-offers/$offerId", params: { offerId: offer.id } })}
    >
      <TableCell className="font-medium text-sm">{offer.name}</TableCell>
      <TableCell className="tabular-nums">{offer.pointCost.toLocaleString()}</TableCell>
      <TableCell className="font-medium">{formatCurrency(offer.amountOff)}</TableCell>
      <TableCell className="tabular-nums text-sm">
        {offer.purchaseCount}
        {offer.maxPurchases == null ? "" : ` / ${offer.maxPurchases}`}
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            offer.active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400",
          )}
        >
          {offer.active ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {offer.expiryDate ? (
          new Date(offer.expiryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{formatOrderDate(offer.createdAt)}</TableCell>
    </TableRow>
  ));
}

export function AdminCouponOffers() {
  "use no memo";

  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/coupon-offers/" });
  const queryClient = useQueryClient();

  const filter = {
    page: search.page,
    size: search.size,
    ...(search.active !== undefined && { active: search.active }),
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: adminCouponOfferKeys.list(filter),
    queryFn: () => adminCouponOfferService.findAll(filter),
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
      queryKey: adminCouponOfferKeys.list(nextFilter),
      queryFn: () => adminCouponOfferService.findAll(nextFilter),
    });
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: adminCouponOfferKeys.all });
  }

  if (isError) return <ErrorDisplay />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Coupon Offers</h2>
        <CreateOfferDialog onSuccess={invalidate} />
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

        {search.active !== undefined && (
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
              <TableHead>Name</TableHead>
              <TableHead>Pts Cost</TableHead>
              <TableHead>Amount Off</TableHead>
              <TableHead>Purchases</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <OffersTableBody isLoading={isLoading} offers={data?.content ?? []} pageSize={search.size} />
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
