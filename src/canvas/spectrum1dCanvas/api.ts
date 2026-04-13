export interface Spectrum1DCanvasProps {
	model: Spectrum1DCanvasModel;
	actions: Spectrum1DCanvasActions;
}

export interface Spectrum1DCanvasModel {
	points: Spectrum1DCanvasPoint[];
	sliceRange: Spectrum1DCanvasWaveRange;
	display: Spectrum1DCanvasDisplayModel;
	fitModels: Spectrum1DCanvasFitModel[];
	emissionLines: Spectrum1DCanvasEmissionLineModel[];
	visibility?: Spectrum1DCanvasVisibilityModel;
	layout?: Spectrum1DCanvasLayoutModel;
	labels?: Spectrum1DCanvasLabelsModel;
}

export interface Spectrum1DCanvasActions {
	setSliceRange: (range: Spectrum1DCanvasWaveRange) => void;
	updateFitModel?: (
		modelId: number,
		patch: Spectrum1DCanvasFitModelPatch,
	) => void;
	commitFitModelEdit?: (modelId: number) => void;
}

export interface Spectrum1DCanvasPoint {
	wavelengthUm: number;
	flux: number;
	error: number;
}

export interface Spectrum1DCanvasWaveRange {
	minUm: number;
	maxUm: number;
}

export interface Spectrum1DCanvasDisplayModel {
	wavelengthUnit: Spectrum1DCanvasWavelengthUnit;
	wavelengthFrame: Spectrum1DCanvasWavelengthFrame;
	redshift: number;
	wavelengthDigits?: number;
}

export interface Spectrum1DCanvasEmissionLineModel {
	id: string;
	label: string;
	restWavelengthUm: number;
	color?: string;
}

export type Spectrum1DCanvasFitModel =
	| Spectrum1DCanvasLinearFitModel
	| Spectrum1DCanvasGaussianFitModel;

export interface Spectrum1DCanvasBaseFitModel {
	id: number;
	label: string;
	active: boolean;
	subtractFromSlice: boolean;
	color: string;
	range: Spectrum1DCanvasWaveRange;
}

export interface Spectrum1DCanvasLinearFitModel
	extends Spectrum1DCanvasBaseFitModel {
	kind: "linear";
	k: number;
	b: number;
	x0Um: number;
}

export interface Spectrum1DCanvasGaussianFitModel
	extends Spectrum1DCanvasBaseFitModel {
	kind: "gaussian";
	amplitude: number;
	muUm: number;
	sigmaUm: number;
}

export type Spectrum1DCanvasFitModelPatch =
	| {
			kind: "linear";
			patch: Partial<
				Pick<Spectrum1DCanvasLinearFitModel, "b" | "k" | "range" | "x0Um">
			>;
	  }
	| {
			kind: "gaussian";
			patch: Partial<
				Pick<
					Spectrum1DCanvasGaussianFitModel,
					"amplitude" | "muUm" | "range" | "sigmaUm"
				>
			>;
	  };

export interface Spectrum1DCanvasVisibilityModel {
	overview?: boolean;
	brush?: boolean;
	slice?: boolean;
	errorBand?: boolean;
	emissionLines?: boolean;
	fitCurves?: boolean;
	fitHandles?: boolean;
	hover?: boolean;
}

export interface Spectrum1DCanvasLayoutModel {
	margin?: Spectrum1DCanvasMargin;
	heightRatio?: Spectrum1DCanvasHeightRatio;
}

export interface Spectrum1DCanvasMargin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface Spectrum1DCanvasHeightRatio {
	overview: number;
	slice: number;
	gap: number;
}

export interface Spectrum1DCanvasLabelsModel {
	accessibilityLabel?: string;
	fluxAxis?: string;
	wavelengthAxis?: string;
}

export type Spectrum1DCanvasWavelengthUnit = "um" | "angstrom";

export type Spectrum1DCanvasWavelengthFrame = "observed" | "rest";
