import type { Spectrum1DCanvasFitModel, Spectrum1DCanvasPoint } from "../api";
import { sampleFitModelAtWavelength } from "./sampleFitModelAtWavelength";

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
