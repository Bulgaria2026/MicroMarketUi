import { AppHeader, AppHeaderRow } from "@/components/header/AppHeader";
import { Logo } from "@/components/Logo";
import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader>
        <AppHeaderRow>
          <Logo />
        </AppHeaderRow>
      </AppHeader>
      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
    </div>
  );
}
