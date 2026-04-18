import { useMemo } from "react";
import type { Spectrum2DCanvasProps } from "./api";
import {
	SPECTRUM_2D_CANVAS_DEFAULT_INTERPOLATION,
	SPECTRUM_2D_CANVAS_DEFAULT_LABELS,
	SPECTRUM_2D_CANVAS_EMISSION_LINE_COLOR,
} from "./shared/constants";
import type {
	Spectrum2DCanvasEmissionLineViewModel,
	Spectrum2DCanvasResolvedCollapseWindow,
	Spectrum2DCanvasResolvedDisplay,
	Spectrum2DCanvasResolvedLabels,
	Spectrum2DCanvasViewModel,
} from "./shared/types";
import { getWorldBounds } from "./utils/getWorldBounds";
import { mapSpatialToWorldY } from "./utils/mapSpatialToWorldY";
import { mapWavelengthToWorldX } from "./utils/mapWavelengthToWorldX";
import { resolveWavelengthWindowToWorldRange } from "./utils/resolveWavelengthWindowToWorldRange";

function resolveDisplay(
	props: Spectrum2DCanvasProps["model"]["display"],
): Spectrum2DCanvasResolvedDisplay {
	return {
		...props,
		interpolation:
			props.interpolation ?? SPECTRUM_2D_CANVAS_DEFAULT_INTERPOLATION,
	};
}

function resolveLabels(
	labels: Spectrum2DCanvasProps["model"]["labels"],
): Spectrum2DCanvasResolvedLabels {
	return {
		...SPECTRUM_2D_CANVAS_DEFAULT_LABELS,
		...labels,
	};
}

function resolveCollapseWindow(
	model: Spectrum2DCanvasProps["model"],
): Spectrum2DCanvasResolvedCollapseWindow | null {
	const collapseWindow = model.collapseWindow;
	if (!collapseWindow) {
		return null;
	}

	const { worldLeftX, worldRightX } = resolveWavelengthWindowToWorldRange({
		wavelengthsUm: model.axes.wavelengthsUm,
		width: model.raster.width,
		waveMinUm: collapseWindow.waveMinUm,
		waveMaxUm: collapseWindow.waveMaxUm,
	});
	const firstSpatial = mapSpatialToWorldY({
		value: collapseWindow.spatialMin,
		spatialMin: model.axes.spatialMin,
		spatialMax: model.axes.spatialMax,
		height: model.raster.height,
	});
	const secondSpatial = mapSpatialToWorldY({
		value: collapseWindow.spatialMax,
		spatialMin: model.axes.spatialMin,
		spatialMax: model.axes.spatialMax,
		height: model.raster.height,
	});

	return {
		...collapseWindow,
		worldLeftX: Math.min(worldLeftX, worldRightX),
		worldRightX: Math.max(worldLeftX, worldRightX),
		worldTopY: Math.max(firstSpatial, secondSpatial),
		worldBottomY: Math.min(firstSpatial, secondSpatial),
	};
}

function resolveEmissionLines(
	model: Spectrum2DCanvasProps["model"],
): Spectrum2DCanvasEmissionLineViewModel[] {
	const emissionLines = model.emissionLines ?? [];
	if (emissionLines.length === 0) {
		return [];
	}

	return emissionLines.flatMap((line) => {
		if (line.visible === false) {
			return [];
		}

		const worldX = mapWavelengthToWorldX({
			valueUm: line.observedWavelengthUm,
			wavelengthsUm: model.axes.wavelengthsUm,
			width: model.raster.width,
		});
		if (worldX === null) {
			return [];
		}

		return [
			{
				...line,
				color: line.color ?? SPECTRUM_2D_CANVAS_EMISSION_LINE_COLOR,
				worldX,
			},
		];
	});
}

export function useSpectrum2DCanvas({
	model,
}: Spectrum2DCanvasProps): Spectrum2DCanvasViewModel {
	const display = useMemo(() => resolveDisplay(model.display), [model.display]);
	const labels = useMemo(() => resolveLabels(model.labels), [model.labels]);
	const worldBounds = useMemo(
		() => getWorldBounds(model.raster.width, model.raster.height),
		[model.raster.height, model.raster.width],
	);
	const collapseWindow = useMemo(() => resolveCollapseWindow(model), [model]);
	const emissionLines = useMemo(() => resolveEmissionLines(model), [model]);
	const spatialCenterWorldY = useMemo(
		() =>
			mapSpatialToWorldY({
				value: (model.axes.spatialMin + model.axes.spatialMax) / 2,
				spatialMin: model.axes.spatialMin,
				spatialMax: model.axes.spatialMax,
				height: model.raster.height,
			}),
		[model.axes.spatialMax, model.axes.spatialMin, model.raster.height],
	);
	const hasDrawableRaster =
		model.raster.width > 0 &&
		model.raster.height > 0 &&
		model.raster.data.length >= model.raster.width * model.raster.height;

	return {
		raster: model.raster,
		display,
		labels,
		worldBounds,
		hasDrawableRaster,
		collapseWindow,
		showSpatialCenterLine: model.guides?.showSpatialCenterLine ?? false,
		spatialCenterWorldY,
		emissionLines,
	};
}
