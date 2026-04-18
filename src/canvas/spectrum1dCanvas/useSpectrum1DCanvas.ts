import { useMemo } from "react";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasLabelsModel,
	Spectrum1DCanvasProps,
	Spectrum1DCanvasVisibilityModel,
	Spectrum1DCanvasWaveRange,
} from "./api";
import {
	useFitModelSamples,
	useObservedEmissionLines,
	useResolvedSliceRange,
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

type ResolvedSpectrum1DCanvasActions = Omit<
	Spectrum1DCanvasActions,
	"setSliceRange"
> & {
	setSliceRange: (range: Spectrum1DCanvasWaveRange) => void;
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
	const dataRange = useMemo<Spectrum1DCanvasWaveRange>(
		() => ({
			minUm: spectrumStats.wavelengthMinUm,
			maxUm: spectrumStats.wavelengthMaxUm,
		}),
		[spectrumStats.wavelengthMaxUm, spectrumStats.wavelengthMinUm],
	);
	const { sliceRange, setSliceRange } = useResolvedSliceRange({
		dataRange,
		sliceRange: model.sliceRange,
		onSliceRangeChange: actions?.setSliceRange,
	});
	const resolvedActions = useMemo<ResolvedSpectrum1DCanvasActions>(
		() => ({
			setSliceRange,
			updateFitModel: actions?.updateFitModel,
			commitFitModelEdit: actions?.commitFitModelEdit,
		}),
		[actions?.commitFitModelEdit, actions?.updateFitModel, setSliceRange],
	);
	const sliceIndices = useSliceIndices(spectrumStats.wavelengthsUm, sliceRange);
	const slice = useSliceSpectrum({
		points: model.points,
		startIndex: sliceIndices.startIndex,
		endIndex: sliceIndices.endIndex,
		fitModels: model.fitModels,
	});
	const fitCurveSamples = useFitModelSamples({
		models: slice.modelsDrawnOnSlice,
		viewRange: sliceRange,
	});
	const observedEmissionLines = useObservedEmissionLines(
		model.emissionLines,
		model.display.redshift,
	);

	return {
		actions: resolvedActions,
		fitCurveSamples,
		labels: {
			...labels,
			wavelengthAxis: labels.wavelengthAxis || wavelengthDisplay.axisLabel,
		},
		observedEmissionLines,
		points: model.points,
		slice,
		sliceIndices,
		sliceRange,
		spectrumStats,
		visibility,
		wavelengthDisplay,
	};
}
