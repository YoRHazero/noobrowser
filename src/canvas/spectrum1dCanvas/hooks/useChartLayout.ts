import { useMemo } from "react";
import type { Spectrum1DCanvasLayoutModel } from "../api";
import {
	SPECTRUM_1D_CANVAS_DEFAULT_HEIGHT_RATIO,
	SPECTRUM_1D_CANVAS_DEFAULT_MARGIN,
} from "../shared/constants";
import type { ChartSize, Spectrum1DCanvasChartLayout } from "../shared/types";

export function useChartLayout(
	size: ChartSize,
	layout?: Spectrum1DCanvasLayoutModel,
): Spectrum1DCanvasChartLayout {
	return useMemo(() => {
		const margin = layout?.margin ?? SPECTRUM_1D_CANVAS_DEFAULT_MARGIN;
		const ratio =
			layout?.heightRatio ?? SPECTRUM_1D_CANVAS_DEFAULT_HEIGHT_RATIO;
		const ratioTotal = ratio.overview + ratio.slice + ratio.gap;
		const heightRatio =
			ratioTotal > 0 && Number.isFinite(ratioTotal)
				? {
						overview: ratio.overview / ratioTotal,
						slice: ratio.slice / ratioTotal,
						gap: ratio.gap / ratioTotal,
					}
				: SPECTRUM_1D_CANVAS_DEFAULT_HEIGHT_RATIO;
		const chartWidth = Math.max(0, size.width - margin.left - margin.right);
		const availableHeight = Math.max(
			0,
			size.height - margin.top - margin.bottom,
		);
		const overviewHeight = availableHeight * heightRatio.overview;
		const sliceHeight = availableHeight * heightRatio.slice;
		const gapHeight = availableHeight * heightRatio.gap;

		return {
			chartWidth,
			overviewHeight,
			brushHeight: overviewHeight,
			sliceHeight,
			overviewAnchor: {
				left: margin.left,
				top: margin.top,
			},
			sliceAnchor: {
				left: margin.left,
				top: margin.top + overviewHeight + gapHeight,
			},
			margin,
			heightRatio,
		};
	}, [layout, size]);
}
