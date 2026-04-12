"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useFitJobs } from "@/hooks/query/fit";
import { FIT_JOB_LIST_LIMIT } from "../shared/constants";
import type { FitJobListModel } from "../shared/types";
import { useFitJobStore } from "../store";

function toMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

export function useFitJobListModel(): FitJobListModel {
	const { selectedJobId, selectJob, clearSelectedJob } = useFitJobStore(
		useShallow((state) => ({
			selectedJobId: state.selectedJobId,
			selectJob: state.selectJob,
			clearSelectedJob: state.clearSelectedJob,
		})),
	);

	const jobsQuery = useFitJobs({ limit: FIT_JOB_LIST_LIMIT });
	const jobs = jobsQuery.data ?? [];

	useEffect(() => {
		if (!selectedJobId || !jobsQuery.isSuccess) {
			return;
		}

		const exists = jobs.some((job) => job.job_id === selectedJobId);
		if (!exists) {
			clearSelectedJob();
		}
	}, [clearSelectedJob, jobs, jobsQuery.isSuccess, selectedJobId]);

	return {
		jobs,
		selectedJobId,
		isLoading: jobsQuery.isLoading,
		isFetching: jobsQuery.isFetching,
		error: jobsQuery.error ? toMessage(jobsQuery.error) : null,
		onSelectJob: selectJob,
		onClearSelectedJob: clearSelectedJob,
	};
}
