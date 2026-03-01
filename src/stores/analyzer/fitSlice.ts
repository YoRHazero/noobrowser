import type { StateCreator } from "zustand";
import type { FitExtractionSettings } from "./types";
import type { XY } from "@/types/common";
import type { AnalyzerState } from "./index";

export interface FitSlice {
	fitExtraction: FitExtractionSettings;
	forwardSourcePosition: XY;

	setFitExtraction: (patch: Partial<FitExtractionSettings>) => void;
	setForwardSourcePosition: (pos: XY) => void;
}

export const createFitSlice: StateCreator<AnalyzerState, [], [], FitSlice> = (set) => ({
	fitExtraction: {
		apertureSize: 5,
		offset: 0,
		extractMode: "GRISMR",
	},
	forwardSourcePosition: { x: 0, y: 0 },

	setFitExtraction: (patch) =>
		set((state) => ({
			fitExtraction: { ...state.fitExtraction, ...patch },
		})),
	setForwardSourcePosition: (pos) => set({ forwardSourcePosition: pos }),
});
