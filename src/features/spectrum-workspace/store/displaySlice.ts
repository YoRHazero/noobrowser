"use client";

import type { StateCreator } from "zustand";
import type {
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasDisplayModel,
	Spectrum2DCanvasNorm,
} from "@/canvas/spectrum2dCanvas";
import type { SpectrumWorkspaceStore } from "./index";

export interface SpectrumWorkspaceDisplaySlice {
	display: Spectrum2DCanvasDisplayModel | null;
	initializeDisplay: (display: Spectrum2DCanvasDisplayModel) => void;
	setNorm: (norm: Spectrum2DCanvasNorm) => void;
	setColorMap: (colorMap: Spectrum2DCanvasColorMap) => void;
}

export const createSpectrumWorkspaceDisplaySlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspaceDisplaySlice
> = (set) => ({
	display: null,
	initializeDisplay: (display) =>
		set((state) => (state.display === null ? { display } : state)),
	setNorm: (norm) =>
		set((state) => ({
			display: {
				...(state.display ?? {
					colorMap: "gray",
					interpolation: "nearest" as const,
				}),
				norm,
			},
		})),
	setColorMap: (colorMap) =>
		set((state) => ({
			display: {
				...(state.display ?? {
					norm: { kind: "linear" as const, min: 0, max: 1 },
					interpolation: "nearest" as const,
				}),
				colorMap,
			},
		})),
});
