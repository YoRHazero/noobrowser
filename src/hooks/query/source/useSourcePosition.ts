import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import { useGlobeStore } from "@/stores/footprints";
import type { SourcePosition } from "./schemas";

export function useSourcePosition({
	selectedFootprintId,
	x,
	y,
	ra,
	dec,
	ref_basename,
	enabled = false,
}: {
	selectedFootprintId?: string;
	x?: number;
	y?: number;
	ra?: number;
	dec?: number;
	ref_basename?: string;
	enabled?: boolean;
}) {

	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryKey = [
		"source-position",
		x?.toFixed(1),
		y?.toFixed(1),
		ra,
		dec,
		ref_basename,
		group_id,
	];
	const hasAvailableXY = x !== undefined && y !== undefined;
	const hasAvailableRaDec = ra !== undefined && dec !== undefined;
	const isValidInput = hasAvailableXY || hasAvailableRaDec;
	const query = useQueryAxiosGet<SourcePosition>({
		queryKey,
		enabled: enabled && group_id !== null && isValidInput,
		path: "/source/source_position/",
		axiosGetParams: {
			params: {
				group_id: group_id,
				x: x,
				y: y,
				ra: ra,
				dec: dec,
				ref_basename: ref_basename,
			},
		},
		checkParamsNull: false,
	});
	return query;
}
