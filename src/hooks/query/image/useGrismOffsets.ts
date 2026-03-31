import { useConnectionStore } from "@/stores/connection";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import type { GrismOffset } from "./schemas";

export function useGrismOffsets({
	groupId = null,
	basenameList = [],
	enabled = false,
}: {
	groupId?: string | null;
	basenameList?: string[];
	enabled?: boolean;
}) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const targetBasenameList = basenameList;

	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_offset", basename, groupId],
			enabled: enabled && !!groupId,
			queryFn: async () => {
				const response = await axios.get(
					`${backendUrl}/wfss/grism_offset/${groupId}`,
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
