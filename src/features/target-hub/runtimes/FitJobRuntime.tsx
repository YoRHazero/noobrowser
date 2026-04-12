"use client";

import { useEffect, useRef } from "react";
import { type FitJobStatusResponse, useFitJobs } from "@/hooks/query/fit";
import {
	FIT_JOB_ACTIVE_REFETCH_INTERVAL_MS,
	FIT_JOB_EFFECT_COLOR,
	FIT_JOB_ERROR_COLOR,
	FIT_JOB_LIST_LIMIT,
} from "../shared/constants";
import { useFeedbackStore } from "../store/useFeedbackStore";

export default function FitJobRuntime() {
	const emitEffect = useFeedbackStore((state) => state.emitEffect);
	const previousStatusesRef = useRef(
		new Map<string, FitJobStatusResponse["status"]>(),
	);
	const hasBaselineRef = useRef(false);

	const jobsQuery = useFitJobs({
		limit: FIT_JOB_LIST_LIMIT,
		options: {
			refetchInterval: (query) => {
				const data = query.state.data;
				const hasActiveJobs = data?.some(
					(job) => job.status === "pending" || job.status === "processing",
				);
				return hasActiveJobs ? FIT_JOB_ACTIVE_REFETCH_INTERVAL_MS : false;
			},
		},
	});

	useEffect(() => {
		const jobs = jobsQuery.data;

		if (!jobs) {
			return;
		}

		const nextStatuses = new Map(
			jobs.map((job) => [job.job_id, job.status] as const),
		);

		if (!hasBaselineRef.current) {
			hasBaselineRef.current = true;
			previousStatusesRef.current = nextStatuses;
			return;
		}

		for (const job of jobs) {
			const previousStatus = previousStatusesRef.current.get(job.job_id);
			const wasActive =
				previousStatus === "pending" || previousStatus === "processing";
			if (!wasActive) {
				continue;
			}

			if (job.status === "completed" || job.status === "saved") {
				emitEffect("fit-ready", FIT_JOB_EFFECT_COLOR);
				continue;
			}

			if (job.status === "failed") {
				emitEffect("fit-error", FIT_JOB_ERROR_COLOR);
			}
		}

		previousStatusesRef.current = nextStatuses;
	}, [emitEffect, jobsQuery.data]);

	return null;
}
