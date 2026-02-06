import { Button, Drawer, Flex, TagsInput } from "@chakra-ui/react";
import { useJobActionFooter } from "../hooks/useJobActionFooter";

export default function JobActionFooter() {
	const {
		selectedJobId,
		status,
		selectedTags,
		handleTagsChange,
		handleSave,
		handleDelete,
		isSaving,
		isDeleting,
		canDelete,
		canSave,
	} = useJobActionFooter();
	const disabled = !canSave;
	const deleteDisabled = !canDelete;
	const placeholder = selectedJobId
		? status === "completed" || status === "saved"
			? "Add tag..."
			: "Job is not completed"
		: "Select a job to add tags";

	return (
		<Drawer.Footer borderTop="1px solid #333">
			<Flex w="full" gap={2}>
				<TagsInput.Root
					flex={1}
					value={selectedTags}
					onValueChange={(details) => handleTagsChange(details.value)}
					disabled={disabled}
				>
					<TagsInput.Control w="full">
						<TagsInput.Items />
						<TagsInput.Input placeholder={placeholder} />
					</TagsInput.Control>
				</TagsInput.Root>
				<Button
					variant="outline"
					colorPalette="red"
					onClick={handleDelete}
					loading={isDeleting}
					disabled={deleteDisabled}
				>
					Delete
				</Button>
				<Button
					colorPalette="blue"
					onClick={handleSave}
					loading={isSaving}
					disabled={disabled}
				>
					Save
				</Button>
			</Flex>
		</Drawer.Footer>
	);
}
