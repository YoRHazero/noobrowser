import type { ScaleLinear } from "d3-scale";
import { type PointerEvent, useCallback } from "react";
import type { Spectrum1DCanvasPoint } from "../api";
import { useSpectrum1DCanvasInteractionStore } from "../store/interactionStore";
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
	const hoverData = useSpectrum1DCanvasInteractionStore(
		(state) => state.hoverData,
	);
	const setHoverData = useSpectrum1DCanvasInteractionStore(
		(state) => state.setHoverData,
	);
	const clearHoverData = useSpectrum1DCanvasInteractionStore(
		(state) => state.clearHoverData,
	);
	const clearHover = useCallback(() => {
		clearHoverData();
	}, [clearHoverData]);
	const handlePointerMove = useCallback(
		(event: PointerEvent<SVGRectElement>) => {
			if (points.length === 0) {
				clearHoverData();
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
				clearHoverData();
				return;
			}

			const wavelengthUm = xScale.invert(pointer.x);
			const nearest = findNearestSpectrumPoint(points, wavelengthUm);
			if (!nearest) {
				clearHoverData();
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
		[clearHoverData, height, points, setHoverData, width, xScale, yScale],
	);

	return {
		clearHover,
		handlePointerLeave: clearHover,
		handlePointerMove,
		hoverData,
	};
}
