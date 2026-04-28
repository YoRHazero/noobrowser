import { SPECTRUM_WORKSPACE_MIN_REDSHIFT } from "../shared/constants";

export function toSpectrumWorkspaceObservedWavelengthUm(
	restWavelengthUm: number,
	redshift: number,
): number {
	const safeRedshift = Number.isFinite(redshift)
		? Math.max(redshift, SPECTRUM_WORKSPACE_MIN_REDSHIFT)
		: 0;

	return restWavelengthUm * (1 + safeRedshift);
}
