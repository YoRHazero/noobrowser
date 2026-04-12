"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFitJobSummary } from "@/hooks/query/fit";
import type { FitJobDetailModel, FitJobListModel } from "../shared/types";

function toMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

type UseFitJobDetailModelParams = Pick<
	FitJobListModel,
	"jobs" | "selectedJobId"
>;

export function useFitJobDetailModel({
	jobs,
	selectedJobId,
}: UseFitJobDetailModelParams): FitJobDetailModel {
	const selectedJob = useMemo(() => {
		if (!selectedJobId) {
			return null;
		}

		return jobs.find((job) => job.job_id === selectedJobId) ?? null;
	}, [jobs, selectedJobId]);

	const status = selectedJob?.status ?? null;
	const isSummaryEnabled = status === "completed" || status === "saved";
	const summaryQuery = useFitJobSummary({
		jobId: selectedJob?.job_id ?? "",
		enabled: isSummaryEnabled,
	});

	const [selectedModelName, setSelectedModelName] = useState<string | null>(
		null,
	);

	useEffect(() => {
		if (!selectedJob || !summaryQuery.data) {
			setSelectedModelName(null);
			return;
		}

		if (summaryQuery.data.job_id !== selectedJob.job_id) {
			setSelectedModelName(null);
			return;
		}

		const availableModelNames = summaryQuery.data.results.map(
			(result) => result.model_name,
		);

		setSelectedModelName((current) => {
			if (current && availableModelNames.includes(current)) {
				return current;
			}

			return (
				summaryQuery.data?.best_model_name ?? availableModelNames[0] ?? null
			);
		});
	}, [selectedJob, summaryQuery.data]);

	const onSelectModelName = useCallback((modelName: string) => {
		setSelectedModelName(modelName);
	}, []);

	return {
		selectedJob,
		status,
		summary: summaryQuery.data ?? null,
		summaryLoading: summaryQuery.isLoading,
		summaryError: summaryQuery.error ? toMessage(summaryQuery.error) : null,
		selectedModelName,
		onSelectModelName,
	};
}
