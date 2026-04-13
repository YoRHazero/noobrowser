import { useCallback, useMemo } from "react";
import type { Spectrum1DCanvasDisplayModel } from "../api";
import { formatWavelength } from "../utils/formatWavelength";
import { fromDisplayWavelength } from "../utils/fromDisplayWavelength";
import { toDisplayWavelength } from "../utils/toDisplayWavelength";

export function useWavelengthDisplay(
	display: Spectrum1DCanvasDisplayModel,
	wavelengthAxisLabel?: string,
) {
	const formatter = useCallback(
		(observedWavelengthUm: number) =>
			formatWavelength(observedWavelengthUm, display),
		[display],
	);
	const toDisplay = useCallback(
		(observedWavelengthUm: number) =>
			toDisplayWavelength(observedWavelengthUm, display),
		[display],
	);
	const fromDisplay = useCallback(
		(displayWavelength: number) =>
			fromDisplayWavelength(displayWavelength, display),
		[display],
	);
	const axisLabel = useMemo(() => {
		if (wavelengthAxisLabel) {
			return wavelengthAxisLabel;
		}

		const frameLabel =
			display.wavelengthFrame === "observed" ? "observed" : "rest";
		const unitLabel = display.wavelengthUnit === "um" ? "um" : "A";
		return `Wavelength ${frameLabel} (${unitLabel})`;
	}, [display.wavelengthFrame, display.wavelengthUnit, wavelengthAxisLabel]);

	return {
		axisLabel,
		format: formatter,
		fromDisplay,
		toDisplay,
	};
}
