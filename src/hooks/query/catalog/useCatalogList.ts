import {
  useQueryAxiosGet,
} from "../useQueryAxiosGet";
import type {
  PaginatedCatalogResponse,
  SaveFitResultQueryRequest,
} from "./schemas";

export function useCatalogList(params: SaveFitResultQueryRequest = {}) {
  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const { page = 1, page_size = 20, sort_desc = true, user } = params;

  const query = useQueryAxiosGet<PaginatedCatalogResponse>({
    queryKey: ["catalog", page, page_size, sort_desc, user],
    path: "/catalog/",
    axiosGetParams: {
      params: {
        page,
        page_size,
        sort_desc,
        user,
      },
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return query;
}
