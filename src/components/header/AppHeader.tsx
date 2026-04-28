export function AppHeader({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <header className="sticky top-0 z-30 border-b border-border backdrop-blur-md">
      {children}
    </header>
  );
}

export function AppHeaderRow({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto w-full max-w-[calc(100vh*16/9)] relative flex items-center px-4 py-3">
      {children}
    </div>
  );
}
