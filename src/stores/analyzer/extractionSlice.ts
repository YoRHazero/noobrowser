import type { StateCreator } from "zustand";
import type { FitExtractionSettings } from "./types";
import type { WaveFrame, NormParams, XY } from "@/types/common";
import type { AnalyzerState } from "./index";

export interface ExtractionSlice {
	waveFrame: WaveFrame;
	fitExtraction: FitExtractionSettings;
	apertureSize: number;
	grismNorm: NormParams;
	extractedSpecSortedArray: number[] | null;
	normInWindow: boolean;
	forwardSourcePosition: XY;
	spectrumQueryKey: Array<unknown> | null;

	setWaveFrame: (frame: WaveFrame) => void;
	setFitExtraction: (patch: Partial<FitExtractionSettings>) => void;
	setApertureSize: (size: number) => void;
	setGrismNorm: (patch: Partial<NormParams>) => void;
	setExtractedSpecSortedArray: (array: number[] | null) => void;
	setNormInWindow: (inWindow: boolean) => void;
	setForwardSourcePosition: (pos: XY) => void;
	setSpectrumQueryKey: (key: Array<unknown> | null) => void;
}

export const createExtractionSlice: StateCreator<AnalyzerState, [], [], ExtractionSlice> = (set) => ({
	waveFrame: "observe",
	fitExtraction: {
		apertureSize: 5,
		offset: 0,
		extractMode: "GRISMR",
	},
	apertureSize: 5,
	grismNorm: { pmin: 5, pmax: 95 },
	extractedSpecSortedArray: null,
	normInWindow: false,
	forwardSourcePosition: { x: 0, y: 0 },
	spectrumQueryKey: null,

	setWaveFrame: (frame) => set({ waveFrame: frame }),
	setFitExtraction: (patch) =>
		set((state) => ({
			fitExtraction: { ...state.fitExtraction, ...patch },
		})),
	setApertureSize: (size) => set({ apertureSize: size }),
	setGrismNorm: (patch) =>
		set((state) => ({ grismNorm: { ...state.grismNorm, ...patch } })),
	setExtractedSpecSortedArray: (array) => set({ extractedSpecSortedArray: array }),
	setNormInWindow: (inWindow) => set({ normInWindow: inWindow }),
	setForwardSourcePosition: (pos) => set({ forwardSourcePosition: pos }),
	setSpectrumQueryKey: (key) => set({ spectrumQueryKey: key }),
});
