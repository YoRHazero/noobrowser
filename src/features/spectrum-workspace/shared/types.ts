import type {
	Spectrum1DCanvasWavelengthFrame,
	Spectrum1DCanvasWavelengthUnit,
} from "@/canvas/spectrum1dCanvas";
import type {
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasNorm,
} from "@/canvas/spectrum2dCanvas";

export type SpectrumWorkspaceDisplayNormKind = Spectrum2DCanvasNorm["kind"];
export type SpectrumWorkspaceDisplayRangeMode = "percentile" | "absolute";
export type SpectrumWorkspaceDisplaySampleSource = "window" | "full";
export type SpectrumWorkspaceHudTab = "display" | "extraction";
export type SpectrumWorkspaceWavelengthFrame = Spectrum1DCanvasWavelengthFrame;
export type SpectrumWorkspaceWavelengthUnit = Spectrum1DCanvasWavelengthUnit;

export interface SpectrumWorkspaceDisplayState {
	colorMap: Spectrum2DCanvasColorMap;
	normKind: SpectrumWorkspaceDisplayNormKind;
	rangeMode: SpectrumWorkspaceDisplayRangeMode;
	pmin: number;
	pmax: number;
	sampleSource: SpectrumWorkspaceDisplaySampleSource;
	vmin: number;
	vmax: number;
}

export interface SpectrumWorkspaceWavelengthDisplayState {
	redshift: number;
	redshiftStep: number;
	wavelengthFrame: SpectrumWorkspaceWavelengthFrame;
	wavelengthUnit: SpectrumWorkspaceWavelengthUnit;
}
