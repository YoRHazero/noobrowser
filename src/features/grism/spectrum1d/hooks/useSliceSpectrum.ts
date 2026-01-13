import { useMemo } from "react";
import type { FitModel } from "@/stores/stores-types";
import type { Spectrum1D } from "@/utils/util-types";
import { computeSliceSpectrum } from "../utils/spectrumMath";

export function useSliceSpectrum(params: {
	spectrum1D: Spectrum1D[];
	waveStartIndex: number;
	waveEndIndex: number;
	modelsSubtracted: FitModel[];
}) {
	const { spectrum1D, waveStartIndex, waveEndIndex, modelsSubtracted } = params;
	return useMemo(() => {
		return computeSliceSpectrum({
			spectrum1D,
			startIndex: waveStartIndex,
			endIndex: waveEndIndex,
			modelsSubtracted,
		});
	}, [spectrum1D, waveStartIndex, waveEndIndex, modelsSubtracted]);
}
