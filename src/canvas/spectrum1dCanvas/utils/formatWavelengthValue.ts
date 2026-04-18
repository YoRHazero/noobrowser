import type { Spectrum1DCanvasDisplayModel } from "../api";
import { toDisplayWavelength } from "./toDisplayWavelength";

export function formatWavelengthValue(
	observedWavelengthUm: number,
	display: Spectrum1DCanvasDisplayModel,
): string {
	const displayWavelength = toDisplayWavelength(observedWavelengthUm, display);
	const digits =
		display.wavelengthDigits ?? (display.wavelengthUnit === "um" ? 4 : 0);

	return displayWavelength.toFixed(digits);
}
