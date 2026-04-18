import { useCallback, useMemo } from "react";
import type { Spectrum1DCanvasDisplayModel } from "../api";
import { formatWavelengthValue } from "../utils/formatWavelengthValue";
import { formatWavelengthWithUnit } from "../utils/formatWavelengthWithUnit";
import { fromDisplayWavelength } from "../utils/fromDisplayWavelength";
import { toDisplayWavelength } from "../utils/toDisplayWavelength";

export function useWavelengthDisplay(
	display: Spectrum1DCanvasDisplayModel,
	wavelengthAxisLabel?: string,
) {
	const formatterWithUnit = useCallback(
		(observedWavelengthUm: number) =>
			formatWavelengthWithUnit(observedWavelengthUm, display),
		[display],
	);
	const valueFormatter = useCallback(
		(observedWavelengthUm: number) =>
			formatWavelengthValue(observedWavelengthUm, display),
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
		formatValue: valueFormatter,
		formatWithUnit: formatterWithUnit,
		fromDisplay,
		toDisplay,
	};
}
