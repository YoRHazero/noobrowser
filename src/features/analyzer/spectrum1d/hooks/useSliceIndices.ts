import { useMemo } from "react";
import { getWavelengthSliceIndices } from "@/utils/extraction";

export function useSliceIndices(
	waveArray: number[],
	sliceRange: { min: number; max: number },
) {
	return useMemo(() => {
		return getWavelengthSliceIndices(waveArray, sliceRange.min, sliceRange.max);
	}, [waveArray, sliceRange]);
}
