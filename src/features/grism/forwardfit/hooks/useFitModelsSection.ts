import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";

export function useFitModelsSection() {
	const { models, ensureInitialModels } = useFitStore(
		useShallow((state) => ({
			models: state.models,
			ensureInitialModels: state.ensureInitialModels,
		})),
	);

	const { slice1DWaveRange } = useGrismStore(
		useShallow((state) => ({
			slice1DWaveRange: state.slice1DWaveRange,
		})),
	);

	useEffect(() => {
		ensureInitialModels(slice1DWaveRange);
	}, [ensureInitialModels, slice1DWaveRange]);

	return {
		models,
	};
}
