import { roundSpectrumWorkspaceWaveValue } from "./roundSpectrumWorkspaceWaveValue";

export function getSpectrumWorkspaceWaveBounds(
	wavelengths: number[],
	fallbackValue = 0,
): { min: number; max: number } {
	if (wavelengths.length === 0) {
		const roundedFallbackValue = roundSpectrumWorkspaceWaveValue(fallbackValue);

		return {
			min: roundedFallbackValue,
			max: roundedFallbackValue,
		};
	}

	const firstWave = roundSpectrumWorkspaceWaveValue(
		wavelengths[0] ?? fallbackValue,
	);
	const lastWave = roundSpectrumWorkspaceWaveValue(
		wavelengths[wavelengths.length - 1] ?? firstWave,
	);

	return {
		min: Math.min(firstWave, lastWave),
		max: Math.max(firstWave, lastWave),
	};
}
