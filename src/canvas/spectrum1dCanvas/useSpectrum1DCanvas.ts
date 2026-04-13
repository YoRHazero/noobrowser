import { useMemo } from "react";
import type {
	Spectrum1DCanvasLabelsModel,
	Spectrum1DCanvasProps,
	Spectrum1DCanvasVisibilityModel,
} from "./api";
import {
	useFitModelSamples,
	useObservedEmissionLines,
	useSliceIndices,
	useSliceSpectrum,
	useSpectrumStats,
	useWavelengthDisplay,
} from "./hooks";

const DEFAULT_VISIBILITY: Required<Spectrum1DCanvasVisibilityModel> = {
	overview: true,
	brush: true,
	slice: true,
	errorBand: true,
	emissionLines: true,
	fitCurves: true,
	fitHandles: true,
	hover: true,
};

export function useSpectrum1DCanvas({ model, actions }: Spectrum1DCanvasProps) {
	const visibility = useMemo(
		() => ({
			...DEFAULT_VISIBILITY,
			...model.visibility,
		}),
		[model.visibility],
	);
	const labels = useMemo(
		(): Required<Spectrum1DCanvasLabelsModel> => ({
			accessibilityLabel:
				model.labels?.accessibilityLabel ?? "1D spectrum canvas",
			fluxAxis: model.labels?.fluxAxis ?? "Flux",
			wavelengthAxis: model.labels?.wavelengthAxis ?? "",
		}),
		[model.labels],
	);
	const wavelengthDisplay = useWavelengthDisplay(
		model.display,
		labels.wavelengthAxis || undefined,
	);
	const spectrumStats = useSpectrumStats(model.points);
	const sliceIndices = useSliceIndices(
		spectrumStats.wavelengthsUm,
		model.sliceRange,
	);
	const slice = useSliceSpectrum({
		points: model.points,
		startIndex: sliceIndices.startIndex,
		endIndex: sliceIndices.endIndex,
		fitModels: model.fitModels,
	});
	const fitCurveSamples = useFitModelSamples({
		models: slice.modelsDrawnOnSlice,
		viewRange: model.sliceRange,
	});
	const observedEmissionLines = useObservedEmissionLines(
		model.emissionLines,
		model.display.redshift,
	);

	return {
		actions,
		fitCurveSamples,
		labels: {
			...labels,
			wavelengthAxis: labels.wavelengthAxis || wavelengthDisplay.axisLabel,
		},
		observedEmissionLines,
		points: model.points,
		slice,
		sliceIndices,
		sliceRange: model.sliceRange,
		spectrumStats,
		visibility,
		wavelengthDisplay,
	};
}
