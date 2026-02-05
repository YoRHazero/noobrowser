import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { FitJobSummaryResponse } from "./schemas";

type UseFitJobSummaryParams = {
	jobId: string;
	enabled?: boolean;
};

export const useFitJobSummary = ({
	jobId,
	enabled = true,
}: UseFitJobSummaryParams) => {
	const returnType = "data";
	const path = `/fit/summary/${jobId}/`;

	return useQueryAxiosGet<FitJobSummaryResponse>({
		queryKey: ["fit", "summary", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {},
		returnType,
	});
};
