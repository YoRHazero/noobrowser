import {
	Button,
	Drawer,
	Flex,
	TagsInput,
	useSlotRecipe,
} from "@chakra-ui/react";
import { useFitJobActions } from "./hooks/useFitJobActions";
import { fitJobDrawerRecipe } from "./recipes/fit-job-drawer.recipe";

export default function FitJobActions() {
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
	} = useFitJobActions();

	const recipe = useSlotRecipe({ recipe: fitJobDrawerRecipe });
	const styles = recipe();

	const disabled = !canSave;
	const deleteDisabled = !canDelete;

	const placeholder = selectedJobId
		? status === "completed" || status === "saved"
			? "Add tag..."
			: "Job is not completed"
		: "Select a job to add tags";

	return (
		<Drawer.Footer css={styles.footer}>
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
