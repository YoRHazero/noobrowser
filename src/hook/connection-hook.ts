import {
	keepPreviousData,
	type UseQueryOptions,
	type UseQueryResult,
	useQueries,
	useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";

type QueryAxiosParams<T = any> = {
	queryKey: Array<any>;
	path: string;
	enabled?: boolean;
	axiosGetParams?: Record<string, any>;
	returnType?: "response" | "data";
	queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">;
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
 * @returns useQuery result
 */
export function useQueryAxiosGet<T = any>(params: QueryAxiosParams<T>) {
	const {
		queryKey,
		path,
		axiosGetParams = {},
		returnType = "data",
		queryOptions = {},
	} = params;
	const isConnected = useConnectionStore((state) => state.isConnected);
	let enabled = (params.enabled ?? true) && isConnected;
	if (axiosGetParams?.params) {
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

type WorldCoordinates = {
	group_id: number;
	x: number;
	y: number;
	ra: number;
	dec: number;
	ra_hms: string;
	dec_dms: string;
};
export function useWorldCoordinates({
	selectedFootprintId,
	x = null,
	y = null,
	cutoutParams = null,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	x?: number | null;
	y?: number | null;
	cutoutParams?: Record<string, number> | null;
	enabled?: boolean;
}) {
	if ((x === null || y === null) && cutoutParams === null) {
		throw new Error("Either (x, y) or cutoutParams must be provided");
	}
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const queryX =
		x ?? (cutoutParams ? cutoutParams.x0 + cutoutParams.width / 2 : null);
	const queryY =
		y ?? (cutoutParams ? cutoutParams.y0 + cutoutParams.height / 2 : null);
	const query = useQueryAxiosGet<WorldCoordinates>({
		queryKey: ["world_coordinates", group_id, queryX, queryY],
		enabled: enabled,
		path: "/wfss/world_coordinates/",
		axiosGetParams: {
			params: {
				group_id: group_id,
				x: queryX,
				y: queryY,
			},
		},
	});
	return query;
}

type PixelCoordinates = {
	group_id: number;
	ra: number;
	dec: number;
	x: number;
	y: number;
};
export function usePixelCoordinates({
	selectedFootprintId = null,
	ra,
	dec,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	ra: number;
	dec: number;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const query = useQueryAxiosGet<PixelCoordinates>({
		queryKey: ["pixel_coordinates", group_id, ra, dec],
		enabled: enabled,
		path: "/wfss/pixel_coordinates/",
		axiosGetParams: {
			params: {
				group_id: group_id,
				ra: ra,
				dec: dec,
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
	normParams: Record<string, number>;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const ZustandFilterRGB = useCounterpartStore((state) => state.filterRGB);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const filterRGB = {
		r: r ?? ZustandFilterRGB.r,
		g: g ?? ZustandFilterRGB.g,
		b: b ?? ZustandFilterRGB.b,
	};
	const query = useQueryAxiosGet<Blob>({
		queryKey: ["counterpart_image", group_id, filterRGB, normParams],
		path: `/image/counterpart_image/${group_id}`,
		axiosGetParams: {
			params: { ...filterRGB, ...normParams },
			responseType: "blob",
		},
		enabled: enabled,
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
					`${backendUrl}/wfss/grism_offsets/${group_id}`,
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
	if ((x === null || y === null) && cutoutParams === null) {
		throw new Error("Either (x, y) or cutoutParams must be provided");
	}
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
		path: "/wfss/extract_spectrum/",
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
