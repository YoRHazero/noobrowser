import type { StateCreator } from "zustand";
import type { WaveUnit, WaveRange } from "@/types/common";
import type { CollapseWindow } from "@/stores/inspector/types";
import type { AnalyzerState } from "./index";

export interface SpectrumSlice {
	waveUnit: WaveUnit;
	zRedshift: number;
	forwardWaveRange: WaveRange;
	slice1DWaveRange: WaveRange;
	collapseWindow: CollapseWindow;
	showTraceOnSpectrum2D: boolean;

	setWaveUnit: (unit: WaveUnit) => void;
	setZRedshift: (z: number) => void;
	setForwardWaveRange: (patch: Partial<WaveRange>) => void;
	setSlice1DWaveRange: (patch: Partial<WaveRange>) => void;
	setCollapseWindow: (patch: Partial<CollapseWindow>) => void;
	switchShowTraceOnSpectrum2D: () => void;
}

export const createSpectrumSlice: StateCreator<AnalyzerState, [], [], SpectrumSlice> = (set) => ({
	waveUnit: "µm",
	zRedshift: 0,
	forwardWaveRange: { min: 0, max: 1 },
	slice1DWaveRange: { min: 0, max: 1 },
	collapseWindow: { waveMin: 0, waveMax: 1, spatialMin: 0, spatialMax: 1 },
	showTraceOnSpectrum2D: false,

	setWaveUnit: (unit) => set({ waveUnit: unit }),
	setZRedshift: (z) => set({ zRedshift: z }),
	setForwardWaveRange: (patch) =>
		set((state) => ({
			forwardWaveRange: { ...state.forwardWaveRange, ...patch },
		})),
	setSlice1DWaveRange: (patch) =>
		set((state) => ({
			slice1DWaveRange: { ...state.slice1DWaveRange, ...patch },
		})),
	setCollapseWindow: (patch) =>
		set((state) => ({
			collapseWindow: { ...state.collapseWindow, ...patch },
		})),
	switchShowTraceOnSpectrum2D: () =>
		set((state) => ({
			showTraceOnSpectrum2D: !state.showTraceOnSpectrum2D,
		})),
});
