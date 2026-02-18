export interface CatalogUpdateBody {
  user?: string | null;
  z?: number | null;
  tags?: string[] | null;
}

export interface SourceCatalogBase {
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
}

export interface FitResultSummary {
  job_id: string;
  created_at: string;
  best_model_name: string | null;
  trace_url_dict: Record<string, string>;
}

export interface CatalogItemListResponse extends SourceCatalogBase {
  fit_count: number;
  latest_job_id: string | null;
  latest_job_status: string | null;
}

export interface PaginatedCatalogListResponse {
  items: CatalogItemListResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface CatalogSourceDetailResponse extends SourceCatalogBase {
  fit_history: FitResultSummary[];
}

export interface ModelComponentResponse {
  component_name: string;
  component_type: string;
  physical_name: string | null;
  amplitude: number | null;
  amplitude_error: number | null;
  fwhm_kms: number | null;
  fwhm_kms_error: number | null;
  parameters_json: Record<string, any>;
}

export interface ModelResultResponse {
  model_name: string;
  waic: number | null;
  waic_se: number | null;
  is_best: boolean;
  trace_file: string | null;
  components: ModelComponentResponse[];
}

export interface FitResultDetailResponse {
  job_id: string;
  source_id: string;
  created_at: string;
  best_model_name: string | null;
  request_json: string | null;
  spectrum_json: string | null;
  model_results: ModelResultResponse[];
}
