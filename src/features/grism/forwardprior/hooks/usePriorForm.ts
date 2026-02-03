import type { FitModel, FitPrior, PriorType } from "@/stores/stores-types";
import { getModelParamValue } from "@/stores/stores-utils";
import { SIGMA_TO_FWHM, SPEED_OF_LIGHT_KM_S } from "@/utils/wavelength";
import { useCallback, useMemo, useState } from "react";

interface UsePriorFormProps {
	modelId: number;
	paramName: string;
	allModels: FitModel[];
	config: FitPrior | undefined;
	onChange: (newConfig: FitPrior | undefined) => void;
}

export function usePriorForm({
	modelId,
	paramName,
	allModels,
	config,
	onChange,
}: UsePriorFormProps) {
	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [useVelocity, setUseVelocity] = useState(true);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const currentModel = allModels.find((m) => m.id === modelId);

	const canUseVelocity =
		currentModel?.kind === "gaussian" && paramName === "sigma";

	const conversionFactor = useMemo(() => {
		if (!canUseVelocity || !currentModel || currentModel.kind !== "gaussian")
			return 1;
		const centerLambda = currentModel.mu > 0 ? currentModel.mu : 1;
		return (SIGMA_TO_FWHM * SPEED_OF_LIGHT_KM_S) / centerLambda;
	}, [canUseVelocity, currentModel]);

	const displayConfig = useMemo(() => {
		if (!config) return undefined;
		if (!useVelocity || conversionFactor === 1) return config;

		const cloned = structuredClone(config);
		if ("mu" in cloned) cloned.mu *= conversionFactor;
		if ("sigma" in cloned) cloned.sigma *= conversionFactor;
		if ("value" in cloned) cloned.value *= conversionFactor;
		if ("lower" in cloned && cloned.lower !== undefined)
			cloned.lower *= conversionFactor;
		if ("upper" in cloned && cloned.upper !== undefined)
			cloned.upper *= conversionFactor;
		return cloned;
	}, [config, useVelocity, conversionFactor]);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleFormChange = useCallback(
		(newConfig: FitPrior) => {
			if (!useVelocity || conversionFactor === 1) {
				onChange(newConfig);
				return;
			}
			const cloned = structuredClone(newConfig);
			if ("mu" in cloned) cloned.mu /= conversionFactor;
			if ("sigma" in cloned) cloned.sigma /= conversionFactor;
			if ("value" in cloned) cloned.value /= conversionFactor;
			if ("lower" in cloned && cloned.lower !== undefined)
				cloned.lower /= conversionFactor;
			if ("upper" in cloned && cloned.upper !== undefined)
				cloned.upper /= conversionFactor;

			onChange(cloned);
		},
		[useVelocity, conversionFactor, onChange],
	);

	const handleTypeChange = (newTypeStr: string) => {
		const currentTabValue = config?.type ?? "Default";
		if (newTypeStr === currentTabValue) return;
		if (newTypeStr === "Default") {
			onChange(undefined);
			return;
		}

		if (!currentModel) return;

		let centerVal = 0;
		const sourceConfig = displayConfig;
		if (!sourceConfig) {
			const rawVal = getModelParamValue(currentModel, paramName) ?? 0;
			centerVal = useVelocity ? rawVal * conversionFactor : rawVal;
		} else {
			if ("value" in sourceConfig) centerVal = sourceConfig.value;
			else if ("mu" in sourceConfig) centerVal = sourceConfig.mu;
			else if (
				"lower" in sourceConfig &&
				"upper" in sourceConfig &&
				sourceConfig.lower !== undefined &&
				sourceConfig.upper !== undefined
			)
				centerVal = (sourceConfig.lower + sourceConfig.upper) / 2;
		}

		const newType = newTypeStr as PriorType;
		let newDisplayConfig: FitPrior;

		switch (newType) {
			case "Fixed":
				newDisplayConfig = { type: "Fixed", value: centerVal };
				break;
			case "Normal":
				newDisplayConfig = {
					type: "Normal",
					mu: centerVal,
					sigma: Math.abs(centerVal) * 0.1 || 1,
				};
				break;
			case "TruncatedNormal":
				newDisplayConfig = {
					type: "TruncatedNormal",
					mu: centerVal,
					sigma: Math.abs(centerVal) * 0.1 || 1,
					lower: undefined,
					upper: undefined,
				};
				break;
			case "Uniform": {
				const range = Math.abs(centerVal) * 0.1 || 1;
				newDisplayConfig = {
					type: "Uniform",
					lower: centerVal - range,
					upper: centerVal + range,
				};
				break;
			}
			case "Deterministic": {
				const otherModel = allModels.find((m) => m.id !== modelId);
				newDisplayConfig = {
					type: "Deterministic",
					mode: "add",
					value: 0,
					refModelId: otherModel ? otherModel.id : -1,
				};
				break;
			}
			default:
				return;
		}
		handleFormChange(newDisplayConfig);
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		displayConfig,
		useVelocity,
		canUseVelocity,
		setUseVelocity,
		handleTypeChange,
		handleFormChange,
	};
}
