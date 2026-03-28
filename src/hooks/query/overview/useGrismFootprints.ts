import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { GrismFootprintItem } from "./schemas";

export interface UseGrismFootprintsParams {
	enabled?: boolean;
}

export function useGrismFootprints({
	enabled = true,
}: UseGrismFootprintsParams = {}) {
	return useQueryAxiosGet<GrismFootprintItem[]>({
		queryKey: ["overview", "grism_footprints"],
		path: "/overview/grism_footprints",
		enabled,
	});
}
