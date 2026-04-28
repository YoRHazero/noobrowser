import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { filterSpectrumWorkspaceWaveColumnIndices } from "./filterSpectrumWorkspaceWaveColumnIndices";
import { resolveSpectrumWorkspaceSpatialRowRange } from "./resolveSpectrumWorkspaceSpatialRowRange";

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

	const waveColumnIndices = filterSpectrumWorkspaceWaveColumnIndices({
		wavelengths,
		waveMinUm: collapseWindow.waveMinUm,
		waveMaxUm: collapseWindow.waveMaxUm,
	});
	if (waveColumnIndices.length === 0) {
		return [];
	}

	const spatialRange = resolveSpectrumWorkspaceSpatialRowRange({
		rowCount,
		spatialMin: collapseWindow.spatialMin,
		spatialMax: collapseWindow.spatialMax,
	});
	if (!spatialRange) {
		return [];
	}

	const points: CollapsedSpectrumPoint[] = [];
	for (const columnIndex of waveColumnIndices) {
		const wavelengthUm = wavelengths[columnIndex];
		if (!Number.isFinite(wavelengthUm)) {
			continue;
		}

		let flux = 0;
		let errorSumSq = 0;
		let hasSample = false;

		for (
			let rowIndex = spatialRange.startIndex;
			rowIndex <= spatialRange.endIndex;
			rowIndex += 1
		) {
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
