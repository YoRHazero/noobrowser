import { createFileRoute } from "@tanstack/react-router";
import CatalogNewFeature from "@/features/catalog-new";

export const Route = createFileRoute("/catalog")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CatalogNewFeature />;
}
