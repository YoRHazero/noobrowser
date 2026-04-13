import type { Spectrum1DCanvasDisplayModel } from "../api";
import { SPECTRUM_1D_CANVAS_ANGSTROM_PER_MICRON } from "../shared/constants";

function getRedshiftFactor(redshift: number): number {
	const safeRedshift = Number.isFinite(redshift) ? redshift : 0;
	return Math.max(1 + safeRedshift, Number.EPSILON);
}

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

export function getWavelengthAxisLabel(
	display: Spectrum1DCanvasDisplayModel,
): string {
	const frameLabel =
		display.wavelengthFrame === "observed" ? "observed" : "rest";
	const unitLabel = display.wavelengthUnit === "um" ? "um" : "A";

	return `Wavelength ${frameLabel} (${unitLabel})`;
}

export function toObservedEmissionWavelengthUm(
	restWavelengthUm: number,
	redshift: number,
): number {
	return restWavelengthUm * getRedshiftFactor(redshift);
}
