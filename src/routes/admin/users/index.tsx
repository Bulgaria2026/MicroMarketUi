import { AdminUsers } from "@/features/admin/pages/Users";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  email: z.string().optional(),
  type: z.enum(["GUEST", "PROFILE"]).optional(),
  role: z.enum(["USER", "ADMINISTRATOR"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
});

export const Route = createFileRoute("/admin/users/")({
  validateSearch: searchSchema,
  component: AdminUsers,
});
