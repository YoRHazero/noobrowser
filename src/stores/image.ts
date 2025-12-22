import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
	CollapseWindow,
	CounterpartPosition,
	CutoutParams,
	NormParams,
	RGBSet,
	WaveUnit,
	WaveRange,
	RoiState,
	XY,
} from "./stores-types.js";
import { clamp } from "@/utils/projection.js";
interface CounterpartState {
	availableFilters: string[];
	filterRGB: RGBSet;
	displayMode: "rgb" | "r" | "g" | "b";
	opacity: number;
	counterpartNorm: NormParams;
	cutoutParams: CutoutParams;
	cutoutNorm: NormParams;
	cutoutSortedArray: number[] | null;
	counterpartPosition: CounterpartPosition;
	showCutout: boolean;
	goToCutoutRequested: boolean;
	setAvailableFilters: (filters: string[]) => void;
	setFilterRGB: (patch: Partial<RGBSet>) => void;
	setDisplayMode: (mode: "rgb" | "r" | "g" | "b") => void;
	setOpacity: (opacity: number) => void;
	setCounterpartNorm: (params: Partial<NormParams>) => void;
	setCounterpartPosition: (patch: Partial<CounterpartPosition>) => void;
	setCutoutParams: (patch: Partial<CutoutParams>) => void;
	setCutoutNorm: (patch: Partial<NormParams>) => void;
	setCutoutSortedArray: (array: number[] | null) => void;
	setShowCutout: (show: boolean) => void;
	setGoToCutoutRequested: (requested: boolean) => void;
}

export const useCounterpartStore = create<CounterpartState>()((set) => ({
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
	showCutout: true,
	goToCutoutRequested: false,
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
		set((state) => ({ cutoutParams: { ...state.cutoutParams, ...patch } })),
	setCutoutNorm: (patch) =>
		set((state) => ({ cutoutNorm: { ...state.cutoutNorm, ...patch } })),
	setCutoutSortedArray: (array) => set({ cutoutSortedArray: array }),
	setShowCutout: (show) => set({ showCutout: show }),
	setGoToCutoutRequested: (requested) =>
		set({ goToCutoutRequested: requested }),
}));

interface GrismState {
	waveUnit: WaveUnit;
	apertureSize: number;
	zRedshift: number;
	grismNorm: NormParams;
	extractedSpecSortedArray: number[] | null;
	normInWindow: boolean;
	forwardSourcePosition: XY;
	forwardWaveRange: WaveRange;
	slice1DWaveRange: WaveRange;
	collapseWindow: CollapseWindow;
	emissionLines: Record<string, number>;
	selectedEmissionLines: Record<string, number>;
	showTraceOnSpectrum2D: boolean;
	backwardGlobalNorm: NormParams;
	backwardRoiNorm: NormParams;
	backwardNormIndependent: boolean;
	roiState: RoiState;
	roiCollapseWindow: CollapseWindow;
	counterpartVisible: boolean;
	setWaveUnit: (unit: WaveUnit) => void;
	setApertureSize: (size: number) => void;
	setZRedshift: (z: number) => void;
	setGrismNorm: (patch: Partial<NormParams>) => void;
	setExtractedSpecSortedArray: (array: number[] | null) => void;
	setNormInWindow: (inWindow: boolean) => void;
	setForwardSourcePosition: (pos: XY) => void;
	setForwardWaveRange: (patch: Partial<WaveRange>) => void;
	setSlice1DWaveRange: (patch: Partial<WaveRange>) => void;
	setCollapseWindow: (patch: Partial<CollapseWindow>) => void;
	setEmissionLines: (lines: Record<string, number>) => void;
	addEmissionLine: (name: string, wavelength: number) => void;
	removeEmissionLine: (name: string) => void;
	setSelectedEmissionLines: (lines: Record<string, number>) => void;
	switchShowTraceOnSpectrum2D: () => void;
	setBackwardGlobalNorm: (patch: Partial<NormParams>) => void;
	setBackwardRoiNorm: (patch: Partial<NormParams>) => void;
	setBackwardNormIndependent: (independent: boolean) => void;
	syncBackwardNorms: () => void;
	setRoiState: (patch: Partial<RoiState>) => void;
	setRoiCollapseWindow: (patch: Partial<CollapseWindow>) => void;
	setCounterpartVisible: (visible: boolean) => void;
}

export const useGrismStore = create<GrismState>()(
	persist(
		(set) => ({
			waveUnit: "µm",
			apertureSize: 100,
			zRedshift: 0.0,
			grismNorm: { pmin: 1, pmax: 99 },
			extractedSpecSortedArray: null,
			normInWindow: false,
			forwardSourcePosition: { x: 0, y: 0 },
			forwardWaveRange: { min: 3.8, max: 5.0 },
			slice1DWaveRange: { min: 3.8, max: 5.0 },
			collapseWindow: {
				waveMin: 3.8,
				waveMax: 5.0,
				spatialMin: 0,
				spatialMax: 100,
			},

			emissionLines: {
				// units in microns
				"H⍺": 0.6563,
				Hβ: 0.4861,
				"[OIII]λ4959": 0.4959,
				"[OIII]λ5007": 0.5007,
				Paβ: 1.2818,
			},
			selectedEmissionLines: {},
			showTraceOnSpectrum2D: true,
			backwardGlobalNorm: { pmin: 1, pmax: 99 },
			backwardRoiNorm: { pmin: 1, pmax: 99 },
			backwardNormIndependent: false,
			roiState: { x: 0, y: 0, width: 256, height: 128 },
			roiCollapseWindow: {
				waveMin: 0,
				waveMax: 256,
				spatialMin: 128/2 - 5,
				spatialMax: 128/2 + 5,
			},
			counterpartVisible: true,
			setWaveUnit: (unit) => set({ waveUnit: unit }),
			setApertureSize: (size) => set({ apertureSize: size }),
			setZRedshift: (z) => set({ zRedshift: z }),
			setGrismNorm: (patch) =>
				set((state) => ({ grismNorm: { ...state.grismNorm, ...patch } })),
			setExtractedSpecSortedArray: (array) =>
				set({ extractedSpecSortedArray: array }),
			setNormInWindow: (inWindow) => set({ normInWindow: inWindow }),
			setForwardSourcePosition: (pos) =>
				set({ forwardSourcePosition: pos }),
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
			setEmissionLines: (lines) => {
				const sortedLines = Object.fromEntries(
					Object.entries(lines).sort((a, b) => a[1] - b[1]),
				);
				set({ emissionLines: sortedLines });
			},
			addEmissionLine: (name, wavelength) => {
				set((state) => {
					const updatedLines = { ...state.emissionLines, [name]: wavelength };
					const sortedLines = Object.fromEntries(
						Object.entries(updatedLines).sort((a, b) => a[1] - b[1]),
					);
					return { emissionLines: sortedLines };
				});
			},
			removeEmissionLine: (name) => {
				set((state) => {
					const updatedLines = { ...state.emissionLines };
					delete updatedLines[name];
					const { [name]: _, ...restSelectedLines } =
						state.selectedEmissionLines;
					return {
						emissionLines: updatedLines,
						selectedEmissionLines: restSelectedLines,
					};
				});
			},
			setSelectedEmissionLines: (lines) =>
				set({ selectedEmissionLines: lines }),
			switchShowTraceOnSpectrum2D: () =>
				set((state) => ({
					showTraceOnSpectrum2D: !state.showTraceOnSpectrum2D,
				})),
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
			setCounterpartVisible: (visible) => set({ counterpartVisible: visible }),
		}),

		{
			name: "emission-lines-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				emissionLines: state.emissionLines,
				selectedEmissionLines: state.selectedEmissionLines,
			}),
		},
	),
);
