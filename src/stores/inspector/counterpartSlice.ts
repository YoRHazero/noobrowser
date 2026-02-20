import type { StateCreator } from "zustand";
import type { RGBSet, NormParams } from "@/types/common";
import type { CutoutParams, CounterpartPosition } from "./types";
import { clamp } from "@/utils/projection";
import type { InspectorState } from "./index";

export interface CounterpartSlice {
	availableFilters: string[];
	filterRGB: RGBSet;
	displayMode: "rgb" | "r" | "g" | "b";
	opacity: number;
	counterpartNorm: NormParams;
	cutoutParams: CutoutParams;
	cutoutNorm: NormParams;
	cutoutSortedArray: number[] | null;
	counterpartPosition: CounterpartPosition;

	setAvailableFilters: (filters: string[]) => void;
	setFilterRGB: (patch: Partial<RGBSet>) => void;
	setDisplayMode: (mode: "rgb" | "r" | "g" | "b") => void;
	setOpacity: (opacity: number) => void;
	setCounterpartNorm: (params: Partial<NormParams>) => void;
	setCounterpartPosition: (patch: Partial<CounterpartPosition>) => void;
	setCutoutParams: (patch: Partial<CutoutParams>) => void;
	setCutoutNorm: (patch: Partial<NormParams>) => void;
	setCutoutSortedArray: (array: number[] | null) => void;
}

export const createCounterpartSlice: StateCreator<
	InspectorState,
	[],
	[],
	CounterpartSlice
> = (set) => ({
	availableFilters: [],
	filterRGB: { r: "", g: "", b: "" },
	displayMode: "rgb",
	opacity: 1.0,
	counterpartNorm: { pmin: 1, pmax: 99 },
	counterpartPosition: { x0: 0, y0: 0, width: 3000, height: 0 },
	cutoutParams: {
		cutoutPmin: 1,
		cutoutPmax: 99,
		x0: 0,
		y0: 0,
		width: 100,
		height: 100,
	},
	cutoutNorm: { pmin: 1, pmax: 99 },
	cutoutSortedArray: null,

	setAvailableFilters: (filters) => set({ availableFilters: filters }),
	setFilterRGB: (patch) =>
		set((state) => ({ filterRGB: { ...state.filterRGB, ...patch } })),
	setDisplayMode: (mode) => set({ displayMode: mode }),
	setOpacity: (opacity) => {
		const clampedOpacity = clamp(opacity, 0, 1);
		set({ opacity: clampedOpacity });
	},
	setCounterpartNorm: (patch) =>
		set((state) => ({
			counterpartNorm: { ...state.counterpartNorm, ...patch },
		})),
	setCounterpartPosition: (patch) =>
		set((state) => ({
			counterpartPosition: { ...state.counterpartPosition, ...patch },
		})),
	setCutoutParams: (patch) =>
		set((state) => ({
			cutoutParams: { ...state.cutoutParams, ...patch },
		})),
	setCutoutNorm: (patch) =>
		set((state) => ({ cutoutNorm: { ...state.cutoutNorm, ...patch } })),
	setCutoutSortedArray: (array) => set({ cutoutSortedArray: array }),
});
