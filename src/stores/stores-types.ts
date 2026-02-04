/* -------------------------------------------------------------------------- */
/*                                   Common                                   */
/* -------------------------------------------------------------------------- */
export type WaveFrame = "observe" | "rest";

export type WaveUnit = "µm" | "Å";

export type RaDec = {
	ra: number;
	dec: number;
};

export type XY = {
	x: number;
	y: number;
};

export type MetaPosition = {
	ra?: number;
	dec?: number;
	x?: number;
	y?: number;
	ref_basename?: string;
	group_id?: string;
};

/* -------------------------------------------------------------------------- */
/*                               Fit Prior Type                               */
/* -------------------------------------------------------------------------- */
export type PriorType =
	| "Uniform"
	| "Normal"
	| "TruncatedNormal"
	| "Fixed"
	| "Deterministic";

export interface BaseFitPrior {
	type: PriorType;
}

export interface UniformPrior extends BaseFitPrior {
	type: "Uniform";
	lower: number;
	upper: number;
}

export interface NormalPrior extends BaseFitPrior {
	type: "Normal";
	mu: number;
	sigma: number;
}

export interface TruncatedNormalPrior extends BaseFitPrior {
	type: "TruncatedNormal";
	mu: number;
	sigma: number;
	lower?: number;
	upper?: number;
}

export interface FixedPrior extends BaseFitPrior {
	type: "Fixed";
	value: number;
}

export interface DeterministicPrior extends BaseFitPrior {
	type: "Deterministic";
	mode: "add" | "multiply";
	value: number;
	refModelId: number;
	refParam?: string; // If undefined, use the the same parameter name in the ref model
}

export type FitPrior =
	| UniformPrior
	| NormalPrior
	| TruncatedNormalPrior
	| FixedPrior
	| DeterministicPrior;

/* -------------------------------------------------------------------------- */
/*                               Fit Model Type                               */
/* -------------------------------------------------------------------------- */

export type FitModelType = "linear" | "gaussian";

export type FitRange = {
	min: number; // observed frame, µm
	max: number; // observed frame, µm
};
export interface BaseFitModel {
	id: number; // 1-based index over all models (linear first, then gaussian)
	kind: FitModelType;
	name: string;
	active: boolean;
	subtracted: boolean; // whether subtract this model from the spectrum in slice view
	range: FitRange; // observed frame, µm
	color: string; // Hex color code
}

export interface FitLinearModel extends BaseFitModel {
	// k(x - x0) + b
	kind: "linear";
	k: number;
	b: number;
	x0: number; // observed frame, µm
	priors?: {
		k?: FitPrior;
		b?: FitPrior;
	};
}

export interface FitGaussianModel extends BaseFitModel {
	// A * exp(-0.5 * ((x - µ) / σ)^2)
	kind: "gaussian";
	amplitude: number;
	mu: number; // observed frame, µm
	sigma: number; // observed frame, µm
	priors?: {
		amplitude?: FitPrior;
		mu?: FitPrior;
		sigma?: FitPrior;
	};
}

export type FitModel = FitLinearModel | FitGaussianModel;

export type FitConfiguration = {
	id: string; // UUID
	name: string;
	models: FitModel[];
	selected: boolean;
};

export type FitExtractionSettings = {
	apertureSize: number;
	offset: number;
	extractMode: "GRISMR" | "GRISMC";
};

/* -------------------------------------------------------------------------- */
/*                                 Image Type                                 */
/* -------------------------------------------------------------------------- */
export type CutoutParams = {
	x0: number;
	y0: number;
	width: number;
	height: number;
};

export type CounterpartPosition = {
	x0: number;
	y0: number;
	width: number;
	height: number;
};

export type CollapseWindow = {
	waveMin: number;
	waveMax: number;
	spatialMin: number;
	spatialMax: number;
};

export type RGBSet = { r: string; g: string; b: string };

export type NormParams = {
	pmin: number;
	pmax: number;
	vmin?: number;
	vmax?: number;
};

export type WaveRange = { min: number; max: number };

export type RoiState = {
	x: number;
	y: number;
	width: number;
	height: number;
};

/* -------------------------------------------------------------------------- */
/*                               Footprint type                               */
/* -------------------------------------------------------------------------- */

export type FootprintMeta = {
	included_files?: string[];
	selected_file?: string | null;
	center?: RaDec;
	[key: string]: unknown;
};

export type Footprint = {
	id: string;
	vertices: RaDec[];
	meta?: FootprintMeta;
};

export type ViewState = {
	yawDeg: number;
	pitchDeg: number;
	scale: number;
};

export type BackgroundState = {
	centerX: number;
	centerY: number;
	initialRadius: number;
};

export type GridState = {
	showGrid: boolean;
	meridianStep: number;
	parallelStep: number;
};
/* -------------------------------------------------------------------------- */
/*                                Sources Type                                */
/* -------------------------------------------------------------------------- */
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type TraceSource = {
	id: string;
	x: number;
	y: number;
	color: string;
	spectrumReady: boolean;
	ra: number;
	dec: number;
	z?: number;
	raHms?: string;
	decDms?: string;
	groupId?: string | null;
	roi?: {
		roiState: RoiState;
		collapseWindow: CollapseWindow;
	};
	fitState?: {
		jobId?: string;
		jobStatus?: JobStatus;
	};
};
