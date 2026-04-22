import { AdminOrderDetail } from "@/features/admin/pages/OrderDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/$orderId")({
  component: AdminOrderDetail,
});
