import { Logo } from "@/components/Logo";
import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 py-3 border-b border-border backdrop-blur-md">
        <Logo />
      </header>
      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
    </div>
  );
}
