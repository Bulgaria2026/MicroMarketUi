import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex flex-col hover:opacity-80 transition-opacity">
      <span className="text-xl font-bold leading-tight">MicroMarket</span>
      <span className="text-xs text-muted-foreground">powered by Noser Bulgaria</span>
    </Link>
  );
}
