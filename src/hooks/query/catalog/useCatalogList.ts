import { useConnectionStore } from "@/stores/connection";
import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { PaginatedCatalogListResponse } from "./schemas";

interface UseCatalogListParams {
  page?: number;
  pageSize?: number;
  sortDesc?: boolean;
  user?: string;
  enabled?: boolean;
}

export function useCatalogList({
  page = 1,
  pageSize = 20,
  sortDesc = true,
  user,
  enabled = true,
}: UseCatalogListParams = {}) {
  const username = useConnectionStore((state) => state.username);
  const userToUse = user !== undefined ? user : username;
  
  const queryKey = ["catalog", "list", { page, pageSize, sortDesc, user: userToUse }];

  return useQueryAxiosGet<PaginatedCatalogListResponse>({
    queryKey,
    path: "/catalog/",
    axiosGetParams: {
      params: {
        page,
        page_size: pageSize,
        sort_desc: sortDesc,
        ...(userToUse ? { user: userToUse } : {}),
      },
    },
    enabled,
  });
}
