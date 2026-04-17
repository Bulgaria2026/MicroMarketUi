import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { refreshAuth, setAccessToken } from "./api";
import { authService } from "../services/auth";

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((token: string) => {
    setAccessToken(token);
    setUser(getUserFromToken(token));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
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
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [login]);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const isAdmin = user?.roles?.some(role => role === "ADMINISTRATOR") ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
