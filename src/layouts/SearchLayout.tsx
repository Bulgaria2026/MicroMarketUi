import { AppHeader, AppHeaderRow } from "@/components/header/AppHeader";
import { HeaderActions } from "@/components/header/HeaderActions";
import { HeaderSearch } from "@/components/header/HeaderSearch";
import { Logo } from "@/components/Logo";
import { Outlet, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export function SearchLayout() {
  const navigate = useNavigate();
  const { name } = useSearch({ from: "/_search/" });
  const [searchValue, setSearchValue] = useState(name ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({ to: "/", search: { name: searchValue } });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader>
        <AppHeaderRow>
          <Logo />
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-lg px-4 pointer-events-none hidden md:block">
            <div className="pointer-events-auto">
              <HeaderSearch value={searchValue} onChange={setSearchValue} />
            </div>
          </div>
          <div className="ml-auto">
            <HeaderActions />
          </div>
        </AppHeaderRow>
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] px-4 pb-3 md:hidden">
          <HeaderSearch value={searchValue} onChange={setSearchValue} />
        </div>
      </AppHeader>
      <div className="flex flex-col flex-1">
        <div className="mx-auto w-full max-w-[calc(100vh*16/9)] flex flex-col flex-1 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
