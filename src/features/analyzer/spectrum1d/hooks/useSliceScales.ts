import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import type { Spectrum1D } from "@/utils/util-types";

export function useSliceScales(params: {
	sliceSpectrum: Spectrum1D[];
	sliceRange: { min: number; max: number };
	chartWidth: number;
	chartHeightSlice: number;
}) {
	const { sliceSpectrum, sliceRange, chartWidth, chartHeightSlice } = params;
	return useMemo(() => {
		const fluxMin = Math.min(...sliceSpectrum.map((d) => d.fluxMinusErr));
		const fluxMax = Math.max(...sliceSpectrum.map((d) => d.fluxPlusErr));
		const fluxPadding = (fluxMax - fluxMin) * 0.05;
		const xScaleSlice = scaleLinear()
			.domain([sliceRange.min, sliceRange.max])
			.range([0, chartWidth]);
		const yScaleSlice = scaleLinear()
			.domain([fluxMin - fluxPadding, fluxMax + fluxPadding])
			.range([chartHeightSlice, 0]);
		return { xScaleSlice, yScaleSlice };
	}, [sliceSpectrum, sliceRange, chartWidth, chartHeightSlice]);
}
