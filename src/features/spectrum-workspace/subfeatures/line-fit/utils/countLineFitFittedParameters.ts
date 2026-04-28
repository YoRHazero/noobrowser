import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";

export function countLineFitFittedParameters(
	models: readonly Spectrum1DCanvasFitModel[],
): number {
	return models.reduce((count, model) => {
		if (!model.active) {
			return count;
		}

		return count + (model.kind === "gaussian" ? 3 : 2);
	}, 0);
}
