import { Texture } from "pixi.js";
import { clamp } from "./projection";
/**
 * Sorts a 2D array into a flat sorted array.
 * @param arr - The 2D array to sort.
 * @returns A flat sorted array.
 */
export function sort2DArray(arr: number[][]): number[] {
	const flat = arr.flat();
	flat.sort((a, b) => a - b);
	return flat;
}

/**
 * Computes the percentile value(s) from a sorted array.
 * @param sortedArr - The sorted array of numbers.
 * @param p - The percentile(s) to compute (0-100). Can be a single number or an array of numbers.
 * @param excludeZero - Whether to exclude zero values from the computation.
 * @returns The percentile value(s).
 */
export function percentileFromSortedArray(
	sortedArr: number[],
	p: number | number[],
	excludeZero = true,
): number | number[] {
	const ps = Array.isArray(p) ? p : [p];

	const baseArr = excludeZero ? sortedArr.filter((v) => v !== 0) : sortedArr;
	const n = baseArr.length;

	if (n === 0) {
		const zeros = ps.map(() => 0);
		return Array.isArray(p) ? zeros : 0;
	}

	const results = ps.map((percentile) => {
		const rank = (percentile / 100) * (n - 1);
		const lowerIndex = Math.floor(rank);
		const upperIndex = Math.ceil(rank);

		if (lowerIndex === upperIndex) {
			return baseArr[lowerIndex];
		}

		const weight = rank - lowerIndex;
		return baseArr[lowerIndex] * (1 - weight) + baseArr[upperIndex] * weight;
	});

	return Array.isArray(p) ? results : results[0];
}

/** Finds the percentile rank of a value in a sorted array.
 * @param sortedArr - The sorted array of numbers.
 * @param value - The value to find the percentile rank for.
 * @param excludeZero - Whether to exclude zero values from the computation.
 * @returns The percentile rank (0-100) or null if the array is empty after exclusions.
 */
export function findPercentileInSortedArray(
	sortedArr: number[],
	value: number,
	excludeZero = true,
): number | undefined {
	const baseArr = excludeZero ? sortedArr.filter((v) => v !== 0) : sortedArr;
	const n = baseArr.length;

	if (n === 0) {
		return;
	}

	let lowerIndex = 0;
	let upperIndex = n - 1;

	while (lowerIndex <= upperIndex) {
		const midIndex = Math.floor((lowerIndex + upperIndex) / 2);
		const midValue = baseArr[midIndex];

		if (midValue === value) {
			lowerIndex = midIndex;
			break;
		} else if (midValue < value) {
			lowerIndex = midIndex + 1;
		} else {
			upperIndex = midIndex - 1;
		}
	}

	if (lowerIndex === 0) {
		return 0;
	}
	if (lowerIndex >= n) {
		return 100;
	}

	const lowerValue = baseArr[lowerIndex - 1];
	const upperValue = baseArr[lowerIndex];

	if (upperValue === lowerValue) {
		return ((lowerIndex - 1) / (n - 1)) * 100;
	}

	const weight = (value - lowerValue) / (upperValue - lowerValue);
	const rank = (lowerIndex - 1 + weight) / (n - 1);
	return rank * 100;
}

/** Normalizes a 2D array based on percentile values.
 * @param arr - The 2D array to normalize.
 * @param sortedArray - An optional pre-sorted flat array for performance.
 * @param excludeZero - Whether to exclude zero values from the normalization.
 * @param norm - Normalization parameters: pmin, pmax, vmin, vmax. 
 * If vmin/vmax are provided, they take precedence over pmin/pmax.
 * @returns The normalized 2D array with values between 0 and 1.
 */
export function normalize2D(
	arr: number[][],
	sortedArray: number[] = [],
	excludeZero: boolean = true,
	norm: {
		pmin?: number;
		pmax?: number;
		vmin?: number;
		vmax?: number;
	}
): number[][] {
	const sorted = sortedArray ?? sort2DArray(arr);
	const { pmin, pmax, vmin, vmax } = norm;
	// Throw error if both pmin/vmin or pmax/vmax are not provided
	if ((pmin === undefined && vmin === undefined) || (pmax === undefined && vmax === undefined)) {
		throw new Error("Either pmin/vmin or pmax/vmax must be provided for normalization.");
	}
	const finalVmin = vmin ?? percentileFromSortedArray(
		sorted,
		pmin ?? 0, // 0 will never be used since we checked above, just to satisfy TS
		excludeZero,
	) as number;
	const finalVmax = vmax ?? percentileFromSortedArray(
		sorted,
		pmax ?? 100, // 100 will never be used since we checked above, just to satisfy TS
		excludeZero,
	) as number;

	if (finalVmax <= finalVmin) {
		return arr.map((row) => row.map(() => 0));
	}

	const invRange = 1 / (finalVmax - finalVmin);

	const normalized: number[][] = arr.map((row) =>
		row.map((value) => {
			const t = (value - finalVmin) * invRange;
			return clamp(t, 0, 1);
		}),
	);

	return normalized;
}

/** Scales a 2D array of normalized values (0-1) to byte values (0-255).
 * @param arr - The 2D array to scale.
 * @returns A flat Uint8ClampedArray of byte values.
 */
export function scaleToByte(arr: number[][]): Uint8ClampedArray {
	const flat = arr.flat();
	const byteArray = new Uint8ClampedArray(flat.length);
	for (let i = 0; i < flat.length; i++) {
		byteArray[i] = Math.round(clamp(flat[i] * 255, 0, 255));
	}
	return byteArray;
}

/** Creates a PIXI Texture from grayscale byte data.
 * @param gray - The grayscale byte data.
 * @param width - The width of the texture.
 * @param height - The height of the texture.
 * @returns A PIXI Texture.
 */
export function textureFromGrayscaleData(
	gray: Uint8ClampedArray,
	width: number,
	height: number,
): Texture {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get 2D context from canvas");
	}
	const imageData = ctx.createImageData(width, height);
	for (let i = 0; i < gray.length; i++) {
		const grayValue = gray[i];
		const idx = i * 4;
		imageData.data[idx + 0] = grayValue;
		imageData.data[idx + 1] = grayValue;
		imageData.data[idx + 2] = grayValue;
		imageData.data[idx + 3] = 255;
	}
	ctx.putImageData(imageData, 0, 0);
	return Texture.from(canvas);
}

/** Creates a PIXI Texture from 2D data array with normalization and scaling.
 * @param data - The 2D data array.
 * @param pmin - The minimum percentile for normalization (0-100).
 * @param pmax - The maximum percentile for normalization (0-100).
 * @param width - The width of the texture. If null, uses data width.
 * @param height - The height of the texture. If null, uses data height.
 * @param sortedArray - An optional pre-sorted flat array for performance.
 * @param excludeZero - Whether to exclude zero values from normalization.
 * @returns A PIXI Texture.
 */
export default function textureFromData({
	data,
	pmin,
	pmax,
	vmin,
	vmax,
	width = null,
	height = null,
	sortedArray = [],
	excludeZero = true,
}: {
	data: number[][];
	pmin?: number;
	pmax?: number;
	vmin?: number;
	vmax?: number;
	width?: number | null;
	height?: number | null;
	sortedArray?: number[];
	excludeZero?: boolean;
}): Texture {
	if (!width) {
		width = data[0].length;
	}
	if (!height) {
		height = data.length;
	}
	const normalizedData = normalize2D(
		data,
		sortedArray,
		excludeZero,
		{ pmin, pmax, vmin, vmax },
	);
	const byteData = scaleToByte(normalizedData);
	return textureFromGrayscaleData(byteData, width, height);
}

/* -------------------------------------------------------------------------- */
/*                                1D Plot Utils                               */
/* -------------------------------------------------------------------------- */
import type { FitModel } from "@/stores/stores-types";

export function sampleModel(
	model: FitModel,
	sliceRange: { min: number; max: number },
	samplePoints: number = 201,
): { wavelength: number; flux: number }[] {
	const xmin = Math.max(sliceRange.min, model.range.min);
	const xmax = Math.min(sliceRange.max, model.range.max);

	if (xmin >= xmax) {
		return [];
	}

	if (model.kind === "linear") {
		const slope = model.k;
		const intercept = model.b;
		const x0 = model.x0;

		const fluxAtXmin = slope * (xmin - x0) + intercept;
		const fluxAtXmax = slope * (xmax - x0) + intercept;

		return [
			{ wavelength: xmin, flux: fluxAtXmin },
			{ wavelength: (xmax + xmin) / 2, flux: (fluxAtXmin + fluxAtXmax) / 2 },
			{ wavelength: xmax, flux: fluxAtXmax },
		];
	} else if (model.kind === "gaussian") {
		const amplitude = model.amplitude;
		const mu = model.mu;
		const sigma = model.sigma;
		const data: { wavelength: number; flux: number }[] = new Array(
			samplePoints,
		);

		for (let i = 0; i < samplePoints; i++) {
			const t = i / (samplePoints - 1);
			const wavelength = xmin + t * (xmax - xmin);
			const exponent = -0.5 * ((wavelength - mu) / sigma) ** 2;
			const flux = amplitude * Math.exp(exponent);
			data[i] = { wavelength, flux };
		}
		return data;
	} else {
		throw new Error(`Unknown model kind`);
	}
}

export function sampleModelFromWave(
	model: FitModel,
	wavelength: number,
): { wavelength: number; flux: number } {
	if (model.kind === "linear") {
		const slope = model.k;
		const intercept = model.b;
		const x0 = model.x0;
		const flux = slope * (wavelength - x0) + intercept;
		const result = {
			wavelength: wavelength,
			flux: flux,
		};
		return result;
	} else if (model.kind === "gaussian") {
		const amplitude = model.amplitude;
		const mu = model.mu;
		const sigma = model.sigma;
		const exponent = -0.5 * ((wavelength - mu) / sigma) ** 2;
		const flux = amplitude * Math.exp(exponent);
		const result = {
			wavelength: wavelength,
			flux: flux,
		};
		return result;
	} else {
		throw new Error(`Unknown model kind`);
	}
}

export function sampleModelFromWaveArray(
	model: FitModel,
	wavelength: number[],
): { wavelength: number; flux: number }[] {
	if (
		Math.max(...wavelength) < model.range.min ||
		Math.min(...wavelength) > model.range.max
	) {
		return [];
	}
	if (model.kind === "linear") {
		const slope = model.k;
		const intercept = model.b;
		const x0 = model.x0;
		const result: { wavelength: number; flux: number }[] = wavelength.map(
			(wave) => ({
				wavelength: wave,
				flux: slope * (wave - x0) + intercept,
			}),
		);
		return result;
	} else if (model.kind === "gaussian") {
		const amplitude = model.amplitude;
		const mu = model.mu;
		const sigma = model.sigma;
		const result: { wavelength: number; flux: number }[] = wavelength.map(
			(wave) => {
				const exponent = -0.5 * ((wave - mu) / sigma) ** 2;
				return {
					wavelength: wave,
					flux: amplitude * Math.exp(exponent),
				};
			},
		);
		return result;
	} else {
		throw new Error(`Unknown model kind`);
	}
}
