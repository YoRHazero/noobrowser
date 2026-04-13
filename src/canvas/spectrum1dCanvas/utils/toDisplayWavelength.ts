import type { Spectrum1DCanvasDisplayModel } from "../api";
import { SPECTRUM_1D_CANVAS_ANGSTROM_PER_MICRON } from "../shared/constants";
import { getRedshiftFactor } from "./getRedshiftFactor";

export function toDisplayWavelength(
	observedWavelengthUm: number,
	display: Spectrum1DCanvasDisplayModel,
): number {
	const frameWavelengthUm =
		display.wavelengthFrame === "observed"
			? observedWavelengthUm
			: observedWavelengthUm / getRedshiftFactor(display.redshift);

	return display.wavelengthUnit === "um"
		? frameWavelengthUm
		: frameWavelengthUm * SPECTRUM_1D_CANVAS_ANGSTROM_PER_MICRON;
}
