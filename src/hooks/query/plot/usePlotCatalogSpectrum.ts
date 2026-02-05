import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCatalogSpectrumParams = {
	jobId: string;
	enabled?: boolean;
};

export const usePlotCatalogSpectrum = ({
	jobId,
	enabled = true,
}: UsePlotCatalogSpectrumParams) => {
	const path = `/plot/catalog/${jobId}/spectrum`;
	return useQueryAxiosGet<Blob>({
		queryKey: ["plot", "catalog", "spectrum", jobId],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			responseType: "blob",
		},
	});
};
