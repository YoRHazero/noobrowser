import type {
	Spectrum1DCanvasHeightRatio,
	Spectrum1DCanvasMargin,
} from "../api";
import {
	SPECTRUM_1D_CANVAS_DEFAULT_HEIGHT_RATIO,
	SPECTRUM_1D_CANVAS_DEFAULT_MARGIN,
} from "../shared/constants";
import type { ChartSize, Spectrum1DCanvasChartLayout } from "../shared/types";

export interface ResolveChartLayoutParams extends ChartSize {
	margin?: Spectrum1DCanvasMargin;
	heightRatio?: Spectrum1DCanvasHeightRatio;
}

export function resolveChartLayout({
	width,
	height,
	margin = SPECTRUM_1D_CANVAS_DEFAULT_MARGIN,
	heightRatio = SPECTRUM_1D_CANVAS_DEFAULT_HEIGHT_RATIO,
}: ResolveChartLayoutParams): Spectrum1DCanvasChartLayout {
	const normalizedRatio = normalizeHeightRatio(heightRatio);
	const chartWidth = Math.max(0, width - margin.left - margin.right);
	const availableHeight = Math.max(0, height - margin.top - margin.bottom);
	const overviewHeight = availableHeight * normalizedRatio.overview;
	const sliceHeight = availableHeight * normalizedRatio.slice;
	const gapHeight = availableHeight * normalizedRatio.gap;

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
		heightRatio: normalizedRatio,
	};
}

export function normalizeHeightRatio(
	ratio: Spectrum1DCanvasHeightRatio,
): Spectrum1DCanvasHeightRatio {
	const total = ratio.overview + ratio.slice + ratio.gap;
	if (total <= 0 || !Number.isFinite(total)) {
		return SPECTRUM_1D_CANVAS_DEFAULT_HEIGHT_RATIO;
	}

	return {
		overview: ratio.overview / total,
		slice: ratio.slice / total,
		gap: ratio.gap / total,
	};
}
