import type { Spectrum1DCanvasWaveRange } from "../api";

export function isWaveRangeValid(range: Spectrum1DCanvasWaveRange): boolean {
	return (
		Number.isFinite(range.minUm) &&
		Number.isFinite(range.maxUm) &&
		range.maxUm > range.minUm
	);
}
