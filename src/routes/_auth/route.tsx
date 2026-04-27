import { AuthLayout } from "@/features/auth/layout/AuthLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});
