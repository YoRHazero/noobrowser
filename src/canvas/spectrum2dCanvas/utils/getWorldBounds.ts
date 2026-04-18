import type { Spectrum2DCanvasWorldBounds } from "../shared/types";

export function getWorldBounds(
	width: number,
	height: number,
): Spectrum2DCanvasWorldBounds {
	return {
		left: 0,
		right: width,
		top: 0,
		bottom: -height,
		width,
		height,
		centerX: width / 2,
		centerY: -height / 2,
	};
}
