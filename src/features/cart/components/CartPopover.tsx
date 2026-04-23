import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";

export function CartPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingCart />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-border bg-background shadow-lg outline-none"
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <span className="font-semibold text-sm">Cart Summary</span>
            <Popover.Close asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </Button>
            </Popover.Close>
          </div>
          <div className="px-4 pb-4 text-sm text-muted-foreground">Your cart is empty.</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
