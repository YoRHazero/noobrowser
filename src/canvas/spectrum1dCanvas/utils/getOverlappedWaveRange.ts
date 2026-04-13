import type { Spectrum1DCanvasWaveRange } from "../api";
import { normalizeWaveRange } from "./normalizeWaveRange";

export function getOverlappedWaveRange(
	left: Spectrum1DCanvasWaveRange,
	right: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange | null {
	const normalizedLeft = normalizeWaveRange(left);
	const normalizedRight = normalizeWaveRange(right);
	const minUm = Math.max(normalizedLeft.minUm, normalizedRight.minUm);
	const maxUm = Math.min(normalizedLeft.maxUm, normalizedRight.maxUm);

	return minUm < maxUm ? { minUm, maxUm } : null;
}
