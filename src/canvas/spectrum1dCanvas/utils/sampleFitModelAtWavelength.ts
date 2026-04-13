import type { Spectrum1DCanvasFitModel } from "../api";
import type { Spectrum1DCanvasSampledPoint } from "../shared/types";
import { sampleGaussianFlux } from "./sampleGaussianFlux";
import { sampleLinearFlux } from "./sampleLinearFlux";

export function sampleFitModelAtWavelength(
	model: Spectrum1DCanvasFitModel,
	wavelengthUm: number,
): Spectrum1DCanvasSampledPoint {
	return {
		wavelengthUm,
		flux:
			model.kind === "linear"
				? sampleLinearFlux(model, wavelengthUm)
				: sampleGaussianFlux(model, wavelengthUm),
	};
}
