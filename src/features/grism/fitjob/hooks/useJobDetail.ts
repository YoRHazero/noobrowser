import { useMemo } from "react";
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

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const summaryQuery = useFitJobSummary({ jobId, enabled: isCompleted });
	const comparisonQuery = usePlotCacheComparison({ jobId, enabled: isCompleted });
	const spectrumQuery = usePlotCacheSpectrum({ jobId, enabled: isCompleted });
	const posteriorQuery = usePlotCachePosterior({ jobId, enabled: isCompleted });
	const traceQuery = usePlotCacheTrace({ jobId, enabled: isCompleted });

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
		plots,
	};
}
