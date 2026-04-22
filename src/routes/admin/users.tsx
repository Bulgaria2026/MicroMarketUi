import { AdminUsers } from "@/features/admin/pages/Users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});
