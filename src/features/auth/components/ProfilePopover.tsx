import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/use-auth";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, ShoppingBag, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";

export function ProfilePopover() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          className={cn(
            "size-8 rounded-lg bg-foreground text-background text-xs font-bold flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80",
            open && "opacity-80",
          )}
        >
          {initials}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-xl border border-border bg-background p-4 shadow-lg outline-none"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Profile</span>
            <Popover.Close asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </Button>
            </Popover.Close>
          </div>
          <p className="text-xs text-muted-foreground mb-4 truncate">{user?.email}</p>
          <Button asChild variant="outline" size="sm" className="w-full mb-2">
            <Link to="/orders">
              <ShoppingBag />
              My Orders
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="w-full mb-2">
              <Link to="/admin">
                <LayoutDashboard />
                Admin Panel
              </Link>
            </Button>
          )}
          <Button size="sm" className="w-full cursor-pointer hover:opacity-80" onClick={logout}>
            <LogOut />
            Sign out
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
