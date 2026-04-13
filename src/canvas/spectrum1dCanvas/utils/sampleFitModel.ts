import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import { SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS } from "../shared/constants";
import type { Spectrum1DCanvasSampledPoint } from "../shared/types";
import { getOverlappedWaveRange } from "./getOverlappedWaveRange";
import { sampleGaussianFitModel } from "./sampleGaussianFitModel";
import { sampleLinearFitModel } from "./sampleLinearFitModel";

export function sampleFitModel(
	model: Spectrum1DCanvasFitModel,
	viewRange: Spectrum1DCanvasWaveRange,
	samplePoints = SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS,
): Spectrum1DCanvasSampledPoint[] {
	const range = getOverlappedWaveRange(model.range, viewRange);
	if (!range) {
		return [];
	}

	return model.kind === "linear"
		? sampleLinearFitModel(model, range)
		: sampleGaussianFitModel(model, range, samplePoints);
}
