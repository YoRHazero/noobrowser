import { useGlobeStore } from "@/stores/footprints";
import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { DispersionTrace } from "./schemas";

export function useDispersionTrace({
	selectedFootprintId,
	basename,
	x,
	y,
	waveMin,
	waveMax,
	enabled = false,
}: {
	selectedFootprintId?: string | undefined;
	basename?: string | undefined;
	x?: number | undefined;
	y?: number | undefined;
	waveMin?: number | undefined;
	waveMax?: number | undefined;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryParams: Record<string, string | number> = {
		...(group_id !== null ? { group_id } : {}),
		...(basename !== undefined ? { basename } : {}),
		...(x !== undefined ? { x } : {}),
		...(y !== undefined ? { y } : {}),
		...(waveMin !== undefined ? { wavemin: waveMin } : {}),
		...(waveMax !== undefined ? { wavemax: waveMax } : {}),
	};

	const query = useQueryAxiosGet<DispersionTrace>({
		queryKey: ["dispersion_trace", group_id, basename, x, y, waveMin, waveMax],
		path: "/source/dispersion_trace/",
		enabled: enabled && (!!group_id || !!basename),
		axiosGetParams: {
			params: queryParams,
		},
		queryOptions: {
			gcTime: 1000 * 10, // garbage collect after 10 seconds of inactivity
		},
	});
	return query;
}
