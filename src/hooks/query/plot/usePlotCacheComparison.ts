import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCacheComparisonParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCacheComparison = ({
	jobId,
	enabled = true,
}: UsePlotCacheComparisonParams) => {
	const path = `/plot/cache/${jobId}/comparison`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "cache", "comparison", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
