import type { ExtractedSpectrum } from "@/hook/connection-hook";
import type { CollapseWindow } from "@/stores/stores-types";
import { clamp } from "@/utils/projection";
import type { Spectrum1D } from "@/utils/util-types";

export function getWavelengthSliceIndices(
	wavelength: number[],
	waveMin: number,
	waveMax: number,
): { startIdx: number; endIdx: number } {
	const dataWidth = wavelength.length;
	if (dataWidth === 0) {
		return { startIdx: 0, endIdx: -1 };
	}
	const { waveLow, waveHigh } =
		waveMin <= waveMax
			? { waveLow: waveMin, waveHigh: waveMax }
			: { waveLow: waveMax, waveHigh: waveMin };
	const waveMinClamped = clamp(
		waveLow,
		wavelength[0],
		wavelength[dataWidth - 1],
	);
	const waveMaxClamped = clamp(
		waveHigh,
		wavelength[0],
		wavelength[dataWidth - 1],
	);

	const startIdx = wavelength.findIndex((wave) => wave >= waveMinClamped);
	let endIdx = wavelength.findIndex((wave) => wave > waveMaxClamped) - 1;
	if (endIdx < 0) {
		endIdx = dataWidth - 1;
	}

	return { startIdx, endIdx };
}

export function get2DSlice(
	data2D: number[][],
	row: { startIdx: number; endIdx: number },
	col: { startIdx: number; endIdx: number },
): number[][] {
	const slicedData2D = data2D
		.slice(row.startIdx, row.endIdx + 1)
		.map((r) => r.slice(col.startIdx, col.endIdx + 1));
	return slicedData2D;
}

/**
 * Get the slice of 2D spectrum data according to collapse window.
 * @param data2D The full 2D spectrum data.
 * @param wavelength The wavelength array corresponding to data2D columns. Must be sorted ascending.
 * @param collapseWindow The collapse window.
 * @returns The sliced 2D spectrum data.
 */
export function getCollapsed2DSlice(
	data2D: number[][],
	wavelength: number[],
	collapseWindow: CollapseWindow,
): number[][] {
	const dataWidth = data2D[0]?.length || 0;
	const dataHeight = data2D.length;
	const waveWidth = wavelength.length;

	if (dataWidth !== waveWidth) {
		throw new Error(
			`Data width (${dataWidth}) does not match wavelength length (${waveWidth})`,
		);
	}

	const spaceMinClamped = clamp(collapseWindow.spatialMin, 0, dataHeight - 1);
	const spaceMaxClamped = clamp(collapseWindow.spatialMax, 0, dataHeight - 1);

	const { startIdx: waveStartIdx, endIdx: waveEndIdx } =
		getWavelengthSliceIndices(
			wavelength,
			collapseWindow.waveMin,
			collapseWindow.waveMax,
		);

	const spatialStartIdx = Math.floor(spaceMinClamped);
	const spatialEndIdx = Math.ceil(spaceMaxClamped);

	const slicedData2D = get2DSlice(
		data2D,
		{ startIdx: spatialStartIdx, endIdx: spatialEndIdx },
		{ startIdx: waveStartIdx, endIdx: waveEndIdx },
	);

	return slicedData2D;
}

export function collapseFluxAndError(
	flux2D: number[][],
	error2D: number[][],
	collapseAxis: "row" | "column" = "row",
): { flux1D: number[]; error1D: number[] } {
	const height = flux2D.length;
	const width = flux2D[0]?.length || 0;

	if (height === 0 || width === 0) {
		throw new Error("Input 2D arrays must not be empty");
	}

	if (collapseAxis === "row") {
		const flux1D = new Array<number>(width);
		const error1D = new Array<number>(width);

		for (let col = 0; col < width; col++) {
			let fluxSum = 0;
			let errorSumSq = 0;
			for (let row = 0; row < height; row++) {
				const fluxVal = flux2D[row][col];
				const errorVal = error2D[row][col];
				fluxSum += fluxVal;
				errorSumSq += errorVal * errorVal;
			}
			flux1D[col] = fluxSum;
			error1D[col] = Math.sqrt(errorSumSq);
		}

		return { flux1D, error1D };
	} else {
		const flux1D = new Array<number>(height);
		const error1D = new Array<number>(height);

		for (let row = 0; row < height; row++) {
			let fluxSum = 0;
			let errorSumSq = 0;
			for (let col = 0; col < width; col++) {
				const fluxVal = flux2D[row][col];
				const errorVal = error2D[row][col];
				fluxSum += fluxVal;
				errorSumSq += errorVal * errorVal;
			}
			flux1D[row] = fluxSum;
			error1D[row] = Math.sqrt(errorSumSq);
		}

		return { flux1D, error1D };
	}
}

/**
 * Extract 1D spectrum from the given extracted 2D spectrum
 * according to the specified collapse window.
 * @param extractedSpectrum The extracted 2D spectrum data.
 * @param collapseWindow The collapse window.
 * @param collapseAxis The axis to collapse ("row" or "column").
 * @returns The extracted 1D spectrum, or undefined if not covered.
 */
export function extract1DSpectrum(
	extractedSpectrum: ExtractedSpectrum,
	collapseWindow: CollapseWindow,
	collapseAxis: "row" | "column" = "row",
): { wavelength: number[]; flux1D: number[]; error1D: number[] } | undefined {
	if (!extractedSpectrum.covered) {
		return undefined;
	}

	const { startIdx: waveStartIdx, endIdx: waveEndIdx } =
		getWavelengthSliceIndices(
			extractedSpectrum.wavelength,
			collapseWindow.waveMin,
			collapseWindow.waveMax,
		);

	const spatialStartIdx = Math.floor(collapseWindow.spatialMin);
	const spatialEndIdx = Math.ceil(collapseWindow.spatialMax);

	const slicedData2D = get2DSlice(
		extractedSpectrum.spectrum_2d,
		{ startIdx: spatialStartIdx, endIdx: spatialEndIdx },
		{ startIdx: waveStartIdx, endIdx: waveEndIdx },
	);

	const slicedError2D = get2DSlice(
		extractedSpectrum.error_2d,
		{ startIdx: spatialStartIdx, endIdx: spatialEndIdx },
		{ startIdx: waveStartIdx, endIdx: waveEndIdx },
	);

	const slicedWavelength = extractedSpectrum.wavelength.slice(
		waveStartIdx,
		waveEndIdx + 1,
	);

	const { flux1D, error1D } = collapseFluxAndError(
		slicedData2D,
		slicedError2D,
		collapseAxis,
	);

	return {
		wavelength: slicedWavelength,
		flux1D,
		error1D,
	};
}

export function format1DSpectrum(
	wavelength: number[],
	flux1D: number[],
	error1D: number[],
): Spectrum1D[] {
	const length = Math.min(wavelength.length, flux1D.length, error1D.length);
	const spectrum1D = new Array<Spectrum1D>(length);
	for (let i = 0; i < length; i++) {
		spectrum1D[i] = {
			wavelength: wavelength[i],
			flux: flux1D[i],
			error: error1D[i],
			fluxPlusErr: flux1D[i] + error1D[i],
			fluxMinusErr: flux1D[i] - error1D[i],
		};
	}
	return spectrum1D;
}

export default function extractFormatted1DSpectrum(
	extractedSpectrum: ExtractedSpectrum,
	collapseWindow: CollapseWindow,
	collapseAxis: "row" | "column" = "row",
): Spectrum1D[] | undefined {
	const extracted1D = extract1DSpectrum(
		extractedSpectrum,
		collapseWindow,
		collapseAxis,
	);
	if (!extracted1D) {
		return;
	}
	return format1DSpectrum(
		extracted1D.wavelength,
		extracted1D.flux1D,
		extracted1D.error1D,
	);
}
