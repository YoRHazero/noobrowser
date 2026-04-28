import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";

export function getNextFitModelId(
	models: readonly Spectrum1DCanvasFitModel[],
): number {
	return (
		models.reduce(
			(maxId, model) =>
				Number.isFinite(model.id) ? Math.max(maxId, model.id) : maxId,
			0,
		) + 1
	);
}
