import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCachePosteriorParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCachePosterior = ({
	jobId,
	enabled = true,
}: UsePlotCachePosteriorParams) => {
	const path = `/plot/cache/${jobId}/posterior`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "cache", "posterior", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
