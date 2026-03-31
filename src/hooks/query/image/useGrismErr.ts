import { useConnectionStore } from "@/stores/connection";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import type { GrismErr } from "./schemas";

export function useGrismErr({
	basenameList = [],
	enabled = false,
}: {
	basenameList?: string[];
	enabled?: boolean;
}) {
	const targetBasenameList = basenameList;
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_err", basename],
			enabled: enabled && targetBasenameList.length > 0,
			queryFn: async () => {
				const response = await axios.get(`${backendUrl}/wfss/grism_err/`, {
					params: { basename },
					responseType: "arraybuffer",
				});
				const buffer = response.data as ArrayBuffer;
				const headers = response.headers;
				const height = Number(headers["x-data-height"]);
				const width = Number(headers["x-data-width"]);
				return { buffer, width, height } as GrismErr;
			},
		})),
		combine: (results) => {
			return results.reduce(
				(acc, result, index) => {
					const basename = targetBasenameList[index];
					acc[basename] = result;
					return acc;
				},
				{} as Record<string, UseQueryResult<GrismErr>>,
			);
		},
	});
	return results;
}
