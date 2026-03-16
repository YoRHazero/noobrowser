import type { StateCreator } from "zustand";
import type { WaveUnit, WaveRange, WaveFrame, NormParams } from "@/types/common";
import type { CollapseWindow } from "@/stores/inspector/types";
import type { AnalyzerState } from "./index";

export interface SpectrumSlice {
	waveUnit: WaveUnit;
	zRedshift: number;
	forwardWaveRange: WaveRange;
	slice1DWaveRange: WaveRange;
	collapseWindow: CollapseWindow;
	showTraceOnSpectrum2D: boolean;
	
	// Viewing parameters moved from fitSlice
	waveFrame: WaveFrame;
	apertureSize: number;
	grismNorm: NormParams;
	extractedSpecSortedArray: number[] | null;
	normInWindow: boolean;
	spectrumQueryKey: Array<unknown> | null;

	setWaveUnit: (unit: WaveUnit) => void;
	setZRedshift: (z: number) => void;
	setForwardWaveRange: (patch: Partial<WaveRange>) => void;
	setSlice1DWaveRange: (patch: Partial<WaveRange>) => void;
	setCollapseWindow: (patch: Partial<CollapseWindow>) => void;
	switchShowTraceOnSpectrum2D: () => void;
	
	// Viewing setters moved from fitSlice
	setWaveFrame: (frame: WaveFrame) => void;
	setApertureSize: (size: number) => void;
	setGrismNorm: (patch: Partial<NormParams>) => void;
	setExtractedSpecSortedArray: (array: number[] | null) => void;
	setNormInWindow: (inWindow: boolean) => void;
	setSpectrumQueryKey: (key: Array<unknown> | null) => void;
}

export const createSpectrumSlice: StateCreator<AnalyzerState, [], [], SpectrumSlice> = (set) => ({
	waveUnit: "µm",
	zRedshift: 0,
	forwardWaveRange: { min: 3.8, max: 5.0 },
	slice1DWaveRange: { min: 3.8, max: 5.0 },
	collapseWindow: { waveMin: 3.8, waveMax: 5.0, spatialMin: 45, spatialMax: 54 },
	showTraceOnSpectrum2D: false,
	
	waveFrame: "observe",
	apertureSize: 100,
	grismNorm: { pmin: 5, pmax: 95 },
	extractedSpecSortedArray: null,
	normInWindow: false,
	spectrumQueryKey: null,

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
		
	setWaveFrame: (frame) => set({ waveFrame: frame }),
	setApertureSize: (size) => set({ apertureSize: size }),
	setGrismNorm: (patch) =>
		set((state) => ({ grismNorm: { ...state.grismNorm, ...patch } })),
	setExtractedSpecSortedArray: (array) => set({ extractedSpecSortedArray: array }),
	setNormInWindow: (inWindow) => set({ normInWindow: inWindow }),
	setSpectrumQueryKey: (key) => set({ spectrumQueryKey: key }),
});
