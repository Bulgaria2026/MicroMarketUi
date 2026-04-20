import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { refreshAuth, setAccessToken } from "../../../lib/api";
import { authService } from "../services/auth";

interface User {
  id: string;
  email: string;
  roles: UserRole[];
}

const UserRole = {
  ADMINISTRATOR: "ADMINISTRATOR",
  USER: "USER",
} as const;
type UserRole = (typeof UserRole)[keyof typeof UserRole];

interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserFromToken(token: string): User | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.sub
      ? {
          id: payload.sub,
          email: payload.email ?? "",
          roles: payload.roles ?? [],
        }
      : null;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((token: string) => {
    setAccessToken(token);
    setUser(getUserFromToken(token));
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await refreshAuth();
        if (mounted) {
          login(data.accessToken);
        }
      } catch {
        if (mounted) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const isAdmin = user?.roles?.includes(UserRole.ADMINISTRATOR) ?? false;

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading,
      login,
      logout,
    }),
    [user, isAdmin, isLoading, login, logout],
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
