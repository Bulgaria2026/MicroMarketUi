import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { OctagonAlert } from "lucide-react";

export function ErrorDisplay() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <OctagonAlert />
        <h2 className="text-xl font-semibold">Something went wrong :(</h2>
        <p className="text-sm text-muted-foreground">When loading the page, there was an error.</p>
        <Button
          onClick={() =>
            navigate({
              replace: true,
            })
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
