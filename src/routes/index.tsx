import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/features/home/pages/Home";

export const Route = createFileRoute("/")({
  component: Home,
});
