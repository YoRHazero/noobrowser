import type {
    FitJobStatusResponse,
    FitJobSummaryResponse,
} from "@/hooks/query/fit";

export type FitJobStatus = FitJobStatusResponse["status"];

export type FitJobSummary = FitJobSummaryResponse;

export type PlotKind = "comparison" | "spectrum" | "posterior" | "trace";

export type PlotState = {
    kind: PlotKind;
    title: string;
    url: string | null;
    isLoading: boolean;
    error?: string | null;
};
