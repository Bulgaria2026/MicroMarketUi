import { AdminUserDetail } from "@/features/admin/pages/UserDetail";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  type: z.enum(["GUEST", "PROFILE"]).optional(),
  email: z.string().optional(),
  createdAt: z.string().optional(),
});

export const Route = createFileRoute("/admin/users/$userId")({
  validateSearch: searchSchema,
  component: AdminUserDetail,
});
