import type { Spectrum1DCanvasLinearFitModel } from "../api";

export function sampleLinearFlux(
	model: Spectrum1DCanvasLinearFitModel,
	wavelengthUm: number,
): number {
	return model.k * (wavelengthUm - model.x0Um) + model.b;
}
