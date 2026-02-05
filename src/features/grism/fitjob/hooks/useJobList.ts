import { useFitJobs, type FitJobStatusResponse } from "@/hooks/query/fit";

export function useJobList({ limit = 50 }: { limit?: number } = {}) {
	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const jobsQuery = useFitJobs({ limit });
	const jobs: FitJobStatusResponse[] = jobsQuery.data ?? [];
	const activeJobs = jobs.filter(
		(job) => job.status === "pending" || job.status === "processing",
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		jobs,
		activeJobs,
		isLoading: jobsQuery.isLoading,
		isFetching: jobsQuery.isFetching,
		isError: jobsQuery.isError,
		error: jobsQuery.error as Error | null,
		refetch: jobsQuery.refetch,
	};
}
