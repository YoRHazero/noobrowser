import type {
	FitJobStatusResponse,
	FitJobSummaryResponse,
	JobStatus,
} from "@/hooks/query/fit";
import type { FitJobPlotKind } from "../shared/types";

export interface FitJobListModel {
	jobs: FitJobStatusResponse[];
	selectedJobId: string | null;
	isLoading: boolean;
	isFetching: boolean;
	error: string | null;
	onSelectJob: (jobId: string) => void;
	onClearSelectedJob: () => void;
}

export interface FitJobDetailModel {
	selectedJob: FitJobStatusResponse | null;
	status: JobStatus | null;
	summary: FitJobSummaryResponse | null;
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

export interface FitJobPlotState {
	kind: FitJobPlotKind;
	title: string;
	url: string | null;
	isLoading: boolean;
	error: string | null;
}
