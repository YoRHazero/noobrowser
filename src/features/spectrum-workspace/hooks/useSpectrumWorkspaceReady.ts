"use client";

import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../shared/types";
import { useSourceSpectrum1DCanvas } from "./useSourceSpectrum1DCanvas";
import { useSourceSpectrum2DCanvas } from "./useSourceSpectrum2DCanvas";
import { useSpectrumWorkspaceCanvasEmissionLines } from "./useSpectrumWorkspaceCanvasEmissionLines";
import { useSpectrumWorkspaceControls } from "./useSpectrumWorkspaceControls";

export interface SpectrumWorkspaceReadyResult {
	state: "ready";
	spectrum1d: NonNullable<ReturnType<typeof useSourceSpectrum1DCanvas>>;
	spectrum2d: NonNullable<ReturnType<typeof useSourceSpectrum2DCanvas>>;
}

export function useSpectrumWorkspaceReady({
	source,
	extractedSpectrum,
	wavelengthDisplay,
}: {
	source: Source | null;
	extractedSpectrum: ExtractedSpectrum | null;
	wavelengthDisplay: SpectrumWorkspaceWavelengthDisplayState;
}): SpectrumWorkspaceReadyResult | null {
	const controls = useSpectrumWorkspaceControls({
		source,
		extractedSpectrum,
	});
	const canvasEmissionLines = useSpectrumWorkspaceCanvasEmissionLines({
		redshift: wavelengthDisplay.redshift,
	});
	const spectrum2d = useSourceSpectrum2DCanvas({
		source,
		extractedSpectrum,
		controls,
		emissionLines: canvasEmissionLines.spectrum2dEmissionLines,
	});
	const spectrum1d = useSourceSpectrum1DCanvas({
		source,
		extractedSpectrum,
		collapseWindow: controls?.collapseWindow ?? null,
		wavelengthDisplay,
		emissionLines: canvasEmissionLines.spectrum1dEmissionLines,
	});

	if (!source || !extractedSpectrum || !controls) {
		return null;
	}

	if (spectrum2d === null || spectrum1d === null) {
		return null;
	}

	return {
		state: "ready",
		spectrum1d,
		spectrum2d,
	};
}
