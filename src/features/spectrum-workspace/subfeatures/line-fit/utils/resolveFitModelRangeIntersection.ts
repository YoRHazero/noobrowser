import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";

export function resolveFitModelRangeIntersection(
	models: readonly Spectrum1DCanvasFitModel[],
): Spectrum1DCanvasWaveRange | null {
	if (models.length === 0) {
		return null;
	}

	let minUm = Number.NEGATIVE_INFINITY;
	let maxUm = Number.POSITIVE_INFINITY;

	for (const model of models) {
		const rangeMinUm = Math.min(model.range.minUm, model.range.maxUm);
		const rangeMaxUm = Math.max(model.range.minUm, model.range.maxUm);
		if (!Number.isFinite(rangeMinUm) || !Number.isFinite(rangeMaxUm)) {
			return null;
		}

		minUm = Math.max(minUm, rangeMinUm);
		maxUm = Math.min(maxUm, rangeMaxUm);
	}

	if (!Number.isFinite(minUm) || !Number.isFinite(maxUm) || minUm >= maxUm) {
		return null;
	}

	return { minUm, maxUm };
}
