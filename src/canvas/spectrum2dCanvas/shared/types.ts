import type {
	Spectrum2DCanvasCollapseWindow,
	Spectrum2DCanvasDisplayModel,
	Spectrum2DCanvasEmissionLineModel,
	Spectrum2DCanvasLabelsModel,
	Spectrum2DCanvasModel,
} from "../api";

export interface Spectrum2DCanvasWorldBounds {
	left: number;
	right: number;
	top: number;
	bottom: number;
	width: number;
	height: number;
	centerX: number;
	centerY: number;
}

export interface Spectrum2DCanvasResolvedDisplay
	extends Spectrum2DCanvasDisplayModel {
	interpolation: NonNullable<Spectrum2DCanvasDisplayModel["interpolation"]>;
}

export interface Spectrum2DCanvasResolvedLabels
	extends Required<Spectrum2DCanvasLabelsModel> {}

export interface Spectrum2DCanvasResolvedCollapseWindow
	extends Spectrum2DCanvasCollapseWindow {
	worldLeftX: number;
	worldRightX: number;
	worldTopY: number;
	worldBottomY: number;
}

export interface Spectrum2DCanvasEmissionLineViewModel
	extends Spectrum2DCanvasEmissionLineModel {
	color: string;
	worldX: number;
}

export interface Spectrum2DCanvasViewModel {
	raster: Spectrum2DCanvasModel["raster"];
	display: Spectrum2DCanvasResolvedDisplay;
	labels: Spectrum2DCanvasResolvedLabels;
	worldBounds: Spectrum2DCanvasWorldBounds;
	hasDrawableRaster: boolean;
	collapseWindow: Spectrum2DCanvasResolvedCollapseWindow | null;
	showSpatialCenterLine: boolean;
	spatialCenterWorldY: number;
	emissionLines: Spectrum2DCanvasEmissionLineViewModel[];
}
