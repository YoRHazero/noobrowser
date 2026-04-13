import { useMemo } from "react";
import type { Spectrum1DCanvasPoint } from "../api";
import type { Spectrum1DCanvasSpectrumStats } from "../shared/types";
import { getFluxLowerBound } from "../utils/getFluxLowerBound";
import { getFluxUpperBound } from "../utils/getFluxUpperBound";

export function useSpectrumStats(
	points: readonly Spectrum1DCanvasPoint[],
): Spectrum1DCanvasSpectrumStats {
	return useMemo(() => {
		if (points.length === 0) {
			return {
				wavelengthsUm: [],
				wavelengthMinUm: 0,
				wavelengthMaxUm: 1,
				fluxMin: 0,
				fluxMax: 1,
			};
		}

		const wavelengthsUm = new Array<number>(points.length);
		let wavelengthMinUm = Infinity;
		let wavelengthMaxUm = -Infinity;
		let fluxMin = Infinity;
		let fluxMax = -Infinity;

		for (let index = 0; index < points.length; index++) {
			const point = points[index];
			wavelengthsUm[index] = point.wavelengthUm;
			wavelengthMinUm = Math.min(wavelengthMinUm, point.wavelengthUm);
			wavelengthMaxUm = Math.max(wavelengthMaxUm, point.wavelengthUm);
			fluxMin = Math.min(fluxMin, getFluxLowerBound(point));
			fluxMax = Math.max(fluxMax, getFluxUpperBound(point));
		}

		if (!Number.isFinite(fluxMin) || !Number.isFinite(fluxMax)) {
			fluxMin = 0;
			fluxMax = 1;
		}

		return {
			wavelengthsUm,
			wavelengthMinUm,
			wavelengthMaxUm,
			fluxMin,
			fluxMax,
		};
	}, [points]);
}
