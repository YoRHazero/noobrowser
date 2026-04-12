"use client";

import {
	Button,
	Drawer,
	Flex,
	Stack,
	TagsInput,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { FitJobStatus } from "../../shared/types";
import { jobFooterActionsRecipe } from "./JobFooterActions.recipe";

type JobFooterActionsProps = {
	selectedJobId: string | null;
	status: FitJobStatus | null;
	selectedTags: string[];
	canSave: boolean;
	canDelete: boolean;
	isSaving: boolean;
	isDeleting: boolean;
	onTagsChange: (tags: string[]) => void;
	onSave: () => void;
	onDelete: () => void;
};

export default function JobFooterActions({
	selectedJobId,
	status,
	selectedTags,
	canSave,
	canDelete,
	isSaving,
	isDeleting,
	onTagsChange,
	onSave,
	onDelete,
}: JobFooterActionsProps) {
	const recipe = useSlotRecipe({ recipe: jobFooterActionsRecipe });
	const styles = recipe();

	const placeholder = !selectedJobId
		? "Select a job to enable actions"
		: status === "completed" || status === "saved"
			? "Add tags for the saved result"
			: "Tags are available after completion";

	return (
		<Drawer.Footer css={styles.root}>
			<Stack css={styles.field}>
				<Text css={styles.label}>Catalog tags</Text>
				<TagsInput.Root
					value={selectedTags}
					onValueChange={(details) => onTagsChange(details.value)}
					disabled={!canSave}
					css={styles.tagsInput}
				>
					<TagsInput.Control>
						<TagsInput.Items />
						<TagsInput.Input placeholder={placeholder} />
					</TagsInput.Control>
				</TagsInput.Root>
				<Text css={styles.helper}>
					Save stores the job in the catalog and keeps the tag chips local here.
				</Text>
			</Stack>

			<Flex css={styles.actions}>
				<Button
					variant="outline"
					css={styles.deleteButton}
					onClick={onDelete}
					disabled={!canDelete}
					loading={isDeleting}
				>
					Delete
				</Button>
				<Button
					colorPalette="cyan"
					css={styles.saveButton}
					onClick={onSave}
					disabled={!canSave}
					loading={isSaving}
				>
					Save
				</Button>
			</Flex>
		</Drawer.Footer>
	);
}
