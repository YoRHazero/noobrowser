"use client";

import {
	usePlotCacheComparison,
	usePlotCachePosterior,
	usePlotCacheSpectrum,
	usePlotCacheTrace,
} from "@/hooks/query/plot";
import { FIT_JOB_PLOT_TITLES } from "../shared/constants";
import type {
	FitJobPlotState,
	FitJobStatus,
	FitJobSummary,
} from "../shared/types";
import { usePlotBlobUrls } from "./usePlotBlobUrls";

function toMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

type UseFitJobPlotModelsParams = {
	jobId: string | null;
	status: FitJobStatus | null;
	summary: FitJobSummary | null;
	selectedModelName: string | null;
};

export function useFitJobPlotModels({
	jobId,
	status,
	summary,
	selectedModelName,
}: UseFitJobPlotModelsParams) {
	const isReady =
		jobId !== null &&
		(status === "completed" || status === "saved") &&
		summary !== null;

	const bestModelName = summary?.best_model_name ?? null;
	const modelNameParam =
		selectedModelName && bestModelName && selectedModelName === bestModelName
			? null
			: selectedModelName;

	const comparisonQuery = usePlotCacheComparison({
		jobId: jobId ?? "",
		enabled: isReady,
	});
	const spectrumQuery = usePlotCacheSpectrum({
		jobId: jobId ?? "",
		enabled: isReady,
		model_name: modelNameParam,
	});
	const posteriorQuery = usePlotCachePosterior({
		jobId: jobId ?? "",
		enabled: isReady,
		model_name: modelNameParam,
	});
	const traceQuery = usePlotCacheTrace({
		jobId: jobId ?? "",
		enabled: isReady,
		model_name: modelNameParam,
	});

	const blobUrls = usePlotBlobUrls({
		comparison: comparisonQuery.data ?? null,
		spectrum: spectrumQuery.data ?? null,
		posterior: posteriorQuery.data ?? null,
		trace: traceQuery.data ?? null,
	});

	const plots: FitJobPlotState[] = [
		{
			kind: "comparison",
			title: FIT_JOB_PLOT_TITLES.comparison,
			url: blobUrls.comparisonUrl,
			isLoading: comparisonQuery.isFetching,
			error: comparisonQuery.error ? toMessage(comparisonQuery.error) : null,
		},
		{
			kind: "spectrum",
			title: FIT_JOB_PLOT_TITLES.spectrum,
			url: blobUrls.spectrumUrl,
			isLoading: spectrumQuery.isFetching,
			error: spectrumQuery.error ? toMessage(spectrumQuery.error) : null,
		},
		{
			kind: "posterior",
			title: FIT_JOB_PLOT_TITLES.posterior,
			url: blobUrls.posteriorUrl,
			isLoading: posteriorQuery.isFetching,
			error: posteriorQuery.error ? toMessage(posteriorQuery.error) : null,
		},
		{
			kind: "trace",
			title: FIT_JOB_PLOT_TITLES.trace,
			url: blobUrls.traceUrl,
			isLoading: traceQuery.isFetching,
			error: traceQuery.error ? toMessage(traceQuery.error) : null,
		},
	];

	return {
		plots,
	};
}
