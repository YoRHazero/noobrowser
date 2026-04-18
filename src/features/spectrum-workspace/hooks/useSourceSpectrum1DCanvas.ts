"use client";

import { useMemo } from "react";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasModel,
} from "@/canvas/spectrum1dCanvas";
import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import { extractCollapsedSpectrum1D } from "../utils/extractCollapsedSpectrum1D";

export interface SourceSpectrum1DCanvasReadyResult {
	model: Spectrum1DCanvasModel;
	actions?: Spectrum1DCanvasActions;
}

export function useSourceSpectrum1DCanvas({
	source,
	extractedSpectrum,
	collapseWindow,
}: {
	source: Source | null;
	extractedSpectrum: ExtractedSpectrum | null;
	collapseWindow: Spectrum2DCanvasCollapseWindow | null;
}): SourceSpectrum1DCanvasReadyResult | null {
	const points = useMemo(
		() =>
			extractedSpectrum && collapseWindow
				? extractCollapsedSpectrum1D(extractedSpectrum, collapseWindow)
				: [],
		[collapseWindow, extractedSpectrum],
	);

	if (points.length === 0 || !source) {
		return null;
	}

	return {
		model: {
			points,
			display: {
				wavelengthUnit: "um",
				wavelengthFrame: "observed",
				redshift: source.z ?? 0,
			},
			fitModels: [],
			emissionLines: [],
			labels: {
				accessibilityLabel: `${source.label ?? source.id} spectrum`,
				fluxAxis: "Flux",
				wavelengthAxis: "Observed Wavelength (um)",
			},
		},
	};
}
