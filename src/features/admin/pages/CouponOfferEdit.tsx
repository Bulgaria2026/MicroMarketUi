import { ErrorDisplay } from "@/components/ErrorDisplay";
import { blurFirst, useAppForm } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildOfferFormValues, offerValuesToRequest } from "@/features/admin/lib/offer-utils";
import { adminCouponOfferKeys, adminCouponOfferService } from "@/features/admin/services/coupon-offer-service";
import type { AdminCouponOfferResponse } from "@/features/admin/types/coupon-offer";
import { getApiErrorMessage } from "@/lib/api";
import { Route } from "@/routes/admin/coupon-offers/$offerId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const nameValidator = blurFirst(z.string().min(1, "Name is required"));
const positiveNumberValidator = blurFirst(
  z.string().refine(v => !Number.isNaN(Number.parseFloat(v)) && Number.parseFloat(v) > 0, "Must be a positive number"),
);
const nonNegativeIntValidator = blurFirst(
  z.string().refine(v => !Number.isNaN(Number.parseInt(v)) && Number.parseInt(v) >= 0, "Must be 0 or more"),
);

export function AdminCouponOfferEdit() {
  const { offerId } = Route.useParams();
  const router = useRouter();

  const {
    data: offer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: adminCouponOfferKeys.detail(offerId),
    queryFn: () => adminCouponOfferService.findById(offerId),
  });

  if (isError) return <ErrorDisplay />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.history.back()}>
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Edit Coupon Offer</h2>
      </div>

      <div className="rounded-md border bg-card text-card-foreground p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-muted rounded w-full" />
            <div className="h-20 bg-muted rounded w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded w-full" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          </div>
        ) : (
          <CouponOfferEditForm key={offer!.id} offer={offer!} />
        )}
      </div>
    </div>
  );
}

function CouponOfferEditForm({ offer }: Readonly<{ offer: AdminCouponOfferResponse }>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const updateMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: adminCouponOfferService.update.bind(null, offer.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCouponOfferKeys.all });
      router.history.back();
    },
    onError: err => setApiError(getApiErrorMessage(err, "Failed to update offer")),
  });

  const form = useAppForm({
    defaultValues: buildOfferFormValues(offer),
    onSubmit: ({ value }) => {
      setApiError(null);
      updateMutation.mutate(offerValuesToRequest(value));
    },
  });

  return (
    <form
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
      {apiError && <p className="text-sm text-destructive mt-4">{apiError}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.history.back()}>
          Cancel
        </Button>
        <form.Subscribe selector={state => state.isSubmitting}>
          {isSubmitting => (
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {updateMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
