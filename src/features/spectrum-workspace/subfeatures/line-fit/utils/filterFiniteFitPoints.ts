import type {
	Spectrum1DCanvasPoint,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";

export function filterFiniteFitPoints(
	points: readonly Spectrum1DCanvasPoint[],
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasPoint[] {
	const minUm = Math.min(range.minUm, range.maxUm);
	const maxUm = Math.max(range.minUm, range.maxUm);

	if (!Number.isFinite(minUm) || !Number.isFinite(maxUm) || minUm >= maxUm) {
		return [];
	}

	return points.filter(
		(point) =>
			Number.isFinite(point.wavelengthUm) &&
			Number.isFinite(point.flux) &&
			point.wavelengthUm >= minUm &&
			point.wavelengthUm <= maxUm,
	);
}
