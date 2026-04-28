import { getSpectrumWorkspaceWaveBounds } from "./getSpectrumWorkspaceWaveBounds";
import { roundSpectrumWorkspaceWaveValue } from "./roundSpectrumWorkspaceWaveValue";

function clampValue(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function filterSpectrumWorkspaceWaveColumnIndices({
	wavelengths,
	waveMinUm,
	waveMaxUm,
}: {
	wavelengths: number[];
	waveMinUm: number;
	waveMaxUm: number;
}): number[] {
	if (wavelengths.length === 0) {
		return [];
	}

	const { min: sourceMin, max: sourceMax } = getSpectrumWorkspaceWaveBounds(
		wavelengths,
		waveMinUm,
	);
	const lowerWave = clampValue(
		roundSpectrumWorkspaceWaveValue(Math.min(waveMinUm, waveMaxUm)),
		sourceMin,
		sourceMax,
	);
	const upperWave = clampValue(
		roundSpectrumWorkspaceWaveValue(Math.max(waveMinUm, waveMaxUm)),
		sourceMin,
		sourceMax,
	);

	return wavelengths.reduce<number[]>((indices, wavelength, columnIndex) => {
		const roundedWavelength = roundSpectrumWorkspaceWaveValue(wavelength);
		if (roundedWavelength >= lowerWave && roundedWavelength <= upperWave) {
			indices.push(columnIndex);
		}

		return indices;
	}, []);
}
