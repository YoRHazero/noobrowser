import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCacheSpectrumParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCacheSpectrum = ({
	jobId,
	enabled = true,
}: UsePlotCacheSpectrumParams) => {
	const path = `/plot/cache/${jobId}/spectrum`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "cache", "spectrum", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
