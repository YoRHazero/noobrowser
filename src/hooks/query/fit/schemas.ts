/* -------------------------------------------------------------------------- */
/*                                 Job Status                                 */
/* -------------------------------------------------------------------------- */
export type JobStatus = "pending" | "processing" | "completed" | "failed";

/* -------------------------------------------------------------------------- */
/*                               Fit Model Types                              */
/* -------------------------------------------------------------------------- */
export type FitModelType = "linear" | "gaussian";

export type FitRange = {
	min: number;
	max: number;
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
export type ExtractionBackendConfiguration = {
	aperture_size: number;
	extraction_mode: "GRISMR" | "GRISMC";
	wavelength_range?: {
		min: number;
		max: number;
	};
};

export type SourceMetaBackend = {
	source_id: string;
	ra?: number;
	dec?: number;
	x?: number;
	y?: number;
	ref_basename?: string;
	group_id?: string | null;
	z?: number;
};

export type ExtractionBodyRequest = {
	extraction_config: ExtractionBackendConfiguration;
	source_meta: SourceMetaBackend;
};

export type FitBackendConfiguration = {
	model_name: string;
	models: FitModel[];
};

export type FitBodyRequest = {
	extraction: ExtractionBodyRequest;
	fit: FitBackendConfiguration[];
};

/* -------------------------------------------------------------------------- */
/*                             Response Schemas                               */
/* -------------------------------------------------------------------------- */
export type SingleModelFitResult = {
	model_name: string;
	waic: number;
	waic_se: number;
	fitted_models: FitModel[];
	trace_filename: string;
	plot_file_url: string;
	plot_posterior_url: string;
};

export type FitResultPayload = {
	results: Record<string, SingleModelFitResult>;
	best_model_name: string;
	model_comparison_plot_url?: string;
};

export type FitJobResponse = {
	job_id: string;
	status: JobStatus;
	result?: FitResultPayload;
	error?: string;
};

/* -------------------------------------------------------------------------- */
/*                            Mutation Variables                              */
/* -------------------------------------------------------------------------- */
export type SubmitMutationVariables = {
	sourceId: string;
	sourceMeta?: SourceMetaBackend;
	extractionConfig?: ExtractionBackendConfiguration;
	fitConfigs?: FitBackendConfiguration[];
};

export type SaveFitResultResponse = {
	status: string;
	source_id: string;
	message: string;
	files_copied: {
		plots_dir: string;
		traces_dir: string;
	};
	catalog_entry_id: string | number;
};

export type SaveFitResultVariables = {
	sourceId: string;
	tags?: string[];
};

/* -------------------------------------------------------------------------- */
/*                              Catalog Schemas                               */
/* -------------------------------------------------------------------------- */
export type SourceCatalogBase = {
	id: string;
	ra: number;
	dec: number;
	ref_basename: string;
	pixel_x: number;
	pixel_y: number;
	z: number | null;
	user: string | null;
	tags: string[];
	created_at: string;
};

export type CatalogItemResponse = SourceCatalogBase & {
	// From SpectralFitResult
	best_model_name: string | null;
	plot_url_dict: Record<string, string> | null;
	posterior_url_dict: Record<string, string> | null;
	model_comparison_plot_url: string | null;
	// Legacy fields (can be computed from dicts)
	best_model_plot_url: string | null;
	best_model_posterior_url: string | null;
};

export type PaginatedCatalogResponse = {
	items: CatalogItemResponse[];
	total: number;
	page: number;
	page_size: number;
};


/* -------------------------------------------------------------------------- */
/*                          Plot Configuration                                */
/* -------------------------------------------------------------------------- */
export interface PlotConfiguration {
	show_subtracted_models?: boolean;
	show_posterior_predictive?: boolean;
	show_individual_models?: boolean;
	x_min?: number | null;
	x_max?: number | null;
	y_min?: number | null;
	y_max?: number | null;
	theme?: "light" | "dark";
}

export interface FitPlotRequest {
	source_id: string;
	model_name: string;
	config?: PlotConfiguration;
}
