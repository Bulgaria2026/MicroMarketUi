import { Button } from "@/components/ui/button";
import { ProfilePopover } from "@/features/auth/components/ProfilePopover";
import { useAuth } from "@/features/auth/context/use-auth";
import { CartPopover } from "@/features/cart/components/CartPopover";
import { Link } from "@tanstack/react-router";

export function HeaderActions() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <ProfilePopover />
      ) : (
        <Button asChild size="sm">
          <Link to="/signin">Sign In</Link>
        </Button>
      )}
      <CartPopover />
    </div>
  );
}
