import { useCallback, useEffect, useMemo, useState } from "react";
import { useFitJobSummary } from "@/hooks/query/fit";
import { useFitJobList } from "./useFitJobList";
import { useFitJobSelection } from "./useFitJobSelection";

export function useFitJobDetail() {
    /* -------------------------------------------------------------------------- */
    /*                                Access Store                                */
    /* -------------------------------------------------------------------------- */
    const { jobs } = useFitJobList();
    const { selectedJobId } = useFitJobSelection();

    /* -------------------------------------------------------------------------- */
    /*                                 Local State                                */
    /* -------------------------------------------------------------------------- */
    const [selectedModelName, setSelectedModelName] = useState<string | null>(
        null,
    );

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

    /* -------------------------------------------------------------------------- */
    /*                                   Effects                                  */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (!summaryQuery.data || summaryQuery.data.job_id !== jobId) {
            setSelectedModelName(null);
            return;
        }

        const available = summaryQuery.data.results.map(
            (model) => model.model_name,
        );
        setSelectedModelName((prev) => {
            if (prev && available.includes(prev)) return prev;
            return summaryQuery.data.best_model_name ?? available[0] ?? null;
        });
    }, [jobId, summaryQuery.data]);

    /* -------------------------------------------------------------------------- */
    /*                                   Handle                                   */
    /* -------------------------------------------------------------------------- */
    const selectModelName = useCallback((modelName: string) => {
        setSelectedModelName(modelName);
    }, []);

    /* -------------------------------------------------------------------------- */
    /*                                   Return                                   */
    /* -------------------------------------------------------------------------- */
    return {
        selectedJob,
        status,
        summary: summaryQuery.data ?? null,
        summaryLoading: summaryQuery.isLoading,
        summaryError: summaryQuery.isError
            ? summaryQuery.error instanceof Error
                ? summaryQuery.error.message
                : String(summaryQuery.error)
            : null,
        selectedModelName,
        selectModelName,
    };
}
