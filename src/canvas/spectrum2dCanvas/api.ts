export interface Spectrum2DCanvasProps {
	model: Spectrum2DCanvasModel;
	actions?: Spectrum2DCanvasActions;
}

export interface Spectrum2DCanvasModel {
	raster: Spectrum2DCanvasRasterModel;
	axes: Spectrum2DCanvasAxesModel;
	display: Spectrum2DCanvasDisplayModel;
	collapseWindow?: Spectrum2DCanvasCollapseWindow;
	guides?: Spectrum2DCanvasGuidesModel;
	emissionLines?: Spectrum2DCanvasEmissionLineModel[];
	labels?: Spectrum2DCanvasLabelsModel;
}

export interface Spectrum2DCanvasActions {
	setCollapseWindow?: (window: Spectrum2DCanvasCollapseWindow) => void;
	commitCollapseWindowEdit?: (window: Spectrum2DCanvasCollapseWindow) => void;
}

export interface Spectrum2DCanvasRasterModel {
	data: Float32Array | Uint16Array;
	width: number;
	height: number;
	dataType: Spectrum2DCanvasRasterDataType;
}

export interface Spectrum2DCanvasAxesModel {
	wavelengthsUm: number[];
	spatialMin: number;
	spatialMax: number;
}

export interface Spectrum2DCanvasDisplayModel {
	norm: Spectrum2DCanvasNorm;
	colorMap: Spectrum2DCanvasColorMap;
	interpolation?: Spectrum2DCanvasInterpolation;
}

export interface Spectrum2DCanvasCollapseWindow {
	waveMinUm: number;
	waveMaxUm: number;
	spatialMin: number;
	spatialMax: number;
	outlineVisible: boolean;
}

export interface Spectrum2DCanvasGuidesModel {
	showSpatialCenterLine?: boolean;
}

export interface Spectrum2DCanvasEmissionLineModel {
	id: string;
	label: string;
	observedWavelengthUm: number;
	color?: string;
	visible?: boolean;
}

export interface Spectrum2DCanvasLabelsModel {
	accessibilityLabel?: string;
	wavelengthAxis?: string;
	spatialAxis?: string;
}

export interface Spectrum2DCanvasLinearNorm {
	kind: "linear";
	min: number;
	max: number;
}

export interface Spectrum2DCanvasLogNorm {
	kind: "log";
	min: number;
	max: number;
	floor?: number;
}

export interface Spectrum2DCanvasAsinhNorm {
	kind: "asinh";
	min: number;
	max: number;
	softness?: number;
}

export type Spectrum2DCanvasNorm =
	| Spectrum2DCanvasLinearNorm
	| Spectrum2DCanvasLogNorm
	| Spectrum2DCanvasAsinhNorm;

export type Spectrum2DCanvasRasterDataType = "float32" | "uint16";

export type Spectrum2DCanvasColorMap =
	| "gray"
	| "viridis"
	| "magma"
	| "plasma"
	| "inferno";

export type Spectrum2DCanvasInterpolation = "nearest" | "linear";
