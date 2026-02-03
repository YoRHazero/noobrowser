import { useFitStore } from "@/stores/fit";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export function useFitJobs() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { jobs, selectedTagsByJob } = useFitStore(
		useShallow((state) => ({
			jobs: state.jobs,
			selectedTagsByJob: state.selectedTagsByJob,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const activeJobs = useMemo(
		() =>
			jobs.filter(
				(job) => job.status === "pending" || job.status === "processing",
			),
		[jobs],
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		jobs,
		activeJobs,
		selectedTagsByJob,
	};
}
