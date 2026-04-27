import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAuth } from "@/features/auth/context/use-auth";
import { NotFound } from "@/layouts/NotFound";
import { RootLayout } from "@/layouts/RootLayout";
import { createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: ErrorDisplay,
});
