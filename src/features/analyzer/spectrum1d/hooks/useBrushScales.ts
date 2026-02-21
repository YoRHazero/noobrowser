import { scaleLinear } from "d3-scale";
import { useMemo } from "react";

export function useBrushScales(params: {
	waveMin: number;
	waveMax: number;
	fluxMin: number;
	fluxMax: number;
	chartWidth: number;
	chartBrushHeight: number;
}) {
	const { waveMin, waveMax, fluxMin, fluxMax, chartWidth, chartBrushHeight } =
		params;
	const xScaleBrush = useMemo(() => {
		return scaleLinear().domain([waveMin, waveMax]).range([0, chartWidth]);
	}, [waveMin, waveMax, chartWidth]);
	const yScaleBrush = useMemo(() => {
		return scaleLinear()
			.domain([fluxMin, fluxMax])
			.range([chartBrushHeight, 0]);
	}, [fluxMin, fluxMax, chartBrushHeight]);
	return { xScaleBrush, yScaleBrush };
}
