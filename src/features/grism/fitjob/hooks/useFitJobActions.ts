import { useFitStore } from "@/stores/fit";
import { useSaveFitResultMutation } from "@/hooks/query/fit/useSaveFitResult";

export function useFitJobActions() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const removeJob = useFitStore((state) => state.removeJob);
	const addTags = useFitStore((state) => state.addTags);
	const setSelectedTagsForJob = useFitStore(
		(state) => state.setSelectedTagsForJob,
	);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const { mutate: saveFitResult, isPending: isSaving } =
		useSaveFitResultMutation();

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleRemoveJob = (id: string) => {
		removeJob(id);
	};

	const handleAddTags = (tags: string[]) => {
		addTags(tags);
	};

	const handleSetSelectedTags = (jobId: string, tags: string[]) => {
		setSelectedTagsForJob(jobId, tags);
	};

	const handleSaveResult = (jobId: string, tags: string[]) => {
		saveFitResult({
			sourceId: jobId,
			tags,
		});
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		handleRemoveJob,
		handleAddTags,
		handleSetSelectedTags,
		handleSaveResult,
		isSaving,
	};
}
