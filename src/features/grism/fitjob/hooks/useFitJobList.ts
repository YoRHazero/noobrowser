import { useEffect, useMemo } from "react";
import { useFitJobs, type FitJobStatusResponse } from "@/hooks/query/fit";
import { useFitJobSelection } from "./useFitJobSelection";

export function useFitJobList({ limit = 50 }: { limit?: number } = {}) {
    /* -------------------------------------------------------------------------- */
    /*                              Mutations/Query                               */
    /* -------------------------------------------------------------------------- */
    const jobsQuery = useFitJobs({ limit });
    const jobs: FitJobStatusResponse[] = jobsQuery.data ?? [];
    const activeJobs = jobs.filter(
        (job) => job.status === "pending" || job.status === "processing",
    );

    /* -------------------------------------------------------------------------- */
    /*                                Access Store                                */
    /* -------------------------------------------------------------------------- */
    const { selectedJobId, selectJob, clearSelection } = useFitJobSelection();

    /* -------------------------------------------------------------------------- */
    /*                               Derived Values                               */
    /* -------------------------------------------------------------------------- */
    const selectedExists = useMemo(() => {
        if (!selectedJobId) return true;
        return jobs.some((job) => job.job_id === selectedJobId);
    }, [jobs, selectedJobId]);

    /* -------------------------------------------------------------------------- */
    /*                                   Effects                                  */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (!selectedExists) {
            clearSelection();
        }
    }, [clearSelection, selectedExists]);

    /* -------------------------------------------------------------------------- */
    /*                                   Handle                                   */
    /* -------------------------------------------------------------------------- */
    // No specific handlers logic here outside of selectJob from context

    /* -------------------------------------------------------------------------- */
    /*                                   Return                                   */
    /* -------------------------------------------------------------------------- */
    return {
        jobs,
        activeJobs,
        selectedJobId,
        onSelect: selectJob,
        isLoading: jobsQuery.isLoading,
        isFetching: jobsQuery.isFetching,
        isError: jobsQuery.isError,
        error: jobsQuery.error
            ? jobsQuery.error instanceof Error
                ? jobsQuery.error.message
                : String(jobsQuery.error)
            : null,
        refetch: jobsQuery.refetch,
    };
}
