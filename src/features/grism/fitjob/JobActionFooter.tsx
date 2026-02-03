import { Button, Drawer, Flex, TagsInput } from "@chakra-ui/react";
import { useFitJobActions } from "./hooks/useFitJobActions";
import { useFitJobs } from "./hooks/useFitJobs";

interface JobActionFooterProps {
	selectedJobId: string | null;
}

export default function JobActionFooter({
	selectedJobId,
}: JobActionFooterProps) {
	const { jobs, selectedTagsByJob } = useFitJobs();
	const { handleSaveResult, handleSetSelectedTags, handleAddTags, isSaving } =
		useFitJobActions();

	const selectedJob = jobs.find((j) => j.job_id === selectedJobId);

	const selectedTags = selectedJob
		? (selectedTagsByJob[selectedJob.job_id] ?? [])
		: [];
	const canEditTags = !!selectedJob && selectedJob.status === "completed";

	const handleSave = () => {
		if (!selectedJob) return;

		handleSaveResult(selectedJob.job_id, selectedTags);
	};

	return (
		<Drawer.Footer borderTop="1px solid #333">
			<Flex w="full" gap={2}>
				<TagsInput.Root
					flex={1}
					value={selectedTags}
					onValueChange={(details) => {
						if (!selectedJob) return;
						handleSetSelectedTags(selectedJob.job_id, details.value);
						handleAddTags(details.value);
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
					loading={isSaving}
					disabled={!selectedJob || selectedJob.status !== "completed"}
				>
					Save
				</Button>
			</Flex>
		</Drawer.Footer>
	);
}
