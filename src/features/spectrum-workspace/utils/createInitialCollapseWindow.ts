import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";

export function createInitialCollapseWindow({
	source,
	extractedSpectrum,
}: {
	source: Source;
	extractedSpectrum: ExtractedSpectrum;
}): Spectrum2DCanvasCollapseWindow {
	const wavelengths = extractedSpectrum.wavelength;
	const dataHeight = extractedSpectrum.spectrum_2d.length;
	const firstWave =
		wavelengths[0] ?? source.spectrum.extractionParams?.waveMinUm ?? 0;
	const lastWave =
		wavelengths[wavelengths.length - 1] ??
		source.spectrum.extractionParams?.waveMaxUm ??
		firstWave;

	return {
		waveMinUm: Math.min(firstWave, lastWave),
		waveMaxUm: Math.max(firstWave, lastWave),
		spatialMin: 0,
		spatialMax: Math.max(0, dataHeight - 1),
		outlineVisible: false,
	};
}
