import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { FitJobStatusResponse } from "./schemas";

type UseFitJobStatusParams = {
	jobId: string;
	enabled?: boolean;
};

export const useFitJobStatus = ({
	jobId,
	enabled = true,
}: UseFitJobStatusParams) => {
	const returnType = "data";
	const path = `/fit/status/${jobId}/`;

	return useQueryAxiosGet<FitJobStatusResponse>({
		queryKey: ["fit", "status", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {},
		returnType,
	});
};
