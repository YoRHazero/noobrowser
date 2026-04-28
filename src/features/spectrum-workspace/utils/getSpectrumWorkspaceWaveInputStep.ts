import { SPECTRUM_WORKSPACE_WAVE_BOUND_FRACTION_DIGITS } from "../shared/constants";

const MIN_WAVE_STEP = 10 ** -SPECTRUM_WORKSPACE_WAVE_BOUND_FRACTION_DIGITS;

export function getSpectrumWorkspaceWaveInputStep({
	waveMinUm,
	waveMaxUm,
}: {
	waveMinUm: number;
	waveMaxUm: number;
}): number {
	const range = Math.max(0, waveMaxUm - waveMinUm);
	if (range === 0) {
		return MIN_WAVE_STEP;
	}

	const rawStep = range / 100;
	const exponent = Math.round(Math.log10(rawStep));
	const normalizedStep = 10 ** exponent;

	return Number.isFinite(normalizedStep) && normalizedStep > 0
		? Math.max(normalizedStep, MIN_WAVE_STEP)
		: MIN_WAVE_STEP;
}
