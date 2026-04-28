import type { SpectrumWorkspaceWavelengthDisplayState } from "../shared/types";
import { toSpectrumWorkspaceDisplayWavelength } from "./toSpectrumWorkspaceDisplayWavelength";

export function formatSpectrumWorkspaceDisplayWavelength(
	restWavelengthUm: number,
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>,
): string {
	const wavelength = toSpectrumWorkspaceDisplayWavelength(
		restWavelengthUm,
		display,
	);

	if (display.wavelengthUnit === "um") {
		return `${wavelength.toFixed(4).replace(/\.?0+$/, "")} um`;
	}

	return `${Math.round(wavelength)} A`;
}
