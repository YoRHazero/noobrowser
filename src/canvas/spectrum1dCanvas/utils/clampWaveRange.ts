import type { Spectrum1DCanvasWaveRange } from "../api";
import { clampValue } from "./clampValue";
import { normalizeWaveRange } from "./normalizeWaveRange";

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
