import { SPECTRUM_WORKSPACE_WAVE_BOUND_FRACTION_DIGITS } from "../shared/constants";

export function roundSpectrumWorkspaceWaveValue(value: number): number {
	if (!Number.isFinite(value)) {
		return value;
	}

	return Number(value.toFixed(SPECTRUM_WORKSPACE_WAVE_BOUND_FRACTION_DIGITS));
}
