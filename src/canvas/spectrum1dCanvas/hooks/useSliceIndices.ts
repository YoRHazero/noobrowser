import { useMemo } from "react";
import type { Spectrum1DCanvasWaveRange } from "../api";
import { getWavelengthSliceIndices } from "../utils/getWavelengthSliceIndices";

export function useSliceIndices(
	wavelengthsUm: readonly number[],
	sliceRange: Spectrum1DCanvasWaveRange,
): { startIndex: number; endIndex: number } {
	return useMemo(
		() => getWavelengthSliceIndices(wavelengthsUm, sliceRange),
		[wavelengthsUm, sliceRange],
	);
}
