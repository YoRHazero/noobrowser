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

export function toLineFitDisplayWavelength(
	observedWavelengthUm: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	const frameWavelengthUm =
		display.wavelengthFrame === "observed"
			? observedWavelengthUm
			: observedWavelengthUm / getRedshiftFactor(display.redshift);

	return display.wavelengthUnit === "um"
		? frameWavelengthUm
		: frameWavelengthUm * SPECTRUM_WORKSPACE_ANGSTROM_PER_MICRON;
}
