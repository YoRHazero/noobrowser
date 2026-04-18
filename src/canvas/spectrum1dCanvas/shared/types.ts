import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasHeightRatio,
	Spectrum1DCanvasMargin,
	Spectrum1DCanvasPoint,
	Spectrum1DCanvasWaveRange,
} from "../api";

export type SpectrumPoint = Spectrum1DCanvasPoint;
export type WaveRange = Spectrum1DCanvasWaveRange;
export type FitModel = Spectrum1DCanvasFitModel;

export interface ScreenPoint {
	x: number;
	y: number;
}

export interface ScreenAnchor {
	left: number;
	top: number;
}

export interface ChartSize {
	width: number;
	height: number;
}

export interface Spectrum1DCanvasChartLayout {
	chartWidth: number;
	overviewHeight: number;
	brushHeight: number;
	sliceHeight: number;
	overviewAnchor: ScreenAnchor;
	sliceAnchor: ScreenAnchor;
	margin: Spectrum1DCanvasMargin;
	heightRatio: Spectrum1DCanvasHeightRatio;
}

export interface Spectrum1DCanvasSpectrumStats {
	wavelengthsUm: number[];
	wavelengthMinUm: number;
	wavelengthMaxUm: number;
	fluxMin: number;
	fluxMax: number;
}

export interface Spectrum1DCanvasTooltipData {
	point: SpectrumPoint;
	axis: ScreenPoint;
	pointer: ScreenPoint;
}

export interface Spectrum1DCanvasTooltipViewModel {
	left: number;
	top: number;
	wavelengthText: string;
	fluxText: string;
	errorText: string;
}

export interface Spectrum1DCanvasSampledPoint {
	wavelengthUm: number;
	flux: number;
}

export type Spectrum1DCanvasFitHandleDrag =
	| {
			type: "gaussian-peak";
			modelId: number;
			lastPointer: ScreenPoint;
	  }
	| {
			type: "gaussian-sigma-left" | "gaussian-sigma-right";
			modelId: number;
			lastPointerX: number;
	  }
	| {
			type: "linear-x0";
			modelId: number;
			lastPointer: ScreenPoint;
	  }
	| {
			type: "linear-left" | "linear-right";
			modelId: number;
			lastPointerY: number;
	  };
