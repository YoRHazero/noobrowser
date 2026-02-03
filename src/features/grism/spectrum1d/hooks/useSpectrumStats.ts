import { useMemo } from "react";
import type { Spectrum1D } from "@/utils/util-types";
export function useSpectrumStats(spectrum1D: Spectrum1D[]) {
	return useMemo(() => {
		const n = spectrum1D.length;
		const waveArray = new Array<number>(n);
		let waveMin = Infinity;
		let waveMax = -Infinity;
		let fluxMin = Infinity;
		let fluxMax = -Infinity;
		for (let i = 0; i < n; i++) {
			const d = spectrum1D[i];
			waveArray[i] = d.wavelength;
			if (d.wavelength < waveMin) waveMin = d.wavelength;
			if (d.wavelength > waveMax) waveMax = d.wavelength;
			if (d.fluxMinusErr < fluxMin) fluxMin = d.fluxMinusErr;
			if (d.fluxPlusErr > fluxMax) fluxMax = d.fluxPlusErr;
		}
		if (!Number.isFinite(waveMin)) {
			waveMin = 0;
			waveMax = 1;
			fluxMin = 0;
			fluxMax = 1;
		}
		return {
			waveArray,
			waveMin,
			waveMax,
			fluxMin,
			fluxMax,
		};
	}, [spectrum1D]);
}
