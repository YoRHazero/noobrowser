import type { Spectrum1DCanvasWaveRange } from "../api";
import { clampValue } from "./clampValue";
import { normalizeWaveRange } from "./normalizeWaveRange";

export function getWavelengthSliceIndices(
	wavelengthsUm: readonly number[],
	range: Spectrum1DCanvasWaveRange,
): { startIndex: number; endIndex: number } {
	if (wavelengthsUm.length === 0) {
		return { startIndex: 0, endIndex: -1 };
	}

	const normalizedRange = normalizeWaveRange(range);
	const dataMin = wavelengthsUm[0];
	const dataMax = wavelengthsUm[wavelengthsUm.length - 1];
	const minUm = clampValue(normalizedRange.minUm, dataMin, dataMax);
	const maxUm = clampValue(normalizedRange.maxUm, dataMin, dataMax);
	let startIndex = 0;
	let startRight = wavelengthsUm.length;
	while (startIndex < startRight) {
		const mid = Math.floor((startIndex + startRight) / 2);
		if (wavelengthsUm[mid] < minUm) {
			startIndex = mid + 1;
		} else {
			startRight = mid;
		}
	}

	let endIndex = 0;
	let endRight = wavelengthsUm.length;
	while (endIndex < endRight) {
		const mid = Math.floor((endIndex + endRight) / 2);
		if (wavelengthsUm[mid] <= maxUm) {
			endIndex = mid + 1;
		} else {
			endRight = mid;
		}
	}

	return {
		startIndex,
		endIndex: Math.max(startIndex, endIndex - 1),
	};
}
