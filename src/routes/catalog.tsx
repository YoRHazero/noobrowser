import { createFileRoute } from "@tanstack/react-router";
import CatalogFeature from "@/features/catalog";

export const Route = createFileRoute("/catalog")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CatalogFeature />;
}
