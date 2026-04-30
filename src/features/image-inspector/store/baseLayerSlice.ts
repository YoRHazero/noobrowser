"use client";

import type { StateCreator } from "zustand";
import type {
	BaseLayerColorMap,
	BaseLayerNormRangeMode,
	BaseLayerStretch,
	ImageInspectorFetchStatus,
} from "../shared/types";
import type { ImageInspectorStore } from "./index";

export interface BaseLayerNormState {
	rangeMode: BaseLayerNormRangeMode;
	min: number;
	max: number;
	stretch: BaseLayerStretch;
}

export interface BaseLayerGrismFetchRequest {
	id: number;
	footprintId: string;
	basenameList: string[];
}

export interface BaseLayerSlice {
	baseLayerActiveBasename: string | null;
	baseLayerMainColorMap: BaseLayerColorMap;
	baseLayerMainNorm: BaseLayerNormState;
	baseLayerRoiIndependentNorm: boolean;
	baseLayerRoiNorm: BaseLayerNormState;
	baseLayerGrismFetchRequest: BaseLayerGrismFetchRequest | null;
	baseLayerGrismFetchStatus: ImageInspectorFetchStatus;
	baseLayerGrismFetchErrorMessage: string | null;
	setBaseLayerActiveBasename: (basename: string | null) => void;
	setBaseLayerMainColorMap: (colorMap: BaseLayerColorMap) => void;
	setBaseLayerMainRangeMode: (rangeMode: BaseLayerNormRangeMode) => void;
	setBaseLayerMainMin: (min: number) => void;
	setBaseLayerMainMax: (max: number) => void;
	setBaseLayerMainStretch: (stretch: BaseLayerStretch) => void;
	setBaseLayerRoiIndependentNorm: (independent: boolean) => void;
	setBaseLayerRoiRangeMode: (rangeMode: BaseLayerNormRangeMode) => void;
	setBaseLayerRoiMin: (min: number) => void;
	setBaseLayerRoiMax: (max: number) => void;
	setBaseLayerRoiStretch: (stretch: BaseLayerStretch) => void;
	requestBaseLayerGrismFetch: (payload: {
		footprintId: string;
		basenameList: string[];
	}) => void;
	setBaseLayerGrismFetchPending: (requestId: number) => void;
	setBaseLayerGrismFetchSucceeded: (requestId: number) => void;
	setBaseLayerGrismFetchFailed: (
		requestId: number,
		errorMessage: string,
	) => void;
}

const DEFAULT_NORM_STATE: BaseLayerNormState = {
	rangeMode: "percentile",
	min: 1,
	max: 99,
	stretch: "linear",
};

export const createBaseLayerSlice: StateCreator<
	ImageInspectorStore,
	[],
	[],
	BaseLayerSlice
> = (set) => ({
	baseLayerActiveBasename: null,
	baseLayerMainColorMap: "gray",
	baseLayerMainNorm: { ...DEFAULT_NORM_STATE },
	baseLayerRoiIndependentNorm: false,
	baseLayerRoiNorm: { ...DEFAULT_NORM_STATE },
	baseLayerGrismFetchRequest: null,
	baseLayerGrismFetchStatus: "idle",
	baseLayerGrismFetchErrorMessage: null,
	setBaseLayerActiveBasename: (baseLayerActiveBasename) =>
		set({ baseLayerActiveBasename }),
	setBaseLayerMainColorMap: (baseLayerMainColorMap) =>
		set({ baseLayerMainColorMap }),
	setBaseLayerMainRangeMode: (rangeMode) =>
		set((state) => ({
			baseLayerMainNorm: {
				...state.baseLayerMainNorm,
				rangeMode,
			},
		})),
	setBaseLayerMainMin: (min) =>
		set((state) => ({
			baseLayerMainNorm: {
				...state.baseLayerMainNorm,
				min,
			},
		})),
	setBaseLayerMainMax: (max) =>
		set((state) => ({
			baseLayerMainNorm: {
				...state.baseLayerMainNorm,
				max,
			},
		})),
	setBaseLayerMainStretch: (stretch) =>
		set((state) => ({
			baseLayerMainNorm: {
				...state.baseLayerMainNorm,
				stretch,
			},
		})),
	setBaseLayerRoiIndependentNorm: (baseLayerRoiIndependentNorm) =>
		set({ baseLayerRoiIndependentNorm }),
	setBaseLayerRoiRangeMode: (rangeMode) =>
		set((state) => ({
			baseLayerRoiNorm: {
				...state.baseLayerRoiNorm,
				rangeMode,
			},
		})),
	setBaseLayerRoiMin: (min) =>
		set((state) => ({
			baseLayerRoiNorm: {
				...state.baseLayerRoiNorm,
				min,
			},
		})),
	setBaseLayerRoiMax: (max) =>
		set((state) => ({
			baseLayerRoiNorm: {
				...state.baseLayerRoiNorm,
				max,
			},
		})),
	setBaseLayerRoiStretch: (stretch) =>
		set((state) => ({
			baseLayerRoiNorm: {
				...state.baseLayerRoiNorm,
				stretch,
			},
		})),
	requestBaseLayerGrismFetch: ({ footprintId, basenameList }) =>
		set((state) => {
			const requestId = (state.baseLayerGrismFetchRequest?.id ?? 0) + 1;

			return {
				baseLayerGrismFetchRequest: {
					id: requestId,
					footprintId,
					basenameList,
				},
				baseLayerGrismFetchStatus: "pending",
				baseLayerGrismFetchErrorMessage: null,
			};
		}),
	setBaseLayerGrismFetchPending: (requestId) =>
		set((state) =>
			state.baseLayerGrismFetchRequest?.id === requestId
				? {
						baseLayerGrismFetchStatus: "pending",
						baseLayerGrismFetchErrorMessage: null,
					}
				: {},
		),
	setBaseLayerGrismFetchSucceeded: (requestId) =>
		set((state) =>
			state.baseLayerGrismFetchRequest?.id === requestId
				? {
						baseLayerGrismFetchStatus: "success",
						baseLayerGrismFetchErrorMessage: null,
					}
				: {},
		),
	setBaseLayerGrismFetchFailed: (requestId, errorMessage) =>
		set((state) =>
			state.baseLayerGrismFetchRequest?.id === requestId
				? {
						baseLayerGrismFetchStatus: "error",
						baseLayerGrismFetchErrorMessage: errorMessage,
					}
				: {},
		),
});
