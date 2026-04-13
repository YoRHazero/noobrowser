import type {
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import {
	SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS,
	SPECTRUM_1D_CANVAS_MIN_FIT_SAMPLE_POINTS,
} from "../shared/constants";
import type { Spectrum1DCanvasSampledPoint } from "../shared/types";
import { sampleGaussianFlux } from "./sampleGaussianFlux";

export function sampleGaussianFitModel(
	model: Spectrum1DCanvasGaussianFitModel,
	range: Spectrum1DCanvasWaveRange,
	samplePoints = SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS,
): Spectrum1DCanvasSampledPoint[] {
	const count = Math.max(
		SPECTRUM_1D_CANVAS_MIN_FIT_SAMPLE_POINTS,
		Math.floor(samplePoints),
	);
	const sampled = new Array<Spectrum1DCanvasSampledPoint>(count);

	for (let index = 0; index < count; index++) {
		const t = index / (count - 1);
		const wavelengthUm = range.minUm + t * (range.maxUm - range.minUm);
		sampled[index] = {
			wavelengthUm,
			flux: sampleGaussianFlux(model, wavelengthUm),
		};
	}

	return sampled;
}
