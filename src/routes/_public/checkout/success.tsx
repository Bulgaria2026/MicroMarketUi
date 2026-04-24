import { CheckoutSuccess } from "@/features/cart/pages/CheckoutSuccess";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  session_id: z.string(),
});

export const Route = createFileRoute("/_public/checkout/success")({
  validateSearch: searchSchema,
  component: function CheckoutSuccessPage() {
    const { session_id } = Route.useSearch();
    return <CheckoutSuccess sessionId={session_id} />;
  },
});
