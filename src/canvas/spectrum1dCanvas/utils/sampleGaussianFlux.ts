import type { Spectrum1DCanvasGaussianFitModel } from "../api";

export function sampleGaussianFlux(
	model: Spectrum1DCanvasGaussianFitModel,
	wavelengthUm: number,
): number {
	if (!Number.isFinite(model.sigmaUm) || model.sigmaUm === 0) {
		return 0;
	}

	const exponent = -0.5 * ((wavelengthUm - model.muUm) / model.sigmaUm) ** 2;
	return model.amplitude * Math.exp(exponent);
}
