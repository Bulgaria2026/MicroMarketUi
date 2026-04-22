import { NotFound } from "@/features/layout/NotFound";
import { RootLayout } from "@/features/layout/RootLayout";
import { useAuth } from "@/features/auth/context/use-auth";
import { createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
});
