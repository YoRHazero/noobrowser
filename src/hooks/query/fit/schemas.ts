/* -------------------------------------------------------------------------- */
/*                                 Job Status                                 */
/* -------------------------------------------------------------------------- */
export type JobStatus = "pending" | "processing" | "completed" | "failed" | "saved";

/* -------------------------------------------------------------------------- */
/*                               Fit Model Types                              */
/* -------------------------------------------------------------------------- */
export type FitModelType = "linear" | "gaussian";

export type FitRange = {
	min: number;
	max: number;
	// Optional validation logic usually handled in code, not type
};

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
	refParam?: string;
}

export type FitPrior =
	| UniformPrior
	| NormalPrior
	| TruncatedNormalPrior
	| FixedPrior
	| DeterministicPrior;

export interface BaseFitModel {
	id: number;
	kind: FitModelType;
	name: string;
	active: boolean;
	subtracted: boolean;
	range: FitRange;
	color: string;
}

export interface FitLinearModel extends BaseFitModel {
	kind: "linear";
	k: number;
	b: number;
	x0: number;
	priors?: {
		k?: FitPrior;
		b?: FitPrior;
	};
}

export interface FitGaussianModel extends BaseFitModel {
	kind: "gaussian";
	amplitude: number;
	mu: number;
	sigma: number;
	priors?: {
		amplitude?: FitPrior;
		mu?: FitPrior;
		sigma?: FitPrior;
	};
}

export type FitModel = FitLinearModel | FitGaussianModel;

/* -------------------------------------------------------------------------- */
/*                             Request Schemas                                */
/* -------------------------------------------------------------------------- */
export type ExtractionConfiguration = {
	aperture_size?: number;
	offset?: number;
	extract_mode?: "GRISMR" | "GRISMC";
	wavelength_range?: {
		min: number;
		max: number;
	};
};

export type SourceMetaBodyRequest = {
	source_id: string;
	ra?: number;
	dec?: number;
	x?: number;
	y?: number;
	ref_basename?: string;
	group_id?: number | null;
	z?: number;
};

export type ExtractionConfigBodyRequest = {
	extraction_config: ExtractionConfiguration;
	source_meta: SourceMetaBodyRequest;
};

export type FitConfiguration = {
	model_name: string;
	models: FitModel[];
};

export type FitBodyRequest = {
	extraction: ExtractionConfigBodyRequest;
	fit: FitConfiguration[];
};

/* -------------------------------------------------------------------------- */
/*                             Response Schemas                               */
/* -------------------------------------------------------------------------- */

export type FitJobStatusResponse = {
	job_id: string;
	status: JobStatus;
	error: string | null;
};

export type DeleteFitJobResponse = {
	detail: string;
};

export type ComponentSummary = {
	name: string;
	physical_name: string | null;
	component_type: string; // "gaussian", "linear"

	// Common metrics
	amplitude: number | null;
	amplitude_error: number | null;

	fwhm_kms: number | null;
	fwhm_kms_error: number | null;

	// Line Center / Offset
	center: number | null;
	center_error: number | null;
};

export type ModelSummary = {
	model_name: string;
	waic: number;
	waic_se: number;
	is_best: boolean;
	components: ComponentSummary[];
};

export type FitSourceSummary = {
	source_id: string;
	ra: number | null;
	dec: number | null;
	ra_hms: string | null;
	dec_dms: string | null;
	x: number | null;
	y: number | null;
	z: number | null;
	ref_basename: string | null;
	group_id: number | null;
};

export type FitJobSummaryResponse = {
	job_id: string;
	created_at: string | null;
	best_model_name: string | null;
	source: FitSourceSummary | null;
	results: ModelSummary[];
};
