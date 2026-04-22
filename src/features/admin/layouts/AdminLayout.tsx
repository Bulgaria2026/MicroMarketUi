import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true as const },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false as const },
  { to: "/admin/products", label: "Products", icon: Package, exact: false as const },
  { to: "/admin/users", label: "Users", icon: Users, exact: false as const },
] as const;

function AdminSidebar() {
  return (
    <aside className="w-56 min-h-screen bg-muted/40 flex flex-col border-r border-border">
      <div className="px-4 pt-5 pb-4">
        <p className="text-xl font-bold leading-tight">MicroMarket</p>
        <p className="text-xs text-muted-foreground">powered by Noser Bulgaria</p>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={exact ? { exact: true } : undefined}
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
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
