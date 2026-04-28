import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { SpectrumWorkspaceDisplaySampleSource } from "../shared/types";
import { filterSpectrumWorkspaceWaveColumnIndices } from "./filterSpectrumWorkspaceWaveColumnIndices";
import { resolveSpectrumWorkspaceSpatialRowRange } from "./resolveSpectrumWorkspaceSpatialRowRange";

function extractAllFiniteValues(
	extractedSpectrum: ExtractedSpectrum,
): number[] {
	const values: number[] = [];

	for (const row of extractedSpectrum.spectrum_2d) {
		for (const value of row) {
			if (Number.isFinite(value)) {
				values.push(value);
			}
		}
	}

	return values;
}

export function extractSpectrum2DDisplaySampleValues({
	extractedSpectrum,
	collapseWindow,
	sampleSource,
}: {
	extractedSpectrum: ExtractedSpectrum;
	collapseWindow: Spectrum2DCanvasCollapseWindow | null;
	sampleSource: SpectrumWorkspaceDisplaySampleSource;
}): number[] {
	if (!extractedSpectrum.covered) {
		return [];
	}

	if (sampleSource === "full" || collapseWindow === null) {
		return extractAllFiniteValues(extractedSpectrum);
	}

	const waveColumnIndices = filterSpectrumWorkspaceWaveColumnIndices({
		wavelengths: extractedSpectrum.wavelength,
		waveMinUm: collapseWindow.waveMinUm,
		waveMaxUm: collapseWindow.waveMaxUm,
	});
	const spatialRange = resolveSpectrumWorkspaceSpatialRowRange({
		rowCount: extractedSpectrum.spectrum_2d.length,
		spatialMin: collapseWindow.spatialMin,
		spatialMax: collapseWindow.spatialMax,
	});

	if (waveColumnIndices.length === 0 || !spatialRange) {
		return [];
	}

	const values: number[] = [];
	for (
		let rowIndex = spatialRange.startIndex;
		rowIndex <= spatialRange.endIndex;
		rowIndex += 1
	) {
		const row = extractedSpectrum.spectrum_2d[rowIndex] ?? [];
		for (const columnIndex of waveColumnIndices) {
			const value = row[columnIndex];
			if (Number.isFinite(value)) {
				values.push(value);
			}
		}
	}

	return values;
}
