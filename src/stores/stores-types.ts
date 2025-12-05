export type WaveFrame = "observe" | "rest";

export type WaveUnit = "µm" | "Å";

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
	kind: "linear";
	k: number;
	b: number;
	x0: number; // observed frame, µm
}

export interface FitGaussianModel extends BaseFitModel {
	kind: "gaussian";
	amplitude: number;
	mu: number; // observed frame, µm
	sigma: number; // observed frame, µm
}

export type FitModel = FitLinearModel | FitGaussianModel;

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

export type rgbSet = { r: string; g: string; b: string };

export type NormParams = {
	pmin: number;
	pmax: number;
	vmin?: number;
	vmax?: number;
};

export type waveRange = { min: number; max: number };

/* -------------------------------------------------------------------------- */
/*                               Footprint type                               */
/* -------------------------------------------------------------------------- */

export type RaDec = {
	ra: number;
	dec: number;
};

export type XY = {
	x: number;
	y: number;
};

export type Footprint = {
	id: string;
	vertices: RaDec[];
	meta?: Record<string, any>;
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
