import { authService } from "@/features/auth/services/auth";
import { refreshAuth, setAccessToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((token: string) => {
    setAccessToken(token);
    setUser(getUserFromToken(token));
  }, []);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["authRefresh"],
    queryFn: () => refreshAuth(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      login(data.accessToken);
    } else if (isError) {
      setAccessToken(null);
    }
  }, [data, isError, login]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // server-side cleanup failure
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.roles?.includes(UserRole.ADMINISTRATOR) ?? false,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
