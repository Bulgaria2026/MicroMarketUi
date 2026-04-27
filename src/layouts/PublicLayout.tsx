import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfilePopover } from "@/features/auth/components/ProfilePopover";
import { useAuth } from "@/features/auth/context/use-auth";
import { CartPopover } from "@/features/cart/components/CartPopover";
import { Link, Outlet, useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const routeSearch = useSearch({ strict: false }) as { name?: string };
  const [searchValue, setSearchValue] = useState(routeSearch.name ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({
        to: "/",
        search: { name: searchValue || undefined } as { name?: string },
      });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, navigate]);

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
              <Input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="What are you looking for?"
                className="rounded-full pl-9"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated ? (
              <ProfilePopover />
            ) : (
              <Button asChild size="sm">
                <Link to="/signin">Sign In</Link>
              </Button>
            )}

            <CartPopover />
          </div>
        </div>

        {/* Search row — mobile only */}
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
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
