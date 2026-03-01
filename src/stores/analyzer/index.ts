import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ModelsSlice, createModelsSlice } from "./modelsSlice";
import { type ConfigSlice, createConfigSlice } from "./configSlice";
import { type FitSlice, createFitSlice } from "./fitSlice";
import { type SpectrumSlice, createSpectrumSlice } from "./spectrumSlice";
import { type EmissionSlice, createEmissionSlice } from "./emissionSlice";
import { type UiSlice, createUiSlice } from "./uiSlice";

export type AnalyzerState = ModelsSlice &
	ConfigSlice &
	FitSlice &
	SpectrumSlice &
	EmissionSlice &
	UiSlice;

export const useAnalyzerStore = create<AnalyzerState>()(
	persist(
		(...a) => ({
			...createModelsSlice(...a),
			...createConfigSlice(...a),
			...createFitSlice(...a),
			...createSpectrumSlice(...a),
			...createEmissionSlice(...a),
			...createUiSlice(...a),
		}),
		{
			name: "noobrowser-analyzer-store",
			partialize: (state) => ({
				configurations: state.configurations,
				tags: state.tags,
				emissionLines: state.emissionLines,
				selectedEmissionLines: state.selectedEmissionLines,
			}),
		}
	)
);
