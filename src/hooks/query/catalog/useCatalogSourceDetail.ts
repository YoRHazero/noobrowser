import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { CatalogSourceDetailResponse } from "./schemas";

export function useCatalogSourceDetail(sourceId: string, enabled = true) {
  return useQueryAxiosGet<CatalogSourceDetailResponse>({
    queryKey: ["catalog", "source", sourceId],
    path: `/catalog/${sourceId}/`,
    enabled: enabled && !!sourceId,
  });
}
