import { useCallback, useEffect, useMemo, useState } from "react";
import { useFitJobSummary } from "@/hooks/query/fit";
import {
	usePlotCacheComparison,
	usePlotCachePosterior,
	usePlotCacheSpectrum,
	usePlotCacheTrace,
} from "@/hooks/query/plot";
import { usePlotBlobUrls } from "./usePlotBlobUrls";
import { useFitJobSelection } from "./useFitJobSelection";
import { useJobList } from "./useJobList";
import type { PlotState } from "../types";

export function useJobDetail() {
	const { jobs } = useJobList();
	const { selectedJobId } = useFitJobSelection();

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const selectedJob = useMemo(() => {
		if (!selectedJobId) return null;
		return jobs.find((job) => job.job_id === selectedJobId) ?? null;
	}, [jobs, selectedJobId]);

	const status = selectedJob?.status ?? null;
	const isCompleted = status === "completed" || status === "saved";
	const jobId = selectedJob?.job_id ?? "";
	const [selectedModelName, setSelectedModelName] = useState<string | null>(null);
	const selectModelName = useCallback((modelName: string) => {
		setSelectedModelName(modelName);
	}, []);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const summaryQuery = useFitJobSummary({ jobId, enabled: isCompleted });
	const comparisonQuery = usePlotCacheComparison({ jobId, enabled: isCompleted });
	const modelNameParam =
		selectedModelName &&
		summaryQuery.data?.best_model_name &&
		selectedModelName === summaryQuery.data.best_model_name
			? null
			: selectedModelName;
	const spectrumQuery = usePlotCacheSpectrum({
		jobId,
		enabled: isCompleted,
		model_name: modelNameParam,
	});
	const posteriorQuery = usePlotCachePosterior({
		jobId,
		enabled: isCompleted,
		model_name: modelNameParam,
	});
	const traceQuery = usePlotCacheTrace({
		jobId,
		enabled: isCompleted,
		model_name: modelNameParam,
	});

	useEffect(() => {
		if (!summaryQuery.data || summaryQuery.data.job_id !== jobId) {
			setSelectedModelName(null);
			return;
		}

		const available = summaryQuery.data.results.map((model) => model.model_name);
		setSelectedModelName((prev) => {
			if (prev && available.includes(prev)) return prev;
			return summaryQuery.data.best_model_name ?? available[0] ?? null;
		});
	}, [jobId, summaryQuery.data]);

	const plotUrls = usePlotBlobUrls({
		comparison: comparisonQuery.data ?? null,
		spectrum: spectrumQuery.data ?? null,
		posterior: posteriorQuery.data ?? null,
		trace: traceQuery.data ?? null,
	});

	const plots: PlotState[] = [
		{
			kind: "comparison",
			title: "Model Comparison",
			url: plotUrls.comparisonUrl,
			isLoading: comparisonQuery.isFetching,
			error: comparisonQuery.isError
				? (comparisonQuery.error as Error)?.message
				: null,
		},
		{
			kind: "spectrum",
			title: "Spectrum",
			url: plotUrls.spectrumUrl,
			isLoading: spectrumQuery.isFetching,
			error: spectrumQuery.isError
				? (spectrumQuery.error as Error)?.message
				: null,
		},
		{
			kind: "posterior",
			title: "Posterior",
			url: plotUrls.posteriorUrl,
			isLoading: posteriorQuery.isFetching,
			error: posteriorQuery.isError
				? (posteriorQuery.error as Error)?.message
				: null,
		},
		{
			kind: "trace",
			title: "Trace",
			url: plotUrls.traceUrl,
			isLoading: traceQuery.isFetching,
			error: traceQuery.isError
				? (traceQuery.error as Error)?.message
				: null,
		},
	];

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		selectedJob,
		status,
		summary: summaryQuery.data ?? null,
		summaryLoading: summaryQuery.isLoading,
		summaryError: summaryQuery.isError
			? (summaryQuery.error as Error)?.message
			: null,
		selectedModelName,
		selectModelName,
		plots,
	};
}
