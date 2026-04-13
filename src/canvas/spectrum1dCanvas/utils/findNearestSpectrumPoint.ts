import type { Spectrum1DCanvasPoint } from "../api";

export function findNearestSpectrumPoint(
	points: readonly Spectrum1DCanvasPoint[],
	targetWavelengthUm: number,
): { index: number; point: Spectrum1DCanvasPoint } | null {
	if (points.length === 0) {
		return null;
	}

	let left = 0;
	let right = points.length - 1;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		if (points[mid].wavelengthUm < targetWavelengthUm) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}

	let nearestIndex = left;
	const previousIndex = nearestIndex - 1;

	if (
		previousIndex >= 0 &&
		Math.abs(points[previousIndex].wavelengthUm - targetWavelengthUm) <=
			Math.abs(points[nearestIndex].wavelengthUm - targetWavelengthUm)
	) {
		nearestIndex = previousIndex;
	}

	return {
		index: nearestIndex,
		point: points[nearestIndex],
	};
}
