import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { ClearImageFiltersResponse } from "./schemas";

export interface UseClearImageFiltersParams {
	enabled?: boolean;
}

export function useClearImageFilters({
	enabled = true,
}: UseClearImageFiltersParams = {}) {
	return useQueryAxiosGet<ClearImageFiltersResponse>({
		queryKey: ["overview", "clear_image_filters"],
		path: "/overview/clear_image_filters",
		enabled,
	});
}
