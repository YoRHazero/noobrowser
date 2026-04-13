import type { Spectrum1DCanvasPoint, Spectrum1DCanvasWaveRange } from "../api";

export function normalizeWaveRange(
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange {
	return range.minUm <= range.maxUm
		? range
		: { minUm: range.maxUm, maxUm: range.minUm };
}

export function isWaveRangeValid(range: Spectrum1DCanvasWaveRange): boolean {
	return (
		Number.isFinite(range.minUm) &&
		Number.isFinite(range.maxUm) &&
		range.maxUm > range.minUm
	);
}

export function clampValue(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function clampWaveRange(
	range: Spectrum1DCanvasWaveRange,
	limit: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange {
	const normalizedRange = normalizeWaveRange(range);
	const normalizedLimit = normalizeWaveRange(limit);

	return {
		minUm: clampValue(
			normalizedRange.minUm,
			normalizedLimit.minUm,
			normalizedLimit.maxUm,
		),
		maxUm: clampValue(
			normalizedRange.maxUm,
			normalizedLimit.minUm,
			normalizedLimit.maxUm,
		),
	};
}

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
	const startIndex = lowerBound(wavelengthsUm, minUm);
	const endIndex = upperBound(wavelengthsUm, maxUm) - 1;

	return {
		startIndex,
		endIndex: Math.max(startIndex, endIndex),
	};
}

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

function lowerBound(values: readonly number[], target: number): number {
	let left = 0;
	let right = values.length;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		if (values[mid] < target) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}

	return left;
}

function upperBound(values: readonly number[], target: number): number {
	let left = 0;
	let right = values.length;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		if (values[mid] <= target) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}

	return left;
}
