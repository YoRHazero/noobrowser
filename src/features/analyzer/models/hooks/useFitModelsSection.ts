import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAnalyzerStore } from "@/stores/analyzer";

export function useFitModelsSection() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { models, ensureInitialModels, slice1DWaveRange } = useAnalyzerStore(
		useShallow((state) => ({
			models: state.models,
			ensureInitialModels: state.ensureInitialModels,
			slice1DWaveRange: state.slice1DWaveRange,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {
		ensureInitialModels(slice1DWaveRange);
	}, [ensureInitialModels, slice1DWaveRange]);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		models,
	};
}
