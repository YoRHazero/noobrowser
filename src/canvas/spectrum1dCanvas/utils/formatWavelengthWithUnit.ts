import type { Spectrum1DCanvasDisplayModel } from "../api";
import { formatWavelengthValue } from "./formatWavelengthValue";

export function formatWavelengthWithUnit(
	observedWavelengthUm: number,
	display: Spectrum1DCanvasDisplayModel,
): string {
	const displayWavelength = formatWavelengthValue(
		observedWavelengthUm,
		display,
	);

	return display.wavelengthUnit === "um"
		? `${displayWavelength} um`
		: `${displayWavelength} A`;
}
