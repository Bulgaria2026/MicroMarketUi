import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/checkout/cancel")({
  beforeLoad: () => {
    toast.error("Checkout was cancelled.");
    throw redirect({ to: "/" });
  },
});
