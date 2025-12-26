import { useEffect } from "react";
import {
	keepPreviousData,
	type UseQueryOptions,
	type UseQueryResult,
	useQueries,
	useQuery,
	useMutation
} from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";
import { useFitStore } from "@/stores/fit";
import { useSourcesStore } from "@/stores/sources";
import type { FitModel, RoiState, JobStatus } from "@/stores/stores-types";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";

type QueryAxiosParams<T = any> = {
	queryKey: Array<any>;
	path: string;
	enabled?: boolean;
	axiosGetParams?: Record<string, any>;
	returnType?: "response" | "data";
	queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">;
	checkParamsNull?: boolean;
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
export function useQueryAxiosGet<T = any>(params: QueryAxiosParams<T>) {
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
}
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
		queryKey: [
			"source_position",
			group_id,
			x,
			y,
			ra,
			dec,
			ref_basename,
		],
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
	const ZustandCounterpartNorm = useCounterpartStore((state) => state.counterpartNorm);
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
}

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
	const queryParams: Record<string, any> = {}
	if (q.length > 0) {
		queryParams.percentage = q
	}
	if (roi !== null) {
		queryParams.roi_x = roi.x;
		queryParams.roi_y = roi.y;
		queryParams.roi_width = roi.width;
		queryParams.roi_height = roi.height;
	}
	const query = useQueryAxiosGet<PercentileData>({
		queryKey: ["percentile_flux", group_id, {q, roi}],
		path: `/wfss/percentile_flux/${group_id}`,
		axiosGetParams: {
			params: queryParams,
			paramsSerializer: {
				indexes: null
			}
		},
		enabled: enabled && group_id !== null,
		queryOptions: {
			gcTime: 1000, // garbage collect after 1 second of inactivity
		}
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
}: {
	selectedFootprintId?: string | null;
	waveMin: number;
	waveMax: number;
	apertureSize: number | null;
	x?: number | null;
	y?: number | null;
	cutoutParams?: Record<string, number> | null;
	enabled?: boolean;
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
		queryKey: ["extract_spectrum", group_id, queryX, queryY, aperture],
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
}

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
		queryKey: [
			"dispersion_trace",
			group_id,
			basename,
			x,
			y,
			waveMin,
			waveMax,
		],
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
}

export type SourceMetaBackend = {
	source_id: string;
	ra?: number;
	dec?: number;
	x?: number;
	y?: number;
	ref_basename?: string;
	group_id?: string | null;
}

export type ExtractionBodyRequest = {
	extraction_config: ExtractionBackendConfiguration;
	source_meta: SourceMetaBackend;
}

export type FitBackendConfiguration = {
	model_name: string;
	models: FitModel[];
}

export type FitBodyRequest = {
	extraction: ExtractionBodyRequest;
	fit: FitBackendConfiguration[];
}

/* ---------------------------- Response Schemas ---------------------------- */
export type SingleModelFitResult = {
	model_name: string;
	waic: number;
	waic_se: number;
	fitted_models: FitModel[];
	trace_filename: string;
	plot_file_url: string;
}

export type FitResultPayload = {
	results: Record<string, SingleModelFitResult>;
	best_model_name: string;
}



export type FitJobResponse = {
	job_id: string;
	status: JobStatus;
	result?: FitResultPayload;
	error?: string;
}

/* --------------------------- Query and Mutation --------------------------- */
type SubmitMutationVariables = {
	sourceId: string;
	sourceMeta?: SourceMetaBackend;
	extractionConfig?: ExtractionBackendConfiguration;
	fitConfigs?: FitBackendConfiguration[];
}


export function useSubmitFitJobMutation() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const traceSources = useSourcesStore((state => state.traceSources));
	const updateTraceSource = useSourcesStore((state) => state.updateTraceSource);
	const storedConfiguration = useFitStore((state) => state.configurations);

	return useMutation<FitJobResponse, Error, SubmitMutationVariables> ({
		mutationFn: async (variables) => {
			const {
				sourceId,
				sourceMeta,
				extractionConfig,
				fitConfigs,
			} = variables;

			const finalExtractionConfig: ExtractionBackendConfiguration = extractionConfig ?? {
				aperture_size: 5,
				extraction_mode: "GRISMR",
			};
			const finalFitConfigs: FitBackendConfiguration[] = fitConfigs ??
				storedConfiguration
					.filter((config) => config.selected)
					.map((config) => ({
						model_name: config.name,
						models: config.models,
					}));
			if (finalFitConfigs.length === 0) {
				throw new Error("No fit configurations selected. Please select at least one configuration.");
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
				const response = await axios.post(
					`${backendUrl}/fit/submit/`,
					payload,
				);
				return response.data as FitJobResponse;
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					const data = error.response.data;
					let errorMsg = "Unknown error";

					// 1. 优先检查 FastAPI 的 detail 字段
					if (data?.detail) {
						if (Array.isArray(data.detail)) {
							// 情况 A: Pydantic 校验错误 (数组)
							// 将其转换为: "body.fit.0.models.0.sigma -> field required"
							errorMsg = data.detail
								.map((err: any) => `${err.loc.join(".")} -> ${err.msg}`)
								.join("\n");
						} else if (typeof data.detail === "object") {
							// 情况 B: detail 是个对象 (罕见，但以防万一)
							errorMsg = JSON.stringify(data.detail);
						} else {
							// 情况 C: detail 是普通字符串
							errorMsg = String(data.detail);
						}
					} 
					// 2. 检查是否有 message 字段 (其他框架常见)
					else if (data?.message) {
						errorMsg = data.message;
					} 
					// 3. 回退到 HTTP 状态文本
					else {
						errorMsg = error.message;
					}
					throw new Error(`Fit job submission failed:\n${errorMsg}`);
				}
				throw error;
			}
		},
		onSuccess: (data, variables) => {
			toaster.success({ title: "Fit Job Submitted", description: `Job ID: ${data.job_id.slice(0, 8)}` });
			updateTraceSource(variables.sourceId, {
				fitState: {
					jobId: data.job_id,
					jobStatus: data.status,
				}
			});
		},
		onError: (error) => {
			toaster.error({ title: "Fit Job Submission Failed", description: error.message });
		}
	})
}

export function useFitJobStatusQuery(sourceId: string) {
	const { jobId, jobStatus } = useSourcesStore(
		useShallow((state) => {
			const traceSource = state.traceSources.find((s) => s.id === sourceId);
			return {
				jobId: traceSource?.fitState?.jobId ?? null,
				jobStatus: traceSource?.fitState?.jobStatus ?? null,
			}
		})
	)

	const query = useQueryAxiosGet<FitJobResponse>({
		queryKey: ["fit_job_status", jobId],
		path: `/fit/status/${jobId}/`,
		enabled: !!jobId,
		queryOptions: {
			refetchInterval: (query) => {
				const status = query.state.data?.status;
				if (status === "completed" || status === "failed") {
					return false;
				}
				return 5000; // refetch every 5 seconds
			},
		},
	});
	// Synchronize job status back to the source store
	const newData = query.data;
	const updateTraceSource = useSourcesStore((state) => state.updateTraceSource);
	useEffect(() => {
		if (newData && sourceId && (newData.status !== jobStatus)) {
			updateTraceSource(sourceId, {
				fitState: {
					jobId: newData.job_id,
					jobStatus: newData.status,
				}
			});
		}
	}, [newData, sourceId, jobId, jobStatus, updateTraceSource]);
	return query;
} 