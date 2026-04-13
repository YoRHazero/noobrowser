import type { Spectrum1DCanvasDisplayModel } from "../api";
import { toDisplayWavelength } from "./toDisplayWavelength";

export function formatWavelength(
	observedWavelengthUm: number,
	display: Spectrum1DCanvasDisplayModel,
): string {
	const displayWavelength = toDisplayWavelength(observedWavelengthUm, display);
	const digits =
		display.wavelengthDigits ?? (display.wavelengthUnit === "um" ? 4 : 0);

	return display.wavelengthUnit === "um"
		? `${displayWavelength.toFixed(digits)} um`
		: `${displayWavelength.toFixed(digits)} A`;
}
