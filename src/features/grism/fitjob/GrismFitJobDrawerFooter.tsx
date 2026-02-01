import { Button, Drawer, Flex, TagsInput } from "@chakra-ui/react";
import type { FitJobResponse } from "@/hooks/query/fit/schemas";
import { useSaveFitResultMutation } from "@/hooks/query/fit/useSaveFitResult";
import { useFitStore } from "@/stores/fit";

interface GrismFitJobDrawerFooterProps {
	selectedJob?: FitJobResponse;
}

export default function GrismFitJobDrawerFooter({
	selectedJob,
}: GrismFitJobDrawerFooterProps) {
	const { mutate: saveFitResult, isPending } = useSaveFitResultMutation();
	const addTags = useFitStore((state) => state.addTags);
	const selectedTagsByJob = useFitStore((state) => state.selectedTagsByJob);
	const setSelectedTagsForJob = useFitStore(
		(state) => state.setSelectedTagsForJob,
	);

	const selectedTags = selectedJob
		? (selectedTagsByJob[selectedJob.job_id] ?? [])
		: [];
	const canEditTags = !!selectedJob && selectedJob.status === "completed";

	const handleSave = () => {
		if (!selectedJob) return;

		saveFitResult({
			sourceId: selectedJob.job_id,
			tags: selectedTags,
		});
	};

	return (
		<Drawer.Footer borderTop="1px solid #333">
			<Flex w="full" gap={2}>
				<TagsInput.Root
					flex={1}
					value={selectedTags}
					onValueChange={(details) => {
						if (!selectedJob) return;
						setSelectedTagsForJob(selectedJob.job_id, details.value);
						addTags(details.value);
					}}
					disabled={!canEditTags}
				>
					<TagsInput.Control w="full">
						<TagsInput.Items />
						<TagsInput.Input
							placeholder={
								canEditTags
									? "Add tag..."
									: "Select a completed job to add tags"
							}
						/>
					</TagsInput.Control>
				</TagsInput.Root>
				<Button
					colorPalette="blue"
					onClick={handleSave}
					loading={isPending}
					disabled={!selectedJob || selectedJob.status !== "completed"}
				>
					Save
				</Button>
			</Flex>
		</Drawer.Footer>
	);
}
