import type { Spectrum1DCanvasFitModel, Spectrum1DCanvasPoint } from "../api";
import { sampleFitModelAtWavelength } from "./fitModelSampling";

export function subtractFitModelsFromPoint(
	point: Spectrum1DCanvasPoint,
	models: readonly Spectrum1DCanvasFitModel[],
): Spectrum1DCanvasPoint {
	const fluxOffset = models.reduce(
		(total, model) =>
			total + sampleFitModelAtWavelength(model, point.wavelengthUm).flux,
		0,
	);

	return {
		...point,
		flux: point.flux - fluxOffset,
	};
}

export function createSliceSpectrum(
	points: readonly Spectrum1DCanvasPoint[],
	startIndex: number,
	endIndex: number,
	modelsSubtracted: readonly Spectrum1DCanvasFitModel[],
): Spectrum1DCanvasPoint[] {
	if (points.length === 0 || endIndex < startIndex) {
		return [];
	}

	const slice = points.slice(startIndex, endIndex + 1);
	if (modelsSubtracted.length === 0) {
		return slice;
	}

	return slice.map((point) =>
		subtractFitModelsFromPoint(point, modelsSubtracted),
	);
}

export function getModelsSubtractedFromSlice(
	models: readonly Spectrum1DCanvasFitModel[],
): Spectrum1DCanvasFitModel[] {
	return models.filter((model) => model.active && model.subtractFromSlice);
}

export function getModelsDrawnOnSlice(
	models: readonly Spectrum1DCanvasFitModel[],
): Spectrum1DCanvasFitModel[] {
	return models.filter((model) => model.active && !model.subtractFromSlice);
}
