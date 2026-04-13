import { useMemo } from "react";
import type { Spectrum1DCanvasEmissionLineModel } from "../api";
import { toObservedEmissionWavelengthUm } from "../utils/toObservedEmissionWavelengthUm";

export function useObservedEmissionLines(
	emissionLines: readonly Spectrum1DCanvasEmissionLineModel[],
	redshift: number,
) {
	return useMemo(
		() =>
			emissionLines.map((line) => ({
				...line,
				observedWavelengthUm: toObservedEmissionWavelengthUm(
					line.restWavelengthUm,
					redshift,
				),
			})),
		[emissionLines, redshift],
	);
}
