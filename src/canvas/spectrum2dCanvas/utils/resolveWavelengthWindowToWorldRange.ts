import { clampValue } from "./clampValue";

function resolveWavelengthSliceIndices(
	wavelengthsUm: number[],
	waveMinUm: number,
	waveMaxUm: number,
): { startIndex: number; endIndex: number } {
	if (wavelengthsUm.length === 0) {
		return {
			startIndex: 0,
			endIndex: -1,
		};
	}

	const firstWavelength = wavelengthsUm[0];
	const lastWavelength = wavelengthsUm[wavelengthsUm.length - 1];
	const lowerWave = Math.min(waveMinUm, waveMaxUm);
	const upperWave = Math.max(waveMinUm, waveMaxUm);
	const clampedMin = clampValue(lowerWave, firstWavelength, lastWavelength);
	const clampedMax = clampValue(upperWave, firstWavelength, lastWavelength);

	let startIndex = wavelengthsUm.findIndex(
		(wavelength) => wavelength >= clampedMin,
	);
	if (startIndex < 0) {
		startIndex = wavelengthsUm.length - 1;
	}

	let endIndex =
		wavelengthsUm.findIndex((wavelength) => wavelength > clampedMax) - 1;
	if (endIndex < 0) {
		endIndex = wavelengthsUm.length - 1;
	}

	return {
		startIndex,
		endIndex,
	};
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

	const { startIndex, endIndex } = resolveWavelengthSliceIndices(
		wavelengthsUm,
		waveMinUm,
		waveMaxUm,
	);
	const columnWidth = width / wavelengthsUm.length;
	return {
		worldLeftX: startIndex * columnWidth,
		worldRightX: (endIndex + 1) * columnWidth,
	};
}
