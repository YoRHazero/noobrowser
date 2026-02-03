import type { Query } from "@tanstack/query-core";
import {
	keepPreviousData,
	type QueryKey,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQueries,
	useQuery,
} from "@tanstack/react-query";
import axios, { type AxiosRequestConfig } from "axios";
import { toaster } from "@/components/ui/toaster";
import { useConnectionStore } from "@/stores/connection";
import { useFitStore } from "@/stores/fit";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import type { FitModel, JobStatus, RoiState } from "@/stores/stores-types";

type QueryAxiosParams<T = unknown> = {
	queryKey: QueryKey;
	path: string;
	enabled?: boolean;
	axiosGetParams?: AxiosRequestConfig;
	returnType?: "response" | "data";
	queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">;
	checkParamsNull?: boolean;
};

type ApiErrorDetail = {
	loc: Array<string | number>;
	msg: string;
};
/**
 * Hook to perform axios GET request with react-query
 * @param params QueryAxiosParams<T>
 * @param params.queryKey Query key for react-query
 * @param params.path API endpoint path
 * @param params.enabled Whether the query is enabled
 * @param params.axiosGetParams Parameters to pass to axios.get
 * @param params.returnType 'response' to return full response, 'data' to return response data (default: 'data')
 * @param params.queryOptions Additional react-query options
 * @param params.checkParamsNull Whether to check for null/undefined in axiosGetParams.params (default: true)
 * @returns useQuery result
 */
export function useQueryAxiosGet<T = unknown>(params: QueryAxiosParams<T>) {
	const {
		queryKey,
		path,
		axiosGetParams = {},
		returnType = "data",
		queryOptions = {},
		checkParamsNull = true,
	} = params;
	const isConnected = useConnectionStore((state) => state.isConnected);
	let enabled = (params.enabled ?? true) && isConnected;
	if (axiosGetParams?.params && checkParamsNull) {
		const paramsHasNull = Object.values(axiosGetParams.params).some(
			(v) => v === null || v === undefined,
		);
		enabled = enabled && !paramsHasNull;
	}

	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const queryFn = async () => {
		if (returnType === "response") {
			return axios.get(backendUrl + path, axiosGetParams);
		}
		if (returnType === "data") {
			return axios
				.get(backendUrl + path, axiosGetParams)
				.then((res) => res.data);
		}
		throw new Error(`Invalid returnType: ${returnType}`);
	};

	const query = useQuery({
		queryKey,
		enabled,
		queryFn,
		...queryOptions,
	});

	return query;
}

type SourcePosition = {
	x: number;
	y: number;
	ra: number;
	dec: number;
	ra_hms: string;
	dec_dms: string;
	ref_basename: string;
	group_id?: string;
};
export function useSourcePosition({
	selectedFootprintId,
	x,
	y,
	ra,
	dec,
	ref_basename,
	enabled = false,
}: {
	selectedFootprintId?: string;
	x?: number;
	y?: number;
	ra?: number;
	dec?: number;
	ref_basename?: string;
	enabled?: boolean;
}) {
	if ((x === undefined) !== (y === undefined)) {
		throw new Error("Both x and y must be provided together");
	}
	if ((ra === undefined) !== (dec === undefined)) {
		throw new Error("Both ra and dec must be provided together");
	}
	if (x === undefined && ra === undefined) {
		throw new Error("Either (x, y) or (ra, dec) must be provided");
	}
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const query = useQueryAxiosGet<SourcePosition>({
		queryKey: ["source_position", group_id, x, y, ra, dec, ref_basename],
		enabled: enabled,
		path: "/source/source_position/",
		axiosGetParams: {
			params: {
				group_id: group_id,
				x: x,
				y: y,
				ra: ra,
				dec: dec,
				ref_basename: ref_basename,
			},
		},
	});
	return query;
}

type CounterpartFootprint = {
	group_id: number;
	footprint: {
		vertices: Array<[number, number]>;
		vertex_marker: Array<[number, number]>;
		center: [number, number];
		area: number;
		radius: number;
	};
};
export function useCounterpartFootprint({
	selectedFootprintId = null,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const query = useQueryAxiosGet<CounterpartFootprint>({
		queryKey: ["counterpart_footprint", group_id],
		path: `/image/counterpart_footprint/${group_id}`,
		enabled: enabled,
	});

	return query;
}

export function useCounterpartImage({
	selectedFootprintId = null,
	r = null,
	g = null,
	b = null,
	normParams,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	r?: string | null;
	g?: string | null;
	b?: string | null;
	normParams?: Record<string, number> | undefined;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const ZustandFilterRGB = useCounterpartStore((state) => state.filterRGB);
	const ZustandCounterpartNorm = useCounterpartStore(
		(state) => state.counterpartNorm,
	);
	const queryNormParams = normParams ?? ZustandCounterpartNorm;
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const filterRGB = {
		r: r ?? ZustandFilterRGB.r,
		g: g ?? ZustandFilterRGB.g,
		b: b ?? ZustandFilterRGB.b,
	};
	const query = useQueryAxiosGet<Blob>({
		queryKey: ["counterpart_image", group_id, filterRGB, queryNormParams],
		path: `/image/counterpart_image/${group_id}`,
		axiosGetParams: {
			params: { ...filterRGB, ...queryNormParams },
			responseType: "blob",
		},
		enabled: enabled,
		queryOptions: {
			gcTime: 1000 * 60, // garbage collect after 1 minute of inactivity
		},
	});
	return query;
}

type CounterpartCutout = {
	cutout_shape: [number, number];
	cutout_data: number[][];
	filter: string;
	group_id: number;
};
export function useCounterpartCutout({
	selectedFootprintId = null,
	filter,
	cutoutParams,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	filter: string;
	cutoutParams: Record<string, number>;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const query = useQueryAxiosGet<CounterpartCutout>({
		queryKey: [
			"counterpart_cutout",
			group_id,
			filter,
			cutoutParams.width,
			cutoutParams.height,
		],
		path: `/image/counterpart_cutout/${group_id}`,
		axiosGetParams: {
			params: {
				filter: filter,
				x0: cutoutParams.x0,
				y0: cutoutParams.y0,
				width: cutoutParams.width,
				height: cutoutParams.height,
			},
		},
		enabled: enabled,
		queryOptions: {
			placeholderData: keepPreviousData,
		},
	});
	return query;
}

type GrismOffset = {
	group_id: number;
	basename: string;
	dx: number;
	dy: number;
	description: string;
};
export function useGrismOffsets({
	selectedFootprintId = null,
	basenameList = [],
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	basenameList?: string[];
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const footprints = useGlobeStore((state) => state.footprints);
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	let targetBasenameList: string[];
	if (!basenameList || basenameList.length === 0) {
		if (group_id) {
			const footprint = footprints.find((f) => f.id === group_id);
			targetBasenameList = footprint?.meta?.included_files ?? [];
		} else {
			targetBasenameList = [];
		}
	} else {
		targetBasenameList = basenameList;
	}
	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_offset", basename, group_id],
			enabled: enabled && !!group_id,
			queryFn: async () => {
				const response = await axios.get(
					`${backendUrl}/wfss/grism_offset/${group_id}`,
					{
						params: { basename },
					},
				);
				return response.data as GrismOffset;
			},
		})),
		combine: (results) => {
			return results.reduce(
				(acc, result, index) => {
					const basename = targetBasenameList[index];
					acc[basename] = result;
					return acc;
				},
				{} as Record<string, UseQueryResult<GrismOffset>>,
			);
		},
	});
	return results;
}

type GrismData = {
	buffer: ArrayBuffer;
	width: number;
	height: number;
};
export function useGrismData({
	selectedFootprintId = null,
	basenameList = [],
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	basenameList?: string[];
	enabled?: boolean;
}) {
	const footprints = useGlobeStore((state) => state.footprints);
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;

	let targetBasenameList: string[];
	if (!basenameList || basenameList.length === 0) {
		if (group_id) {
			const footprint = footprints.find((f) => f.id === group_id);
			targetBasenameList = footprint?.meta?.included_files ?? [];
		} else {
			targetBasenameList = [];
		}
	} else {
		targetBasenameList = basenameList;
	}

	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_data", basename],
			enabled: enabled && targetBasenameList.length > 0,
			queryFn: async () => {
				const response = await axios.get(`${backendUrl}/wfss/grism_data/`, {
					params: { basename },
					responseType: "arraybuffer",
				});
				const buffer = response.data as ArrayBuffer;
				const headers = response.headers;
				const height = Number(headers["x-data-height"]);
				const width = Number(headers["x-data-width"]);
				return { buffer, width, height } as GrismData;
			},
		})),
		combine: (results) => {
			return results.reduce(
				(acc, result, index) => {
					const basename = targetBasenameList[index];
					acc[basename] = result;
					return acc;
				},
				{} as Record<string, UseQueryResult<GrismData>>,
			);
		},
	});
	return results;
}

type GrismErr = {
	buffer: ArrayBuffer;
	width: number;
	height: number;
};
export function useGrismErr({
	selectedFootprintId = null,
	basenameList = [],
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	basenameList?: string[];
	enabled?: boolean;
}) {
	const footprints = useGlobeStore((state) => state.footprints);
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	let targetBasenameList: string[];
	if (!basenameList || basenameList.length === 0) {
		if (group_id) {
			const footprint = footprints.find((f) => f.id === group_id);
			targetBasenameList = footprint?.meta?.included_files ?? [];
		} else {
			targetBasenameList = [];
		}
	} else {
		targetBasenameList = basenameList;
	}
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const results = useQueries({
		queries: targetBasenameList.map((basename) => ({
			queryKey: ["grism_err", basename],
			enabled: enabled && targetBasenameList.length > 0,
			queryFn: async () => {
				const response = await axios.get(`${backendUrl}/wfss/grism_err/`, {
					params: { basename },
					responseType: "arraybuffer",
				});
				const buffer = response.data as ArrayBuffer;
				const headers = response.headers;
				const height = Number(headers["x-data-height"]);
				const width = Number(headers["x-data-width"]);
				return { buffer, width, height } as GrismErr;
			},
		})),
		combine: (results) => {
			return results.reduce(
				(acc, result, index) => {
					const basename = targetBasenameList[index];
					acc[basename] = result;
					return acc;
				},
				{} as Record<string, UseQueryResult<GrismErr>>,
			);
		},
	});
	return results;
}

export type PercentileData = {
	group_id: number;
	percentiles: number[];
	q: number[];
};

export function useFluxPercentiles({
	selectedFootprintId = null,
	q = [],
	roi = null,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	q?: number[];
	roi?: RoiState | null;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryParams: Record<string, number | number[]> = {};
	if (q.length > 0) {
		queryParams.percentage = q;
	}
	if (roi !== null) {
		queryParams.roi_x = roi.x;
		queryParams.roi_y = roi.y;
		queryParams.roi_width = roi.width;
		queryParams.roi_height = roi.height;
	}
	const query = useQueryAxiosGet<PercentileData>({
		queryKey: ["percentile_flux", group_id, { q, roi }],
		path: `/wfss/percentile_flux/${group_id}`,
		axiosGetParams: {
			params: queryParams,
			paramsSerializer: {
				indexes: null,
			},
		},
		enabled: enabled && group_id !== null,
		queryOptions: {
			gcTime: 1000, // garbage collect after 1 second of inactivity
		},
	});
	return query;
}

export type ExtractedSpectrum = {
	covered: boolean;
	wavelength: number[];
	spectrum_2d: number[][];
	error_2d: number[][];
};
export function useExtractSpectrum({
	selectedFootprintId = null,
	waveMin,
	waveMax,
	apertureSize,
	x = null,
	y = null,
	cutoutParams = null,
	enabled = false,
	queryKey,
}: {
	selectedFootprintId?: string | null;
	waveMin: number;
	waveMax: number;
	apertureSize: number | null;
	x?: number | null;
	y?: number | null;
	cutoutParams?: Record<string, number> | null;
	enabled?: boolean;
	queryKey?: QueryKey;
}) {
	if (apertureSize === null && cutoutParams === null) {
		throw new Error("Either apertureSize or cutoutParams must be provided");
	}
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryX =
		x ?? (cutoutParams ? cutoutParams.x0 + cutoutParams.width / 2 : null);
	const queryY =
		y ?? (cutoutParams ? cutoutParams.y0 + cutoutParams.height / 2 : null);
	const aperture =
		apertureSize ??
		(cutoutParams ? Math.max(cutoutParams.width, cutoutParams.height) : null);
	const query = useQueryAxiosGet<ExtractedSpectrum>({
		queryKey: queryKey ?? [
			"extract_spectrum",
			group_id,
			queryX,
			queryY,
			aperture,
		],
		path: "/source/extract_spectrum/",
		enabled: enabled,
		axiosGetParams: {
			params: {
				group_id: group_id,
				wavelength_min: waveMin,
				wavelength_max: waveMax,
				x: queryX,
				y: queryY,
				aperture_size: aperture,
			},
		},
		queryOptions: {
			placeholderData: keepPreviousData,
		},
	});
	return query;
}

export type DispersionTrace = {
	group_id: number | null;
	basename: string | null;
	input_x: number;
	input_y: number;
	wavelengths: number[];
	trace_xs: number[];
	trace_ys: number[];
	mean_pixel_scale: number;
};

export function useDispersionTrace({
	selectedFootprintId,
	basename,
	x,
	y,
	waveMin,
	waveMax,
	enabled = false,
}: {
	selectedFootprintId?: string | undefined;
	basename?: string | undefined;
	x?: number | undefined;
	y?: number | undefined;
	waveMin?: number | undefined;
	waveMax?: number | undefined;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryParams: Record<string, string | number> = {
		...(group_id !== null ? { group_id } : {}),
		...(basename !== undefined ? { basename } : {}),
		...(x !== undefined ? { x } : {}),
		...(y !== undefined ? { y } : {}),
		...(waveMin !== undefined ? { wavemin: waveMin } : {}),
		...(waveMax !== undefined ? { wavemax: waveMax } : {}),
	};

	const query = useQueryAxiosGet<DispersionTrace>({
		queryKey: ["dispersion_trace", group_id, basename, x, y, waveMin, waveMax],
		path: "/source/dispersion_trace/",
		enabled: enabled && (!!group_id || !!basename),
		axiosGetParams: {
			params: queryParams,
		},
		queryOptions: {
			gcTime: 1000 * 10, // garbage collect after 10 seconds of inactivity
		},
	});
	return query;
}

/* -------------------------------------------------------------------------- */
/*                             Submit Fitting Job                             */
/* -------------------------------------------------------------------------- */

/* ----------------------------- Request Schemas ---------------------------- */
export type ExtractionBackendConfiguration = {
	aperture_size: number;
	extraction_mode: "GRISMR" | "GRISMC";
	wavelength_range?: {
		min: number;
		max: number;
	};
};

export type SourceMetaBackend = {
	source_id: string;
	ra?: number;
	dec?: number;
	x?: number;
	y?: number;
	ref_basename?: string;
	group_id?: string | null;
	z?: number;
};

export type ExtractionBodyRequest = {
	extraction_config: ExtractionBackendConfiguration;
	source_meta: SourceMetaBackend;
};

export type FitBackendConfiguration = {
	model_name: string;
	models: FitModel[];
};

export type FitBodyRequest = {
	extraction: ExtractionBodyRequest;
	fit: FitBackendConfiguration[];
};

/* ---------------------------- Response Schemas ---------------------------- */
export type SingleModelFitResult = {
	model_name: string;
	waic: number;
	waic_se: number;
	fitted_models: FitModel[];
	trace_filename: string;
	plot_file_url: string;
	plot_posterior_url: string;
};

export type FitResultPayload = {
	results: Record<string, SingleModelFitResult>;
	best_model_name: string;
	model_comparison_plot_url?: string;
};

export type FitJobResponse = {
	job_id: string;
	status: JobStatus;
	result?: FitResultPayload;
	error?: string;
};

/* --------------------------- Query and Mutation --------------------------- */
type SubmitMutationVariables = {
	sourceId: string;
	sourceMeta?: SourceMetaBackend;
	extractionConfig?: ExtractionBackendConfiguration;
	fitConfigs?: FitBackendConfiguration[];
};

export function useSubmitFitJobMutation() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const traceSources = useSourcesStore((state) => state.traceSources);

	const storedConfiguration = useFitStore((state) => state.configurations);

	return useMutation<FitJobResponse, Error, SubmitMutationVariables>({
		mutationFn: async (variables) => {
			const { sourceId, sourceMeta, extractionConfig, fitConfigs } = variables;

			const finalExtractionConfig: ExtractionBackendConfiguration =
				extractionConfig ?? {
					aperture_size: 5,
					extraction_mode: "GRISMR",
				};
			const finalFitConfigs: FitBackendConfiguration[] =
				fitConfigs ??
				storedConfiguration
					.filter((config) => config.selected)
					.map((config) => ({
						model_name: config.name,
						models: config.models,
					}));
			if (finalFitConfigs.length === 0) {
				throw new Error(
					"No fit configurations selected. Please select at least one configuration.",
				);
			}
			let finalSourceMeta: SourceMetaBackend;
			if (sourceMeta) {
				finalSourceMeta = sourceMeta;
			} else {
				const traceSource = traceSources.find((s) => s.id === sourceId);
				if (!traceSource) {
					throw new Error(`Trace source with ID ${sourceId} not found.`);
				}
				finalSourceMeta = {
					source_id: traceSource.id,
					ra: traceSource.ra,
					dec: traceSource.dec,
					x: traceSource.x,
					y: traceSource.y,
					group_id: traceSource.groupId,
					z: traceSource.z,
				};
			}
			const payload: FitBodyRequest = {
				extraction: {
					extraction_config: finalExtractionConfig,
					source_meta: finalSourceMeta,
				},
				fit: finalFitConfigs,
			};
			try {
				const response = await axios.post(`${backendUrl}/fit/submit/`, payload);
				return response.data as FitJobResponse;
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					const data = error.response.data;
					let errorMsg = "Unknown error";

					if (data?.detail) {
						if (Array.isArray(data.detail)) {
							const detail = data.detail as ApiErrorDetail[];
							errorMsg = detail
								.map((err) => `${err.loc.join(".")} -> ${err.msg}`)
								.join("\n");
						} else if (typeof data.detail === "object") {
							errorMsg = JSON.stringify(data.detail);
						} else {
							errorMsg = String(data.detail);
						}
					} else if (data?.message) {
						errorMsg = data.message;
					} else {
						errorMsg = error.message;
					}
					throw new Error(`Fit job submission failed:\n${errorMsg}`);
				}
				throw error;
			}
		},
		onSuccess: (data, _variables) => {
			toaster.success({
				title: "Fit Job Submitted",
				description: `Job ID: ${data.job_id.slice(0, 8)}`,
			});
			useFitStore.getState().addJob(data);
		},
		onError: (error) => {
			toaster.error({
				title: "Fit Job Submission Failed",
				description: error.message,
			});
		},
	});
}

export function useFitJobStatusQuery() {
	const jobs = useFitStore((state) => state.jobs);

	// Filter jobs that need polling (pending or processing)
	const activeJobs = jobs.filter(
		(job) => job.status === "pending" || job.status === "processing",
	);

	const backendUrl = useConnectionStore((state) => state.backendUrl);

	useQueries({
		queries: activeJobs.map((job) => ({
			queryKey: ["fit_job_status", job.job_id],
			queryFn: async () => {
				const response = await axios.get(
					`${backendUrl}/fit/status/${job.job_id}/`,
				);
				return response.data as FitJobResponse;
			},
			refetchInterval: (query: Query<FitJobResponse>) => {
				const status = query.state.data?.status;
				if (status === "completed" || status === "failed") {
					return false;
				}
				return 3000; // Poll every 3 seconds
			},
		})),
	});
}

// Inner hook for single job polling, much cleaner to handle updates
export function useSingleJobPoller(jobId: string) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const existingJob = useFitStore((state) =>
		state.jobs.find((j) => j.job_id === jobId),
	);

	return useQuery({
		queryKey: ["fit_job_status", jobId],
		queryFn: async () => {
			const response = await axios.get(`${backendUrl}/fit/status/${jobId}/`);
			return response.data as FitJobResponse;
		},
		enabled:
			!!jobId &&
			(existingJob?.status === "pending" ||
				existingJob?.status === "processing"),
		refetchInterval: (query) => {
			const status = query.state.data?.status;
			if (status === "completed" || status === "failed") {
				return false;
			}
			return 3000;
		},
	});
}

export type SaveFitResultResponse = {
	status: string;
	source_id: string;
	message: string;
	files_copied: {
		plots_dir: string;
		traces_dir: string;
	};
	catalog_entry_id: string | number;
};

export type SaveFitResultVariables = {
	sourceId: string;
	tags?: string[];
};

export function useSaveFitResultMutation() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	return useMutation<SaveFitResultResponse, Error, SaveFitResultVariables>({
		mutationFn: async ({ sourceId, tags }) => {
			try {
				const response = await axios.post(
					`${backendUrl}/fit/save/${sourceId}/`,
					{
						tags: tags || [],
					},
				);
				return response.data as SaveFitResultResponse;
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					const data = error.response.data;
					let errorMsg = "Unknown error";

					if (data?.detail) {
						if (Array.isArray(data.detail)) {
							const detail = data.detail as ApiErrorDetail[];
							errorMsg = detail
								.map((err) => `${err.loc.join(".")} -> ${err.msg}`)
								.join("\n");
						} else if (typeof data.detail === "object") {
							errorMsg = JSON.stringify(data.detail);
						} else {
							errorMsg = String(data.detail);
						}
					} else if (data?.message) {
						errorMsg = data.message;
					} else {
						errorMsg = error.message;
					}
					throw new Error(`Fit save failed:\n${errorMsg}`);
				}
				throw error;
			}
		},
		onSuccess: (data) => {
			toaster.success({
				title: "Fit Result Saved",
				description: data.message,
			});
		},
		onError: (error) => {
			toaster.error({ title: "Fit Save Failed", description: error.message });
		},
	});
}

/* -------------------------------------------------------------------------- */
/*                               Catalog Query                                */
/* -------------------------------------------------------------------------- */

export type SourceCatalogBase = {
	id: string;
	ra: number;
	dec: number;
	ref_basename: string;
	pixel_x: number;
	pixel_y: number;
	z: number | null;
	tags: string[];
	created_at: string;
};

export type CatalogItemResponse = SourceCatalogBase & {
	model_comparison_plot_url: string | null;
	best_model_plot_url: string | null;
	best_model_posterior_url: string | null;
};

export type PaginatedCatalogResponse = {
	items: CatalogItemResponse[];
	total: number;
	page: number;
	page_size: number;
};

export function useCatalogQuery({
	page = 1,
	pageSize = 20,
	sortDesc = true,
	enabled = true,
}: {
	page?: number;
	pageSize?: number;
	sortDesc?: boolean;
	enabled?: boolean;
}) {
	return useQueryAxiosGet<PaginatedCatalogResponse>({
		queryKey: ["catalog", page, pageSize, sortDesc],
		path: "/fit/catalog/",
		axiosGetParams: {
			params: {
				page,
				page_size: pageSize,
				sort_desc: sortDesc,
			},
		},
		enabled,
		queryOptions: {
			placeholderData: keepPreviousData,
		},
	});
}
