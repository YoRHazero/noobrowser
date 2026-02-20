import type { NormParams } from "@/types/common";
import type { RoiState, CollapseWindow } from "./types";
import type { StateCreator } from "zustand";
import type { InspectorState } from "./index";

export interface FrameSlice {
	backwardGlobalNorm: NormParams;
	backwardRoiNorm: NormParams;
	backwardNormIndependent: boolean;
	roiState: RoiState;
	roiCollapseWindow: CollapseWindow;

	setBackwardGlobalNorm: (patch: Partial<NormParams>) => void;
	setBackwardRoiNorm: (patch: Partial<NormParams>) => void;
	setBackwardNormIndependent: (independent: boolean) => void;
	syncBackwardNorms: () => void;
	setRoiState: (patch: Partial<RoiState>) => void;
	setRoiCollapseWindow: (patch: Partial<CollapseWindow>) => void;
}

export const createFrameSlice: StateCreator<InspectorState, [], [], FrameSlice> = (set) => ({
	backwardGlobalNorm: { pmin: 1, pmax: 99 },
	backwardRoiNorm: { pmin: 1, pmax: 99 },
	backwardNormIndependent: false,
	roiState: { x: 0, y: 0, width: 256, height: 128 },
	roiCollapseWindow: {
		waveMin: 0,
		waveMax: 256,
		spatialMin: 128 / 2 - 5,
		spatialMax: 128 / 2 + 5,
	},

	setBackwardGlobalNorm: (patch) =>
		set((state) => ({
			backwardGlobalNorm: { ...state.backwardGlobalNorm, ...patch },
		})),
	setBackwardRoiNorm: (patch) =>
		set((state) => ({
			backwardRoiNorm: { ...state.backwardRoiNorm, ...patch },
		})),
	setBackwardNormIndependent: (independent) =>
		set({ backwardNormIndependent: independent }),
	syncBackwardNorms: () =>
		set((state) => ({
			backwardRoiNorm: { ...state.backwardGlobalNorm },
		})),
	setRoiState: (patch) =>
		set((state) => ({
			roiState: { ...state.roiState, ...patch },
		})),
	setRoiCollapseWindow: (patch) =>
		set((state) => ({
			roiCollapseWindow: { ...state.roiCollapseWindow, ...patch },
		})),
});
