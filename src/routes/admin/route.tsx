import { AdminLayout } from "@/features/admin/layouts/AdminLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated || !context.auth.isAdmin) {
      throw redirect({ to: "/signin" });
    }
  },
  component: AdminLayout,
});
