import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import { SPECTRUM_1D_CANVAS_FLUX_PADDING_RATIO } from "../shared/constants";
import type {
	Spectrum1DCanvasChartLayout,
	Spectrum1DCanvasSpectrumStats,
} from "../shared/types";

export function useOverviewScales(
	spectrumStats: Spectrum1DCanvasSpectrumStats,
	layout: Spectrum1DCanvasChartLayout,
) {
	return useMemo(() => {
		const wavelengthSpan =
			spectrumStats.wavelengthMaxUm - spectrumStats.wavelengthMinUm;
		const wavelengthPadding = wavelengthSpan > 0 ? 0 : 0.5;
		const fluxSpan = spectrumStats.fluxMax - spectrumStats.fluxMin;
		const fluxPadding =
			fluxSpan > 0 ? fluxSpan * SPECTRUM_1D_CANVAS_FLUX_PADDING_RATIO : 0.5;

		const xScale = scaleLinear()
			.domain([
				spectrumStats.wavelengthMinUm - wavelengthPadding,
				spectrumStats.wavelengthMaxUm + wavelengthPadding,
			])
			.range([0, layout.chartWidth]);
		const yScale = scaleLinear()
			.domain([
				spectrumStats.fluxMin - fluxPadding,
				spectrumStats.fluxMax + fluxPadding,
			])
			.range([layout.overviewHeight, 0]);

		return { xScale, yScale };
	}, [layout, spectrumStats]);
}
