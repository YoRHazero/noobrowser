import { useGlobeStore } from "@/stores/footprints";
import type { RoiState } from "@/stores/stores-types";
import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { PercentileData } from "./schemas";

export function useFluxPercentiles({
	selectedFootprintId = null,
	q = [],
	roi = null,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	q?: number[];
	roi?: RoiState | null;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryParams: Record<string, number | number[]> = {};
	if (q.length > 0) {
		queryParams.percentage = q;
	}
	if (roi !== null) {
		queryParams.roi_x = roi.x;
		queryParams.roi_y = roi.y;
		queryParams.roi_width = roi.width;
		queryParams.roi_height = roi.height;
	}
	const query = useQueryAxiosGet<PercentileData>({
		queryKey: ["percentile_flux", group_id, { q, roi }],
		path: `/wfss/percentile_flux/${group_id}`,
		axiosGetParams: {
			params: queryParams,
			paramsSerializer: {
				indexes: null,
			},
		},
		enabled: enabled && group_id !== null,
		queryOptions: {
			gcTime: 1000, // garbage collect after 1 second of inactivity
		},
	});
	return query;
}
