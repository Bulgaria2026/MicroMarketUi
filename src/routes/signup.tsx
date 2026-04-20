import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUp } from "@/features/auth/pages/SignUp";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: SignUp,
});
