import type { Spectrum1DCanvasPoint, Spectrum1DCanvasWaveRange } from "../api";

export function getPointWaveRange(
	points: readonly Spectrum1DCanvasPoint[],
): Spectrum1DCanvasWaveRange | null {
	if (points.length === 0) {
		return null;
	}

	return {
		minUm: points[0].wavelengthUm,
		maxUm: points[points.length - 1].wavelengthUm,
	};
}
