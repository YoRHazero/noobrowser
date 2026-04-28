"use client";

import type { StateCreator } from "zustand";
import type { Spectrum1DCanvasWaveRange } from "@/canvas/spectrum1dCanvas";
import type { SpectrumWorkspaceStore } from "./index";

export interface SpectrumWorkspace1DSliceRangeSlice {
	spectrum1dSliceRangeSourceId: string | null;
	spectrum1dSliceRange: Spectrum1DCanvasWaveRange | null;
	setSpectrum1dSliceRange: (range: Spectrum1DCanvasWaveRange) => void;
	reconcileSpectrum1dSliceRange: (
		sourceId: string,
		range: Spectrum1DCanvasWaveRange,
	) => void;
}

export const createSpectrumWorkspace1DSliceRangeSlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspace1DSliceRangeSlice
> = (set) => ({
	spectrum1dSliceRangeSourceId: null,
	spectrum1dSliceRange: null,
	setSpectrum1dSliceRange: (spectrum1dSliceRange) =>
		set({ spectrum1dSliceRange }),
	reconcileSpectrum1dSliceRange: (
		spectrum1dSliceRangeSourceId,
		spectrum1dSliceRange,
	) =>
		set({
			spectrum1dSliceRangeSourceId,
			spectrum1dSliceRange,
		}),
});
