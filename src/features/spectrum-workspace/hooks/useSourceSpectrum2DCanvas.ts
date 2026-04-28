"use client";

import { useMemo } from "react";
import type {
	Spectrum2DCanvasActions,
	Spectrum2DCanvasEmissionLineModel,
	Spectrum2DCanvasModel,
	Spectrum2DCanvasRasterModel,
} from "@/canvas/spectrum2dCanvas";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import type { Source } from "@/stores/source";
import type { SpectrumWorkspaceControls } from "./useSpectrumWorkspaceControls";

function buildRasterModel(
	extractedSpectrum: ExtractedSpectrum,
): Spectrum2DCanvasRasterModel | null {
	const width = extractedSpectrum.wavelength.length;
	const height = extractedSpectrum.spectrum_2d.length;
	if (width === 0 || height === 0) {
		return null;
	}

	const data = new Float32Array(width * height);
	for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
		const row = extractedSpectrum.spectrum_2d[rowIndex] ?? [];
		for (let columnIndex = 0; columnIndex < width; columnIndex += 1) {
			const value = row[columnIndex];
			data[rowIndex * width + columnIndex] = Number.isFinite(value)
				? value
				: Number.NaN;
		}
	}

	return {
		data,
		width,
		height,
		dataType: "float32",
	};
}

export interface SourceSpectrum2DCanvasReadyResult {
	model: Spectrum2DCanvasModel;
	actions: Spectrum2DCanvasActions;
}

export function useSourceSpectrum2DCanvas({
	source,
	extractedSpectrum,
	controls,
	emissionLines,
}: {
	source: Source | null;
	extractedSpectrum: ExtractedSpectrum | null;
	controls: SpectrumWorkspaceControls | null;
	emissionLines: Spectrum2DCanvasEmissionLineModel[];
}): SourceSpectrum2DCanvasReadyResult | null {
	const raster = useMemo(
		() => (extractedSpectrum ? buildRasterModel(extractedSpectrum) : null),
		[extractedSpectrum],
	);

	if (!raster || !source || !extractedSpectrum || !controls) {
		return null;
	}

	return {
		model: {
			raster,
			axes: {
				wavelengthsUm: extractedSpectrum.wavelength,
				spatialMin: 0,
				spatialMax: Math.max(0, raster.height - 1),
			},
			display: controls.display,
			collapseWindow: controls.collapseWindow,
			guides: {
				showSpatialCenterLine: controls.showSpatialCenterLine,
			},
			emissionLines,
			labels: {
				accessibilityLabel: `${source.label ?? source.id} 2D spectrum`,
				wavelengthAxis: "Observed Wavelength (um)",
				spatialAxis: "Spatial",
			},
		},
		actions: {
			setCollapseWindow: controls.setCollapseWindow,
			commitCollapseWindowEdit: controls.commitCollapseWindowEdit,
		},
	};
}
