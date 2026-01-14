import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { FitModelType } from "@/stores/stores-types";

export function useFitHeader() {
	const { addModel, models, saveCurrentConfiguration, updateModel } =
		useFitStore(
			useShallow((state) => ({
				addModel: state.addModel,
				models: state.models,
				saveCurrentConfiguration: state.saveCurrentConfiguration,
				updateModel: state.updateModel,
			})),
		);

	const { slice1DWaveRange } = useGrismStore(
		useShallow((state) => ({
			slice1DWaveRange: state.slice1DWaveRange,
		})),
	);

	const [selectedType, setSelectedType] = useState<string[]>(["linear"]);
	const hasModels = models.length > 0;

	const handleAdd = useCallback(() => {
		const kind = (selectedType[0] as FitModelType) ?? "linear";
		addModel(kind, slice1DWaveRange);
	}, [addModel, selectedType, slice1DWaveRange]);

	const handleSync = useCallback(() => {
		if (!hasModels) return;

		models.forEach((model) => {
			if (model.kind === "gaussian") {
				const mu = (slice1DWaveRange.min + slice1DWaveRange.max) / 2;
				updateModel(model.id, { range: slice1DWaveRange, mu });
			} else if (model.kind === "linear") {
				const x0 = (slice1DWaveRange.min + slice1DWaveRange.max) / 2;
				updateModel(model.id, { range: slice1DWaveRange, x0 });
			}
		});

		toaster.success({
			title: "Models synced",
			description: "Updated to current slice window",
		});
	}, [hasModels, models, slice1DWaveRange, updateModel]);

	const handleSave = useCallback(() => {
		saveCurrentConfiguration();
		toaster.create({ title: "Configuration saved", type: "success" });
	}, [saveCurrentConfiguration]);

	return {
		selectedType,
		setSelectedType,
		handleAdd,
		handleSync,
		handleSave,
		hasModels,
	};
}
