import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn } from "@/features/auth/pages/SignIn";

export const Route = createFileRoute("/signin")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: SignIn,
});
