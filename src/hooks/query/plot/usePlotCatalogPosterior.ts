import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCatalogPosteriorParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCatalogPosterior = ({
	jobId,
	enabled = true,
}: UsePlotCatalogPosteriorParams) => {
	const path = `/plot/catalog/${jobId}/posterior`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "catalog", "posterior", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
