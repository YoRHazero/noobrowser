/* -------------------------------------------------------------------------- */
/*                              Catalog Schemas                               */
/* -------------------------------------------------------------------------- */

export type FitResultSummary = {
	job_id: string;
	created_at: string;
	best_model_name: string | null;
	trace_url_dict: Record<string, string>;
};

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
	fit_history: FitResultSummary[];
};

export type PaginatedCatalogResponse = {
	items: CatalogItemResponse[];
	total: number;
	page: number;
	page_size: number;
};

/* -------------------------------------------------------------------------- */
/*                            Mutation Variables                              */
/* -------------------------------------------------------------------------- */

export type SaveFitResultQueryRequest = {
	page?: number;
	page_size?: number;
	sort_desc?: boolean;
	user?: string;
};

export type SaveFitResultResponse = {
	status: string;
	message: string;
	source_id: string;
};

export type DeleteCatalogResponse = {
	status: string;
	message: string;
};

export type SaveFitResultVariables = {
	jobId: string;
	tags?: string[];
};
