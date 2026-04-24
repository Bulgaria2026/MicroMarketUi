import { blurFirst, useAppForm } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { emailField } from "@/features/auth/schemas";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  open: boolean;
  onClose: () => void;
  onGuestCheckout: (email: string) => void;
  isProcessing: boolean;
}

export function CheckoutAuthDialog({ open, onClose, onGuestCheckout, isProcessing }: Readonly<Props>) {
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      onGuestCheckout(value.email.trim());
    },
  });

  function handleSignIn() {
    onClose();
    navigate({ to: "/signin" });
  }

  return (
    <Dialog open={open} onOpenChange={val => { if (!val) onClose(); }}>
      <DialogContent className="max-w-sm p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>Complete your order</DialogTitle>
          <DialogDescription>Sign in to your account or continue as a guest.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-2">
          <Button className="w-full" onClick={handleSignIn} disabled={isProcessing}>
            Sign in
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <form
            noValidate
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <form.AppField name="email" validators={blurFirst(emailField)}>
                {({ TextField }) => <TextField label="Continue as guest" placeholder="your@email.com" />}
              </form.AppField>
            </FieldGroup>

            <form.Subscribe selector={state => state.isSubmitting}>
              {isSubmitting => (
                <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting || isProcessing}>
                  {isProcessing ? "Processing..." : "Continue as guest"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
