import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import type { Spectrum1DCanvasPoint, Spectrum1DCanvasWaveRange } from "../api";
import { SPECTRUM_1D_CANVAS_FLUX_PADDING_RATIO } from "../shared/constants";
import type { Spectrum1DCanvasChartLayout } from "../shared/types";
import { getFluxLowerBound } from "../utils/getFluxLowerBound";
import { getFluxUpperBound } from "../utils/getFluxUpperBound";
import { normalizeWaveRange } from "../utils/normalizeWaveRange";

export function useSliceScales({
	sliceSpectrum,
	sliceRange,
	layout,
}: {
	sliceSpectrum: readonly Spectrum1DCanvasPoint[];
	sliceRange: Spectrum1DCanvasWaveRange;
	layout: Spectrum1DCanvasChartLayout;
}) {
	return useMemo(() => {
		const normalizedSliceRange = normalizeWaveRange(sliceRange);
		const wavelengthSpan =
			normalizedSliceRange.maxUm - normalizedSliceRange.minUm;
		const wavelengthPadding = wavelengthSpan > 0 ? 0 : 0.5;
		let fluxMin = Infinity;
		let fluxMax = -Infinity;

		for (const point of sliceSpectrum) {
			fluxMin = Math.min(fluxMin, getFluxLowerBound(point));
			fluxMax = Math.max(fluxMax, getFluxUpperBound(point));
		}

		if (!Number.isFinite(fluxMin) || !Number.isFinite(fluxMax)) {
			fluxMin = 0;
			fluxMax = 1;
		}

		const fluxSpan = fluxMax - fluxMin;
		const fluxPadding =
			fluxSpan > 0 ? fluxSpan * SPECTRUM_1D_CANVAS_FLUX_PADDING_RATIO : 0.5;
		const xScale = scaleLinear()
			.domain([
				normalizedSliceRange.minUm - wavelengthPadding,
				normalizedSliceRange.maxUm + wavelengthPadding,
			])
			.range([0, layout.chartWidth]);
		const yScale = scaleLinear()
			.domain([fluxMin - fluxPadding, fluxMax + fluxPadding])
			.range([layout.sliceHeight, 0]);

		return { xScale, yScale };
	}, [layout, sliceRange, sliceSpectrum]);
}
