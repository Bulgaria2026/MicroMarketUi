import { RewardsPage } from "@/features/rewards/pages/RewardsPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/rewards")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/signin" });
    }
  },
  component: RewardsPage,
});
