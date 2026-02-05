import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCacheTraceParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCacheTrace = ({
	jobId,
	enabled = true,
}: UsePlotCacheTraceParams) => {
	const path = `/plot/cache/${jobId}/trace`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "cache", "trace", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
