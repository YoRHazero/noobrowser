import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";
import { sampleGaussianFlux } from "@/canvas/spectrum1dCanvas/utils/sampleGaussianFlux";
import { sampleLinearFlux } from "@/canvas/spectrum1dCanvas/utils/sampleLinearFlux";

export function sampleCombinedFitModelFlux(
	models: readonly Spectrum1DCanvasFitModel[],
	wavelengthUm: number,
): number {
	let flux = 0;

	for (const model of models) {
		flux +=
			model.kind === "linear"
				? sampleLinearFlux(model, wavelengthUm)
				: sampleGaussianFlux(model, wavelengthUm);
	}

	return flux;
}
