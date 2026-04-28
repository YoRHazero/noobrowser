"use client";

import type { StateCreator } from "zustand";
import type {
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasNorm,
} from "@/canvas/spectrum2dCanvas";
import { SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE } from "../shared/constants";
import type {
	SpectrumWorkspaceDisplayRangeMode,
	SpectrumWorkspaceDisplaySampleSource,
	SpectrumWorkspaceDisplayState,
} from "../shared/types";
import type { SpectrumWorkspaceStore } from "./index";

export interface SpectrumWorkspaceDisplaySlice {
	displayState: SpectrumWorkspaceDisplayState | null;
	initializeDisplayState: (displayState: SpectrumWorkspaceDisplayState) => void;
	setColorMap: (colorMap: Spectrum2DCanvasColorMap) => void;
	setNormKind: (normKind: Spectrum2DCanvasNorm["kind"]) => void;
	setRangeMode: (rangeMode: SpectrumWorkspaceDisplayRangeMode) => void;
	setSampleSource: (sampleSource: SpectrumWorkspaceDisplaySampleSource) => void;
	setPercentileRange: (range: { pmin: number; pmax: number }) => void;
	setAbsoluteRange: (range: { vmin: number; vmax: number }) => void;
}

export const createSpectrumWorkspaceDisplaySlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	SpectrumWorkspaceDisplaySlice
> = (set) => ({
	displayState: null,
	initializeDisplayState: (displayState) =>
		set((state) => (state.displayState === null ? { displayState } : state)),
	setColorMap: (colorMap) =>
		set((state) => ({
			displayState: {
				...(state.displayState ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE),
				colorMap,
			},
		})),
	setNormKind: (normKind) =>
		set((state) => ({
			displayState: {
				...(state.displayState ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE),
				normKind,
			},
		})),
	setRangeMode: (rangeMode) =>
		set((state) => ({
			displayState: {
				...(state.displayState ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE),
				rangeMode,
			},
		})),
	setSampleSource: (sampleSource) =>
		set((state) => ({
			displayState: {
				...(state.displayState ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE),
				sampleSource,
			},
		})),
	setPercentileRange: ({ pmin, pmax }) =>
		set((state) => ({
			displayState: {
				...(state.displayState ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE),
				pmin: Math.min(Math.max(pmin, 0), 100),
				pmax: Math.min(Math.max(pmax, 0), 100),
			},
		})),
	setAbsoluteRange: ({ vmin, vmax }) =>
		set((state) => ({
			displayState: {
				...(state.displayState ?? SPECTRUM_WORKSPACE_DEFAULT_DISPLAY_STATE),
				vmin,
				vmax,
			},
		})),
});
