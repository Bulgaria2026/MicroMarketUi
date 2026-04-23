import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/features/cart/context/use-cart";
import { CheckoutAuthDialog } from "@/features/cart/components/CheckoutAuthDialog";
import { checkoutService } from "@/features/cart/services/checkout-service";
import type { Product } from "@/features/products/types/product";
import { productKeys, productService } from "@/features/products/services/product-service";
import { useAuth } from "@/features/auth/context/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { ChevronDown, ShoppingCart, Trash2, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";
import { toast } from "sonner";

function effectivePrice(product: Product): number {
  return product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
}

export function CartPopover() {
  const [open, setOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { items, itemCount, removeItem, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const productQueries = useQueries({
    queries: items.map(item => ({
      queryKey: productKeys.detail(item.productId),
      queryFn: () => productService.findById(item.productId),
      enabled: open,
    })),
  });

  const products = productQueries.map(q => q.data);
  const total = items.reduce((sum, item, i) => {
    const product = products[i];
    return sum + (product ? effectivePrice(product) * item.quantity : 0);
  }, 0);

  async function performCheckout(email?: string) {
    setIsCheckingOut(true);
    try {
      const orderItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      const response = await checkoutService.placeOrder(orderItems, email);
      setShowAuthDialog(false);
      navigate({ href: response.checkoutUrl });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  function handleCheckout() {
    if (isAuthenticated) {
      performCheckout();
    } else {
      setShowAuthDialog(true);
    }
  }

  return (
    <>
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold leading-none">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-border bg-background shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <span className="font-semibold text-sm">Cart Summary</span>
            <Popover.Close asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </Button>
            </Popover.Close>
          </div>

          <Separator />

          {items.length === 0 ? (
            <div className="px-4 py-8 text-sm text-muted-foreground text-center">Your cart is empty.</div>
          ) : (
            <>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {items.map((item, i) => {
                  const product = products[i];
                  const price = product ? effectivePrice(product) : 0;
                  return (
                    <div key={item.productId} className="flex gap-3 px-4 py-3">
                      <div className="shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/60 text-lg font-semibold">
                        {product?.name.charAt(0).toUpperCase() ?? "…"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight line-clamp-1">
                            {product?.name ?? <span className="text-muted-foreground">Loading…</span>}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product?.description}</p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="relative">
                            <select
                              value={item.quantity}
                              onChange={e => updateQuantity(item.productId, Number(e.target.value))}
                              className="appearance-none text-xs border border-border rounded-md pl-2 pr-6 py-1 bg-background cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                              {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
                          </div>

                          <span className="text-sm font-medium">{(price * item.quantity).toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-sm">Total</span>
                <span className="font-semibold text-sm">{total.toFixed(2)}€</span>
              </div>

              <div className="px-4 pb-4">
                <Button className="w-full hover:opacity-80" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : "Go to checkout"}
                </Button>
              </div>
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

    <CheckoutAuthDialog
      open={showAuthDialog}
      onClose={() => setShowAuthDialog(false)}
      onGuestCheckout={email => performCheckout(email)}
      isProcessing={isCheckingOut}
    />
    </>
  );
}
