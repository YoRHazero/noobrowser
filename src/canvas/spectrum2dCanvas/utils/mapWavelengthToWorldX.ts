import { clampValue } from "./clampValue";

function getWavelengthBoundaries(wavelengthsUm: number[]): number[] {
	if (wavelengthsUm.length === 0) {
		return [0, 1];
	}

	if (wavelengthsUm.length === 1) {
		return [wavelengthsUm[0] - 0.5, wavelengthsUm[0] + 0.5];
	}

	const boundaries = new Array<number>(wavelengthsUm.length + 1);
	boundaries[0] = wavelengthsUm[0] - (wavelengthsUm[1] - wavelengthsUm[0]) / 2;
	for (let index = 1; index < wavelengthsUm.length; index += 1) {
		boundaries[index] = (wavelengthsUm[index - 1] + wavelengthsUm[index]) / 2;
	}
	boundaries[wavelengthsUm.length] =
		wavelengthsUm[wavelengthsUm.length - 1] +
		(wavelengthsUm[wavelengthsUm.length - 1] -
			wavelengthsUm[wavelengthsUm.length - 2]) /
			2;
	return boundaries;
}

export interface MapWavelengthToWorldXParams {
	valueUm: number;
	wavelengthsUm: number[];
	width: number;
}

export function mapWavelengthToWorldX({
	valueUm,
	wavelengthsUm,
	width,
}: MapWavelengthToWorldXParams): number | null {
	if (width <= 0 || wavelengthsUm.length === 0) {
		return null;
	}

	const boundaries = getWavelengthBoundaries(wavelengthsUm);
	const lowerBoundary = boundaries[0];
	const upperBoundary = boundaries[boundaries.length - 1];
	if (valueUm < lowerBoundary || valueUm > upperBoundary) {
		return null;
	}

	for (let index = 1; index < boundaries.length; index += 1) {
		const left = boundaries[index - 1];
		const right = boundaries[index];
		if (valueUm <= right) {
			if (right === left) {
				return ((index - 1) / wavelengthsUm.length) * width;
			}

			const localT = clampValue((valueUm - left) / (right - left), 0, 1);
			return ((index - 1 + localT) / wavelengthsUm.length) * width;
		}
	}

	return width;
}
