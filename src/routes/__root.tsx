import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { useAuth } from "@/features/auth/context/use-auth";

interface MyRouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const RootLayout = () => {
  const auth = useAuth();
  const { logout, isAuthenticated, user } = auth;

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        {!isAuthenticated ? (
          <>
            <Link to="/signin" className="[&.active]:font-bold">
              Sign in
            </Link>
            <Link to="/signup" className="[&.active]:font-bold">
              Sign up
            </Link>
          </>
        ) : (
          <>
            {user && <span>Welcome, {user.email}!</span>}
            <button onClick={logout} className="cursor-pointer">
              Logout
            </button>
          </>
        )}
      </div>
      <hr />
      <Outlet />
      <Toaster position="top-right" richColors />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: () => <div>404 Not Found</div>,
});
