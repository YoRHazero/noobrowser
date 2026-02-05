import { useEffect, useMemo } from "react";
import { useFitJobSelection } from "./useFitJobSelection";
import { useJobList } from "./useJobList";

export function useJobListView({ limit = 50 }: { limit?: number } = {}) {
	const { jobs, isLoading, error } = useJobList({ limit });
	const { selectedJobId, selectJob, clearSelection } = useFitJobSelection();

	const selectedExists = useMemo(() => {
		if (!selectedJobId) return true;
		return jobs.some((job) => job.job_id === selectedJobId);
	}, [jobs, selectedJobId]);

	useEffect(() => {
		if (!selectedExists) {
			clearSelection();
		}
	}, [clearSelection, selectedExists]);

	return {
		jobs,
		selectedJobId,
		onSelect: selectJob,
		isLoading,
		error: error?.message ?? null,
	};
}
