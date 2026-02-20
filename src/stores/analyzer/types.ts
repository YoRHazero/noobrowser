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
	refParam?: string; // If undefined, use the same parameter name in the ref model
}

export type FitPrior =
	| UniformPrior
	| NormalPrior
	| TruncatedNormalPrior
	| FixedPrior
	| DeterministicPrior;

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
