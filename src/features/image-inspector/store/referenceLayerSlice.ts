"use client";

import type { StateCreator } from "zustand";
import type {
	ImageInspectorFetchStatus,
	ReferenceLayerFilterRgb,
	ReferenceLayerMode,
	ReferenceLayerRgbChannel,
} from "../shared/types";
import type { ImageInspectorStore } from "./index";

export interface ReferenceLayerCounterpartFetchRequest {
	id: number;
	footprintId: string;
	filterRgb: ReferenceLayerFilterRgb;
}

export interface ReferenceLayerSlice {
	referenceFilterRgb: ReferenceLayerFilterRgb;
	referenceMode: ReferenceLayerMode;
	referenceOpacity: number;
	referenceCounterpartFetchRequest: ReferenceLayerCounterpartFetchRequest | null;
	referenceCounterpartFetchStatus: ImageInspectorFetchStatus;
	referenceCounterpartFetchErrorMessage: string | null;
	setReferenceFilter: (
		channel: ReferenceLayerRgbChannel,
		filter: string,
	) => void;
	setReferenceMode: (mode: ReferenceLayerMode) => void;
	setReferenceOpacity: (opacity: number) => void;
	requestReferenceCounterpartFetch: (payload: {
		footprintId: string;
		filterRgb: ReferenceLayerFilterRgb;
	}) => void;
	setReferenceCounterpartFetchPending: (requestId: number) => void;
	setReferenceCounterpartFetchSucceeded: (requestId: number) => void;
	setReferenceCounterpartFetchFailed: (
		requestId: number,
		errorMessage: string,
	) => void;
}

function clampOpacity(opacity: number) {
	if (!Number.isFinite(opacity)) {
		return 1;
	}

	return Math.min(1, Math.max(0, opacity));
}

export const createReferenceLayerSlice: StateCreator<
	ImageInspectorStore,
	[],
	[],
	ReferenceLayerSlice
> = (set) => ({
	referenceFilterRgb: {
		r: "",
		g: "",
		b: "",
	},
	referenceMode: "rgb",
	referenceOpacity: 1,
	referenceCounterpartFetchRequest: null,
	referenceCounterpartFetchStatus: "idle",
	referenceCounterpartFetchErrorMessage: null,
	setReferenceFilter: (channel, filter) =>
		set((state) => ({
			referenceFilterRgb: {
				...state.referenceFilterRgb,
				[channel]: filter,
			},
		})),
	setReferenceMode: (referenceMode) => set({ referenceMode }),
	setReferenceOpacity: (referenceOpacity) =>
		set({ referenceOpacity: clampOpacity(referenceOpacity) }),
	requestReferenceCounterpartFetch: ({ footprintId, filterRgb }) =>
		set((state) => {
			const requestId = (state.referenceCounterpartFetchRequest?.id ?? 0) + 1;

			return {
				referenceCounterpartFetchRequest: {
					id: requestId,
					footprintId,
					filterRgb: { ...filterRgb },
				},
				referenceCounterpartFetchStatus: "pending",
				referenceCounterpartFetchErrorMessage: null,
			};
		}),
	setReferenceCounterpartFetchPending: (requestId) =>
		set((state) =>
			state.referenceCounterpartFetchRequest?.id === requestId
				? {
						referenceCounterpartFetchStatus: "pending",
						referenceCounterpartFetchErrorMessage: null,
					}
				: {},
		),
	setReferenceCounterpartFetchSucceeded: (requestId) =>
		set((state) =>
			state.referenceCounterpartFetchRequest?.id === requestId
				? {
						referenceCounterpartFetchStatus: "success",
						referenceCounterpartFetchErrorMessage: null,
					}
				: {},
		),
	setReferenceCounterpartFetchFailed: (requestId, errorMessage) =>
		set((state) =>
			state.referenceCounterpartFetchRequest?.id === requestId
				? {
						referenceCounterpartFetchStatus: "error",
						referenceCounterpartFetchErrorMessage: errorMessage,
					}
				: {},
		),
});
