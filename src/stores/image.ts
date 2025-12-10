import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
	CollapseWindow,
	CounterpartPosition,
	CutoutParams,
	NormParams,
	rgbSet,
	WaveUnit,
	waveRange,
} from "./stores-types.js";

interface CounterpartState {
	availableFilters: string[];
	filterRGB: rgbSet;
	counterpartNorm: NormParams;
	cutoutParams: CutoutParams;
	cutoutNorm: NormParams;
	cutoutSortedArray: number[] | null;
	counterpartPosition: CounterpartPosition;
	showCutout: boolean;
	goToCutoutRequested: boolean;
	setAvailableFilters: (filters: string[]) => void;
	setFilterRGB: (patch: Partial<rgbSet>) => void;
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
	forwardWaveRange: waveRange;
	slice1DWaveRange: waveRange;
	collapseWindow: CollapseWindow;
	emissionLines: Record<string, number>;
	selectedEmissionLines: Record<string, number>;
	showTraceOnSpectrum2D: boolean;
	setWaveUnit: (unit: WaveUnit) => void;
	setApertureSize: (size: number) => void;
	setZRedshift: (z: number) => void;
	setGrismNorm: (patch: Partial<NormParams>) => void;
	setExtractedSpecSortedArray: (array: number[] | null) => void;
	setNormInWindow: (inWindow: boolean) => void;
	setForwardWaveRange: (patch: Partial<waveRange>) => void;
	setSlice1DWaveRange: (patch: Partial<waveRange>) => void;
	setCollapseWindow: (patch: Partial<CollapseWindow>) => void;
	setEmissionLines: (lines: Record<string, number>) => void;
	addEmissionLine: (name: string, wavelength: number) => void;
	removeEmissionLine: (name: string) => void;
	setSelectedEmissionLines: (lines: Record<string, number>) => void;
	switchShowTraceOnSpectrum2D: () => void;
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
				"[OIII]λ5007": 0.5007,
				Paβ: 1.2818,
			},
			selectedEmissionLines: {},
			showTraceOnSpectrum2D: true,
			setWaveUnit: (unit) => set({ waveUnit: unit }),
			setApertureSize: (size) => set({ apertureSize: size }),
			setZRedshift: (z) => set({ zRedshift: z }),
			setGrismNorm: (patch) =>
				set((state) => ({ grismNorm: { ...state.grismNorm, ...patch } })),
			setExtractedSpecSortedArray: (array) =>
				set({ extractedSpecSortedArray: array }),
			setNormInWindow: (inWindow) => set({ normInWindow: inWindow }),
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
