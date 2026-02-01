import { useConnectionStore } from "@/stores/connection";
import { useGlobeStore } from "@/stores/footprints";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import type { GrismOffset } from "./schemas";

export function useGrismOffsets({
	selectedFootprintId = null,
	basenameList = [],
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	basenameList?: string[];
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const footprints = useGlobeStore((state) => state.footprints);
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	let targetBasenameList: string[];
	if (!basenameList || basenameList.length === 0) {
		if (group_id) {
			const footprint = footprints.find((f) => f.id === group_id);
			targetBasenameList = footprint?.meta?.included_files ?? [];
		} else {
			targetBasenameList = [];
		}
	} else {
		targetBasenameList = basenameList;
	}

	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_offset", basename, group_id],
			enabled: enabled && !!group_id,
			queryFn: async () => {
				const response = await axios.get(
					`${backendUrl}/wfss/grism_offset/${group_id}`,
					{
						params: { basename },
					},
				);
				return response.data as GrismOffset;
			},
		})),
		combine: (results) => {
			return results.reduce(
				(acc, result, index) => {
					const basename = targetBasenameList[index];
					acc[basename] = result;
					return acc;
				},
				{} as Record<string, UseQueryResult<GrismOffset>>,
			);
		},
	});
	return results;
}
