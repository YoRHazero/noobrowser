import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCatalogComparisonParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCatalogComparison = ({
	jobId,
	enabled = true,
}: UsePlotCatalogComparisonParams) => {
	const path = `/plot/catalog/${jobId}/comparison`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "catalog", "comparison", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
