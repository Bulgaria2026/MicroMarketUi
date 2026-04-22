import { Home } from "@/features/home/pages/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: Home,
});
