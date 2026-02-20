import type { StateCreator } from "zustand";
import type { EmissionLine } from "@/types/common";
import { EMISSIONLINES } from "./constants";
import { generateEmissionLineId } from "@/utils/wavelength";
import type { AnalyzerState } from "./index";

export interface EmissionSlice {
	emissionLines: Record<string, EmissionLine>;
	selectedEmissionLines: Record<string, EmissionLine>;
	emissionMaskMode: "hidden" | "individual" | "total";
	emissionMaskThreshold: number;

	setEmissionLines: (lines: Record<string, EmissionLine>) => void;
	addEmissionLine: (name: string, wavelength: number) => void;
	removeEmissionLine: (id: string) => void;
	setSelectedEmissionLines: (lines: Record<string, EmissionLine>) => void;
	setEmissionMaskMode: (mode: "hidden" | "individual" | "total") => void;
	setEmissionMaskThreshold: (threshold: number) => void;
}

export const createEmissionSlice: StateCreator<
	AnalyzerState,
	[],
	[],
	EmissionSlice
> = (set) => ({
	emissionLines: { ...EMISSIONLINES },
	selectedEmissionLines: {},
	emissionMaskMode: "hidden",
	emissionMaskThreshold: 1.0,

	setEmissionLines: (lines) => set({ emissionLines: lines }),
	addEmissionLine: (name, wavelength) => {
		const newId = generateEmissionLineId(name, wavelength);
		const newLine = { id: newId, name, wavelength };
		set((state) => ({
			emissionLines: {
				...state.emissionLines,
				[newId]: newLine,
			},
		}));
	},
	removeEmissionLine: (id) => {
		set((state) => {
			const newLines = { ...state.emissionLines };
			delete newLines[id];
			const newSelected = { ...state.selectedEmissionLines };
			delete newSelected[id];
			return {
				emissionLines: newLines,
				selectedEmissionLines: newSelected,
			};
		});
	},
	setSelectedEmissionLines: (lines) =>
		set({ selectedEmissionLines: lines }),
	setEmissionMaskMode: (mode) => set({ emissionMaskMode: mode }),
	setEmissionMaskThreshold: (threshold) =>
		set({ emissionMaskThreshold: threshold }),
});
