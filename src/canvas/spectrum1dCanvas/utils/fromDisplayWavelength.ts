import type { Spectrum1DCanvasDisplayModel } from "../api";
import { SPECTRUM_1D_CANVAS_ANGSTROM_PER_MICRON } from "../shared/constants";
import { getRedshiftFactor } from "./getRedshiftFactor";

export function fromDisplayWavelength(
	displayWavelength: number,
	display: Spectrum1DCanvasDisplayModel,
): number {
	const frameWavelengthUm =
		display.wavelengthUnit === "um"
			? displayWavelength
			: displayWavelength / SPECTRUM_1D_CANVAS_ANGSTROM_PER_MICRON;

	return display.wavelengthFrame === "observed"
		? frameWavelengthUm
		: frameWavelengthUm * getRedshiftFactor(display.redshift);
}
