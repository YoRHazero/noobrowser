import type { FitModel } from "@/stores/stores-types";
import { sampleModelFromWave } from "@/utils/plot";
import type { Spectrum1D } from "@/utils/util-types";

export function computeSpectrumStats(spectrum1D: Spectrum1D[]) {
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
}

export function computeSliceSpectrum(params: {
	spectrum1D: Spectrum1D[];
	startIndex: number;
	endIndex: number;
	modelsSubtracted: FitModel[];
}): Spectrum1D[] {
	const { spectrum1D, startIndex, endIndex, modelsSubtracted } = params;
	const slice = spectrum1D.slice(startIndex, endIndex + 1);
	const sliceSpectrumSubtracted = slice.map((d) => {
		let totalFluxForSubtraction = 0;
		for (const model of modelsSubtracted) {
			const modelFlux = sampleModelFromWave(model, d.wavelength).flux;
			totalFluxForSubtraction += modelFlux;
		}
		return {
			...d,
			flux: d.flux - totalFluxForSubtraction,
			fluxMinusErr: d.fluxMinusErr - totalFluxForSubtraction,
			fluxPlusErr: d.fluxPlusErr - totalFluxForSubtraction,
		};
	});
	return sliceSpectrumSubtracted;
}

export function computeSliceFluxRange(sliceSpectrum: Spectrum1D[]) {
	const fluxMin = Math.min(...sliceSpectrum.map((d) => d.fluxMinusErr));
	const fluxMax = Math.max(...sliceSpectrum.map((d) => d.fluxPlusErr));
	return { fluxMin, fluxMax };
}
