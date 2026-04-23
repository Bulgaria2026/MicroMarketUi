import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAuth } from "@/features/auth/context/use-auth";
import { routeTree } from "@/routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  defaultErrorComponent: ErrorDisplay,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const auth = useAuth();
  if (auth.isLoading) return <div>Loading...</div>;
  return <RouterProvider router={router} context={{ auth }} />;
}
