import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Something went wrong :(</h2>
        <p className="text-sm text-muted-foreground">The page you were searching, doesnt seem to exist!</p>
        <Button>
          <Link to="/">Return to homepage</Link>
        </Button>
      </div>
    </div>
  );
}
