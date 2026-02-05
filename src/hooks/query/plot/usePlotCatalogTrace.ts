import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCatalogTraceParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCatalogTrace = ({
	jobId,
	enabled = true,
}: UsePlotCatalogTraceParams) => {
	const path = `/plot/catalog/${jobId}/trace`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "catalog", "trace", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
