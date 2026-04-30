import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/context/use-auth";
import { rewardsProfileKeys, rewardsProfileService } from "@/features/rewards/services/profile-service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Coins, LayoutDashboard, LogOut, ShoppingBag, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";

export function ProfilePopover() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: rewardsProfileKeys.own,
    queryFn: rewardsProfileService.getOwn,
    enabled: isAuthenticated,
  });

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
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </Button>
            </Popover.Close>
          </div>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>

          <Separator className="my-3" />

          <Button asChild variant="outline" size="sm" className="w-full mb-2">
            <Link to="/orders">
              <ShoppingBag />
              My Orders
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full mb-2">
            <Link to="/rewards" className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <Coins className="size-4" />
                My Rewards
              </span>
              {profileLoading ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                <span className="tabular-nums text-xs text-muted-foreground">
                  {(profile?.points ?? 0).toLocaleString()} pts
                </span>
              )}
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
