import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";

export interface SpectrumWorkspaceCollapseWindowLike {
	waveMinUm: number;
	waveMaxUm: number;
	spatialMin: number;
	spatialMax: number;
}

export interface CollapsedSpectrumPoint {
	wavelengthUm: number;
	flux: number;
	error: number;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function resolveWaveColumnRange(
	wavelengths: number[],
	waveMinUm: number,
	waveMaxUm: number,
): { startIndex: number; endIndex: number } | null {
	if (wavelengths.length === 0) {
		return null;
	}

	const firstWave = wavelengths[0];
	const lastWave = wavelengths[wavelengths.length - 1];
	const low = clamp(Math.min(waveMinUm, waveMaxUm), firstWave, lastWave);
	const high = clamp(Math.max(waveMinUm, waveMaxUm), firstWave, lastWave);

	let startIndex = wavelengths.findIndex((value) => value >= low);
	if (startIndex < 0) {
		startIndex = 0;
	}

	let endIndex = wavelengths.findIndex((value) => value > high) - 1;
	if (endIndex < 0) {
		endIndex = wavelengths.length - 1;
	}

	if (endIndex < startIndex) {
		return null;
	}

	return { startIndex, endIndex };
}

export function extractCollapsedSpectrum1D(
	extractedSpectrum: ExtractedSpectrum,
	collapseWindow: SpectrumWorkspaceCollapseWindowLike,
): CollapsedSpectrumPoint[] {
	if (!extractedSpectrum.covered) {
		return [];
	}

	const wavelengths = extractedSpectrum.wavelength;
	const fluxRows = extractedSpectrum.spectrum_2d;
	const errorRows = extractedSpectrum.error_2d;
	const rowCount = Math.min(fluxRows.length, errorRows.length);

	if (wavelengths.length === 0 || rowCount === 0) {
		return [];
	}

	const waveRange = resolveWaveColumnRange(
		wavelengths,
		collapseWindow.waveMinUm,
		collapseWindow.waveMaxUm,
	);
	if (!waveRange) {
		return [];
	}

	const spatialStart = Math.floor(
		clamp(
			Math.min(collapseWindow.spatialMin, collapseWindow.spatialMax),
			0,
			rowCount - 1,
		),
	);
	const spatialEnd = Math.ceil(
		clamp(
			Math.max(collapseWindow.spatialMin, collapseWindow.spatialMax),
			0,
			rowCount - 1,
		),
	);

	const points: CollapsedSpectrumPoint[] = [];
	for (
		let columnIndex = waveRange.startIndex;
		columnIndex <= waveRange.endIndex;
		columnIndex += 1
	) {
		const wavelengthUm = wavelengths[columnIndex];
		if (!Number.isFinite(wavelengthUm)) {
			continue;
		}

		let flux = 0;
		let errorSumSq = 0;
		let hasSample = false;

		for (let rowIndex = spatialStart; rowIndex <= spatialEnd; rowIndex += 1) {
			const fluxValue = fluxRows[rowIndex]?.[columnIndex];
			const errorValue = errorRows[rowIndex]?.[columnIndex];
			if (!Number.isFinite(fluxValue) || !Number.isFinite(errorValue)) {
				continue;
			}

			flux += fluxValue;
			errorSumSq += errorValue * errorValue;
			hasSample = true;
		}

		if (!hasSample) {
			continue;
		}

		points.push({
			wavelengthUm,
			flux,
			error: Math.sqrt(errorSumSq),
		});
	}

	return points;
}
