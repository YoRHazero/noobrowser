import { SPECTRUM_WORKSPACE_ANGSTROM_PER_MICRON } from "../shared/constants";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../shared/types";
import { toSpectrumWorkspaceObservedWavelengthUm } from "./toSpectrumWorkspaceObservedWavelengthUm";

export function toSpectrumWorkspaceDisplayWavelength(
	restWavelengthUm: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): number {
	const frameWavelengthUm =
		display.wavelengthFrame === "observed"
			? toSpectrumWorkspaceObservedWavelengthUm(
					restWavelengthUm,
					display.redshift,
				)
			: restWavelengthUm;

	return display.wavelengthUnit === "um"
		? frameWavelengthUm
		: frameWavelengthUm * SPECTRUM_WORKSPACE_ANGSTROM_PER_MICRON;
}
