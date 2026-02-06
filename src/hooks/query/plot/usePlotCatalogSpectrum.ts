import { useQueryAxiosGet } from "../useQueryAxiosGet";

type UsePlotCatalogSpectrumParams = {
	jobId: string;
	enabled?: boolean;
	model_name?: string | null;
	subtract_model_list?: string[] | null;
};

export const usePlotCatalogSpectrum = ({
	jobId,
	enabled = true,
	model_name,
	subtract_model_list,
}: UsePlotCatalogSpectrumParams) => {
	const queryParams: Record<string, string | string[]> = {};
	if (model_name) {
		queryParams.model_name = model_name;
	}
	if (subtract_model_list !== null && subtract_model_list !== undefined) {
		queryParams.subtract_model_list = subtract_model_list;
	}
	const path = `/plot/catalog/${jobId}/spectrum`;
	return useQueryAxiosGet<Blob>({
		queryKey: [
			"plot",
			"catalog",
			"spectrum",
			jobId,
			model_name ?? null,
			subtract_model_list === null || subtract_model_list === undefined
				? null
				: subtract_model_list.join(","),
		],
		path,
		enabled: enabled && !!jobId,
		axiosGetParams: {
			params: queryParams,
			paramsSerializer: {
				indexes: null,
			},
			responseType: "blob",
		},
	});
};
