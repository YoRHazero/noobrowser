import { useMemo } from "react";
import { DEFAULT_HRATIO, DEFAULT_MARGIN } from "../constants";

export function useChartLayout(params: {
	width: number;
	height: number;
	hRatio?: { top: number; bottom: number; gap: number };
	margin?: { top: number; right: number; bottom: number; left: number };
}) {
	const { width, height, hRatio, margin } = params;
	return useMemo(() => {
		const ratio = hRatio ?? DEFAULT_HRATIO;
		const total = ratio.top + ratio.bottom + ratio.gap;
		const finalHRatio =
			total !== 1
				? {
						top: ratio.top / total,
						bottom: ratio.bottom / total,
						gap: ratio.gap / total,
					}
				: ratio;
		const finalMargin = margin ?? DEFAULT_MARGIN;

		const chartHeightTotal = height - finalMargin.top - finalMargin.bottom;
		const chartWidth = width - finalMargin.left - finalMargin.right;
		const chartHeightTop = chartHeightTotal * finalHRatio.top;
		const chartHeightBottom = chartHeightTotal * finalHRatio.bottom;
		const gapHeight = chartHeightTotal * finalHRatio.gap;
		const chartAnchorTop = { left: finalMargin.left, top: finalMargin.top };
		const chartAnchorBottom = {
			left: finalMargin.left,
			top: finalMargin.top + chartHeightTop + gapHeight,
		};
		return {
			chartWidth,
			chartHeightTop,
			chartHeightBottom,
			chartBrushHeight: chartHeightTop,
			chartHeightSlice: chartHeightBottom,
			chartAnchorTop,
			chartAnchorBottom,
		};
	}, [width, height, hRatio, margin]);
}
