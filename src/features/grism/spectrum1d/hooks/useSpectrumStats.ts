import { useMemo } from "react";
import type { Spectrum1D } from "@/utils/util-types";
import { computeSpectrumStats } from "../utils/spectrumMath";

export function useSpectrumStats(spectrum1D: Spectrum1D[]) {
	return useMemo(() => computeSpectrumStats(spectrum1D), [spectrum1D]);
}
