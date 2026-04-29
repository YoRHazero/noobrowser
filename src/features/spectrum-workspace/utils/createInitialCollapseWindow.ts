import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import { getSpectrumWorkspaceWaveBounds } from "./getSpectrumWorkspaceWaveBounds";
import { roundSpectrumWorkspaceWaveValue } from "./roundSpectrumWorkspaceWaveValue";

function resolveInitialSpatialWindow(dataHeight: number): {
	spatialMin: number;
	spatialMax: number;
} {
	const lastSpatialPixel = Math.max(0, dataHeight - 1);
	const spatialCenter = lastSpatialPixel / 2;
	const halfWindowSize = Math.round(dataHeight / 10);

	return {
		spatialMin: Math.max(0, Math.round(spatialCenter - halfWindowSize)),
		spatialMax: Math.min(
			lastSpatialPixel,
			Math.round(spatialCenter + halfWindowSize),
		),
	};
}

export function createInitialCollapseWindow({
	source,
	extractedSpectrum,
}: {
	source: Source;
	extractedSpectrum: ExtractedSpectrum;
}): Spectrum2DCanvasCollapseWindow {
	const wavelengths = extractedSpectrum.wavelength;
	const dataHeight = extractedSpectrum.spectrum_2d.length;
	const fallbackMin = roundSpectrumWorkspaceWaveValue(
		source.spectrum.extractionParams?.waveMinUm ?? 0,
	);
	const fallbackMax = roundSpectrumWorkspaceWaveValue(
		source.spectrum.extractionParams?.waveMaxUm ?? fallbackMin,
	);
	const waveBounds =
		wavelengths.length > 0
			? getSpectrumWorkspaceWaveBounds(wavelengths, fallbackMin)
			: {
					min: Math.min(fallbackMin, fallbackMax),
					max: Math.max(fallbackMin, fallbackMax),
				};
	const spatialWindow = resolveInitialSpatialWindow(dataHeight);

	return {
		waveMinUm: waveBounds.min,
		waveMaxUm: waveBounds.max,
		spatialMin: spatialWindow.spatialMin,
		spatialMax: spatialWindow.spatialMax,
		outlineVisible: true,
	};
}
