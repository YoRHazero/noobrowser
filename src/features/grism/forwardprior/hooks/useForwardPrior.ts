import { useFitStore } from "@/stores/fit";
import type { FitModel, FitPrior } from "@/stores/stores-types";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

interface UseForwardPriorProps {
	configId?: string | null;
	propModels?: FitModel[];
	propOnUpdatePrior?: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
}

export function useForwardPrior({
	configId,
	propModels,
	propOnUpdatePrior,
}: UseForwardPriorProps) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const storeConfig = useFitStore(
		useShallow((s) =>
			configId ? s.configurations.find((c) => c.id === configId) : undefined,
		),
	);
	const storeUpdateConfigurationModelPrior = useFitStore(
		(s) => s.updateConfigurationModelPrior,
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
	const [selectedParam, setSelectedParam] = useState<string | null>(null);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	// Priority: Store Config > Props Config
	const activeModels = configId ? storeConfig?.models : propModels;

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleUpdatePrior = (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => {
		if (configId) {
			storeUpdateConfigurationModelPrior(
				configId,
				modelId,
				paramName,
				newPrior,
			);
		} else if (propOnUpdatePrior) {
			propOnUpdatePrior(modelId, paramName, newPrior);
		}
	};

	const handleSelectModel = (id: number) => {
		setSelectedModelId(id);
		setSelectedParam(null);
	};

	const handleSelectParam = (param: string) => {
		setSelectedParam(param);
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		activeModels,
		selectedModelId,
		selectedParam,
		handleUpdatePrior,
		handleSelectModel,
		handleSelectParam,
	};
}
