import type { ScaleLinear } from "d3-scale";
import { type PointerEvent, useCallback, useState } from "react";
import type { Spectrum1DCanvasPoint } from "../api";
import type { Spectrum1DCanvasTooltipData } from "../shared/types";
import { findNearestSpectrumPoint } from "../utils/findNearestSpectrumPoint";

export function usePointerHover({
	points,
	width,
	height,
	xScale,
	yScale,
}: {
	points: readonly Spectrum1DCanvasPoint[];
	width: number;
	height: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
}) {
	const [hoverData, setHoverData] =
		useState<Spectrum1DCanvasTooltipData | null>(null);
	const clearHover = useCallback(() => {
		setHoverData(null);
	}, []);
	const handlePointerMove = useCallback(
		(event: PointerEvent<SVGRectElement>) => {
			if (points.length === 0) {
				setHoverData(null);
				return;
			}

			const bounds = event.currentTarget.getBoundingClientRect();
			const pointer = {
				x: event.clientX - bounds.left,
				y: event.clientY - bounds.top,
			};
			if (
				pointer.x < 0 ||
				pointer.x > width ||
				pointer.y < 0 ||
				pointer.y > height
			) {
				setHoverData(null);
				return;
			}

			const wavelengthUm = xScale.invert(pointer.x);
			const nearest = findNearestSpectrumPoint(points, wavelengthUm);
			if (!nearest) {
				setHoverData(null);
				return;
			}

			setHoverData({
				point: nearest.point,
				axis: {
					x: xScale(nearest.point.wavelengthUm),
					y: yScale(nearest.point.flux),
				},
				pointer,
			});
		},
		[height, points, width, xScale, yScale],
	);

	return {
		clearHover,
		handlePointerLeave: clearHover,
		handlePointerMove,
		hoverData,
	};
}
