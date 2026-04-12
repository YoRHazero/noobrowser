import type {
	FitJobStatusResponse,
	FitJobSummaryResponse,
	JobStatus,
} from "@/hooks/query/fit";

export type FitJobRecord = FitJobStatusResponse;
export type FitJobStatus = JobStatus;
export type FitJobSummary = FitJobSummaryResponse;
export type FitJobComponentSummary =
	FitJobSummary["results"][number]["components"][number];

export type FitJobPlotKind = "comparison" | "spectrum" | "posterior" | "trace";

export interface FitJobPlotState {
	kind: FitJobPlotKind;
	title: string;
	url: string | null;
	isLoading: boolean;
	error: string | null;
}

export interface FitJobListModel {
	jobs: FitJobRecord[];
	selectedJobId: string | null;
	isLoading: boolean;
	isFetching: boolean;
	error: string | null;
	onSelectJob: (jobId: string) => void;
	onClearSelectedJob: () => void;
}

export interface FitJobDetailModel {
	selectedJob: FitJobRecord | null;
	status: FitJobStatus | null;
	summary: FitJobSummary | null;
	summaryLoading: boolean;
	summaryError: string | null;
	selectedModelName: string | null;
	onSelectModelName: (modelName: string) => void;
}

export interface FitJobActionsModel {
	selectedTags: string[];
	canSave: boolean;
	canDelete: boolean;
	isSaving: boolean;
	isDeleting: boolean;
	onTagsChange: (tags: string[]) => void;
	onSave: () => void;
	onDelete: () => void;
}
