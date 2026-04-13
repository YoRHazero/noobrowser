import type { Spectrum1DCanvasWaveRange } from "../api";

export function normalizeWaveRange(
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange {
	return range.minUm <= range.maxUm
		? range
		: { minUm: range.maxUm, maxUm: range.minUm };
}
