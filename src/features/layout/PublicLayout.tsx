import { useAuth } from "@/features/auth/context/use-auth";
import { Link, Outlet } from "@tanstack/react-router";

export function PublicLayout() {
  const { logout, isAuthenticated, isAdmin, user } = useAuth();

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        {isAuthenticated ? (
          <>
            {user && <span>Welcome, {user.email}!</span>}
            {isAdmin && (
              <Link to="/admin" className="[&.active]:font-bold">
                Admin Panel
              </Link>
            )}
            <button onClick={logout} className="cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="[&.active]:font-bold">
              Sign in
            </Link>
            <Link to="/signup" className="[&.active]:font-bold">
              Sign up
            </Link>
          </>
        )}
      </div>
      <hr />
      <Outlet />
    </>
  );
}
