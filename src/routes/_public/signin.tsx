import { SignIn } from "@/features/auth/pages/SignIn";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/signin")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: SignIn,
});
