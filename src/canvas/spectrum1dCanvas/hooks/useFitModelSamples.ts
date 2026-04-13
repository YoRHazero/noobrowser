import { useMemo } from "react";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import { SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS } from "../shared/constants";
import { sampleFitModel } from "../utils/sampleFitModel";

export function useFitModelSamples({
	models,
	viewRange,
	samplePoints = SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS,
}: {
	models: readonly Spectrum1DCanvasFitModel[];
	viewRange: Spectrum1DCanvasWaveRange;
	samplePoints?: number;
}) {
	return useMemo(
		() =>
			models
				.map((model) => ({
					model,
					points: sampleFitModel(model, viewRange, samplePoints),
				}))
				.filter((sample) => sample.points.length > 0),
		[models, samplePoints, viewRange],
	);
}
