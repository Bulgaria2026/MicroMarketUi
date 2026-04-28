import { SearchLayout } from "@/layouts/SearchLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_search")({
  component: SearchLayout,
});
