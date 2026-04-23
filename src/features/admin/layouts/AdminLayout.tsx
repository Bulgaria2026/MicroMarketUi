import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, LayoutDashboard, Menu, Package, ShoppingBag, Users, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true as const },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false as const },
  { to: "/admin/products", label: "Products", icon: Package, exact: false as const },
  { to: "/admin/users", label: "Users", icon: Users, exact: false as const },
] as const;

function SidebarContent({ onNavigate }: Readonly<{ onNavigate?: () => void }>) {
  return (
    <>
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={exact ? { exact: true } : undefined}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground"
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-2 pb-4 border-t border-border pt-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Back to site
        </Link>
      </div>
    </>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-muted/40 overflow-y-auto">
        <div className="px-4 pt-3 pb-2">
          <Logo />
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 flex flex-col border-r border-border bg-background transition-transform duration-200 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X />
          </Button>
        </div>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="flex shrink-0 items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </Button>
          <Logo />
        </header>

        <main className="flex-1 p-6 lg:p-8 bg-background overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
