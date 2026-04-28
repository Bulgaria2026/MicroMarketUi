import { AppHeader, AppHeaderRow } from "@/components/header/AppHeader";
import { HeaderActions } from "@/components/header/HeaderActions";
import { Logo } from "@/components/Logo";
import { Outlet } from "@tanstack/react-router";

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader>
        <AppHeaderRow>
          <Logo />
          <div className="ml-auto">
            <HeaderActions />
          </div>
        </AppHeaderRow>
      </AppHeader>
      <div className="flex flex-col flex-1">
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] flex flex-col flex-1 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
