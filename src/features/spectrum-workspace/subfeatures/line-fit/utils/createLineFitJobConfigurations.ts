import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";
import type { FitConfiguration, FitPrior } from "@/hooks/query/fit/schemas";
import { createLineFitJobModel } from "./createLineFitJobModel";

function resolveUniqueConfigurationName(
	name: string,
	usedCounts: Map<string, number>,
): string {
	const baseName = name.trim() || "configuration";
	const currentCount = usedCounts.get(baseName) ?? 0;
	usedCounts.set(baseName, currentCount + 1);

	return currentCount === 0 ? baseName : `${baseName} (${currentCount + 1})`;
}

export function createLineFitJobConfigurations(
	configurations: readonly {
		id: string;
		name: string;
		models: readonly Spectrum1DCanvasFitModel[];
		priorsByModelId?: Record<number, Partial<Record<string, FitPrior>>>;
	}[],
	selectedConfigurationIds: readonly string[],
): FitConfiguration[] {
	const selectedConfigurationIdSet = new Set(selectedConfigurationIds);
	const usedNames = new Map<string, number>();

	return configurations
		.filter((configuration) => selectedConfigurationIdSet.has(configuration.id))
		.map((configuration) => ({
			model_name: resolveUniqueConfigurationName(configuration.name, usedNames),
			models: configuration.models.map((model) =>
				createLineFitJobModel(model, configuration.priorsByModelId?.[model.id]),
			),
		}));
}
