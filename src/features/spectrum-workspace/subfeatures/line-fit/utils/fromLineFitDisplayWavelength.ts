import {
	SPECTRUM_WORKSPACE_ANGSTROM_PER_MICRON,
	SPECTRUM_WORKSPACE_MIN_REDSHIFT,
} from "../../../shared/constants";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";

function getRedshiftFactor(redshift: number): number {
	const safeRedshift = Number.isFinite(redshift)
		? Math.max(redshift, SPECTRUM_WORKSPACE_MIN_REDSHIFT)
		: 0;

	return 1 + safeRedshift;
}

export function fromLineFitDisplayWavelength(
	displayWavelength: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	const frameWavelengthUm =
		display.wavelengthUnit === "um"
			? displayWavelength
			: displayWavelength / SPECTRUM_WORKSPACE_ANGSTROM_PER_MICRON;

	return display.wavelengthFrame === "observed"
		? frameWavelengthUm
		: frameWavelengthUm * getRedshiftFactor(display.redshift);
}
