import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/use-auth";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Search, ShoppingCart, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";

export function PublicLayout() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border backdrop-blur-md">
        {/* Main row */}
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] relative flex items-center px-4 py-3">
          <Logo />

          {/* Centered search — md+ only */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-lg px-4 pointer-events-none hidden md:block">
            <div className="relative pointer-events-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated ? (
              <Popover.Root open={profileOpen} onOpenChange={setProfileOpen}>
                <Popover.Trigger asChild>
                  <button
                    className={cn(
                      "size-8 rounded-lg bg-foreground text-background text-xs font-bold flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80",
                      profileOpen && "opacity-80",
                    )}
                  >
                    {initials}
                  </button>
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
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="size-4" />
                        </button>
                      </Popover.Close>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 truncate">{user?.email}</p>
                    {isAdmin && (
                      <Button asChild variant="outline" size="sm" className="w-full mb-2">
                        <Link to="/admin">
                          <LayoutDashboard />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="default" size="sm" className="w-full" onClick={logout}>
                      <LogOut />
                      Sign out
                    </Button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            ) : (
              <Button asChild size="sm">
                <Link to="/signin">Sign In</Link>
              </Button>
            )}

            <Popover.Root open={cartOpen} onOpenChange={setCartOpen}>
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
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="size-4" />
                      </button>
                    </Popover.Close>
                  </div>
                  <div className="px-4 pb-4 text-sm text-muted-foreground">Your cart is empty.</div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>

        {/* Search row — mobile only */}
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1">
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] flex flex-col flex-1 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
