import { useAppForm } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  buildProductFormValues,
  productAmountValidator,
  productDescriptionValidator,
  productDiscountValidator,
  productNameValidator,
  productPriceValidator,
  productValuesToRequest,
} from "@/features/admin/lib/product-utils";
import { productService } from "@/features/products/services/product-service";
import { getApiErrorMessage } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateProductDialog({ open, onOpenChange, onCreated }: Readonly<CreateProductDialogProps>) {
  const [apiError, setApiError] = useState<string | null>(null);

  const createMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: productService.create,
    onSuccess: () => {
      onOpenChange(false);
      onCreated?.();
    },
    onError: err => setApiError(getApiErrorMessage(err, "Failed to create product")),
  });

  const form = useAppForm({
    defaultValues: buildProductFormValues(),
    onSubmit: ({ value }) => {
      setApiError(null);
      createMutation.mutate(productValuesToRequest(value));
    },
  });

  function handleOpenChange(o: boolean) {
    onOpenChange(o);
    if (!o) {
      form.reset();
      setApiError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Product</DialogTitle>
        </DialogHeader>

        <form
          id="create-product-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4 mt-2">
            <form.AppField name="name" validators={productNameValidator}>
              {({ TextField }) => <TextField label="Name *" placeholder="e.g. Sparkling Water" />}
            </form.AppField>

            <form.AppField name="description" validators={productDescriptionValidator}>
              {({ TextareaField }) => (
                <TextareaField
                  label="Description *"
                  placeholder="Write something about the product…"
                  rows={3}
                />
              )}
            </form.AppField>

            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="priceInput" validators={productPriceValidator}>
                {({ TextField }) => <TextField label="Price (€) *" type="number" placeholder="9.99" />}
              </form.AppField>

              <form.AppField name="discountInput" validators={productDiscountValidator}>
                {({ TextField }) => <TextField label="Discount (%) *" type="number" placeholder="0" />}
              </form.AppField>
            </div>

            <form.AppField name="amountInput" validators={productAmountValidator}>
              {({ TextField }) => <TextField label="Stock *" type="number" placeholder="0" />}
            </form.AppField>

            <form.AppField name="enabled">
              {({ state, handleChange }) => (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">Enabled</p>
                    <p className="text-xs text-muted-foreground">Product is visible in the shop</p>
                  </div>
                  <Switch checked={state.value} onCheckedChange={handleChange} />
                </div>
              )}
            </form.AppField>
          </div>

          {apiError && <p className="text-sm text-destructive mt-3">{apiError}</p>}
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <form.Subscribe selector={state => state.isSubmitting}>
            {isSubmitting => (
              <Button type="submit" form="create-product-form" disabled={isSubmitting || createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create Product"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
