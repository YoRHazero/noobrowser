import type { Spectrum1DCanvasPoint } from "../api";

export function getFluxLowerBound(point: Spectrum1DCanvasPoint): number {
	return point.flux - point.error;
}
