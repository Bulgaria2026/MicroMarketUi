import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onGuestCheckout: (email: string) => void;
  isProcessing: boolean;
}

export function CheckoutAuthDialog({ open, onClose, onGuestCheckout, isProcessing }: Props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    onGuestCheckout(email.trim());
  }

  function handleSignIn() {
    onClose();
    navigate({ to: "/signin" });
  }

  return (
    <Dialog open={open} onOpenChange={val => { if (!val) onClose(); }}>
      <DialogContent className="max-w-sm p-8">
        <DialogHeader className="mb-2">
          <DialogTitle>Complete your order</DialogTitle>
          <DialogDescription>
            Sign in to your account or continue as a guest.
          </DialogDescription>
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

          <form onSubmit={handleGuestSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="guest-email" className="text-sm font-medium">
                Continue as guest
              </label>
              <Input
                id="guest-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                disabled={isProcessing}
                aria-invalid={!!emailError}
              />
              {emailError && <p className="text-xs text-destructive">{emailError}</p>}
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Continue as guest"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
