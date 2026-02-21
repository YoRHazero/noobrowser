import { useMemo } from "react";
import { sampleModelFromWave } from "@/utils/plot";
import type { FitModel } from "@/stores/stores-types";
import type { Spectrum1D } from "@/utils/util-types";

export function useSliceSpectrum(params: {
	spectrum1D: Spectrum1D[];
	waveStartIndex: number;
	waveEndIndex: number;
	modelsSubtracted: FitModel[];
}) {
	const { spectrum1D, waveStartIndex, waveEndIndex, modelsSubtracted } = params;
	return useMemo(() => {
		const slice = spectrum1D.slice(waveStartIndex, waveEndIndex + 1);
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
	}, [spectrum1D, waveStartIndex, waveEndIndex, modelsSubtracted]);
}
