import { useConnectionStore } from "@/stores/connection";
import { useGlobeStore } from "@/stores/footprints";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import type { GrismData } from "./schemas";

export function useGrismData({
	selectedFootprintId = null,
	basenameList = [],
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	basenameList?: string[];
	enabled?: boolean;
}) {
	const footprints = useGlobeStore((state) => state.footprints);
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;

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

	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_data", basename],
			enabled: enabled && targetBasenameList.length > 0,
			queryFn: async () => {
				const response = await axios.get(`${backendUrl}/wfss/grism_data/`, {
					params: { basename },
					responseType: "arraybuffer",
				});
				const buffer = response.data as ArrayBuffer;
				const headers = response.headers;
				const height = Number(headers["x-data-height"]);
				const width = Number(headers["x-data-width"]);
				return { buffer, width, height } as GrismData;
			},
		})),
		combine: (results) => {
			return results.reduce(
				(acc, result, index) => {
					const basename = targetBasenameList[index];
					acc[basename] = result;
					return acc;
				},
				{} as Record<string, UseQueryResult<GrismData>>,
			);
		},
	});
	return results;
}
