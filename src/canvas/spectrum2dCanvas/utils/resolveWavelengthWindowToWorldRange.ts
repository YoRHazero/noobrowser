import { clampValue } from "./clampValue";

const WAVELENGTH_WINDOW_PRECISION = 3;

function roundWavelengthValue(value: number): number {
	return Number(value.toFixed(WAVELENGTH_WINDOW_PRECISION));
}

function resolveWavelengthSliceIndices(
	wavelengthsUm: number[],
	waveMinUm: number,
	waveMaxUm: number,
): number[] {
	if (wavelengthsUm.length === 0) {
		return [];
	}

	const firstWavelength = roundWavelengthValue(wavelengthsUm[0] ?? waveMinUm);
	const lastWavelength = roundWavelengthValue(
		wavelengthsUm[wavelengthsUm.length - 1] ?? waveMaxUm,
	);
	const minWavelength = Math.min(firstWavelength, lastWavelength);
	const maxWavelength = Math.max(firstWavelength, lastWavelength);
	const lowerWave = roundWavelengthValue(Math.min(waveMinUm, waveMaxUm));
	const upperWave = roundWavelengthValue(Math.max(waveMinUm, waveMaxUm));
	const clampedMin = clampValue(lowerWave, minWavelength, maxWavelength);
	const clampedMax = clampValue(upperWave, minWavelength, maxWavelength);

	return wavelengthsUm.reduce<number[]>((indices, wavelength, columnIndex) => {
		const roundedWavelength = roundWavelengthValue(wavelength);
		if (roundedWavelength >= clampedMin && roundedWavelength <= clampedMax) {
			indices.push(columnIndex);
		}

		return indices;
	}, []);
}

export interface ResolveWavelengthWindowToWorldRangeParams {
	wavelengthsUm: number[];
	width: number;
	waveMinUm: number;
	waveMaxUm: number;
}

export function resolveWavelengthWindowToWorldRange({
	wavelengthsUm,
	width,
	waveMinUm,
	waveMaxUm,
}: ResolveWavelengthWindowToWorldRangeParams): {
	worldLeftX: number;
	worldRightX: number;
} {
	if (width <= 0 || wavelengthsUm.length === 0) {
		return {
			worldLeftX: 0,
			worldRightX: 0,
		};
	}

	const sliceIndices = resolveWavelengthSliceIndices(
		wavelengthsUm,
		waveMinUm,
		waveMaxUm,
	);
	if (sliceIndices.length === 0) {
		return {
			worldLeftX: 0,
			worldRightX: 0,
		};
	}

	const columnWidth = width / wavelengthsUm.length;
	const startIndex = sliceIndices[0] ?? 0;
	const endIndex = sliceIndices[sliceIndices.length - 1] ?? startIndex;

	return {
		worldLeftX: startIndex * columnWidth,
		worldRightX: (endIndex + 1) * columnWidth,
	};
}
