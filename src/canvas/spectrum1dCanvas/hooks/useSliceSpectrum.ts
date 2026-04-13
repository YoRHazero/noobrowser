import { useMemo } from "react";
import type { Spectrum1DCanvasFitModel, Spectrum1DCanvasPoint } from "../api";
import { subtractFitModelsFromPoint } from "../utils/subtractFitModelsFromPoint";

export function useSliceSpectrum({
	points,
	startIndex,
	endIndex,
	fitModels,
}: {
	points: readonly Spectrum1DCanvasPoint[];
	startIndex: number;
	endIndex: number;
	fitModels: readonly Spectrum1DCanvasFitModel[];
}) {
	const modelsSubtractedFromSlice = useMemo(
		() => fitModels.filter((model) => model.active && model.subtractFromSlice),
		[fitModels],
	);
	const modelsDrawnOnSlice = useMemo(
		() => fitModels.filter((model) => model.active && !model.subtractFromSlice),
		[fitModels],
	);
	const sliceSpectrum = useMemo(() => {
		if (points.length === 0 || endIndex < startIndex) {
			return [];
		}

		const slice = points.slice(startIndex, endIndex + 1);
		if (modelsSubtractedFromSlice.length === 0) {
			return slice;
		}

		return slice.map((point) =>
			subtractFitModelsFromPoint(point, modelsSubtractedFromSlice),
		);
	}, [endIndex, modelsSubtractedFromSlice, points, startIndex]);

	return {
		modelsDrawnOnSlice,
		modelsSubtractedFromSlice,
		sliceSpectrum,
	};
}
