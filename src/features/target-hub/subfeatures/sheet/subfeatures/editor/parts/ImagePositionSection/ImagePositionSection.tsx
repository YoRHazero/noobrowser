import { Box, useSlotRecipe } from "@chakra-ui/react";
import type { EditorImagePositionModel } from "../../shared/types";
import { EditorField } from "../EditorField";
import { ReadonlyFieldValue } from "../ReadonlyFieldValue";
import { imagePositionSectionRecipe } from "./ImagePositionSection.recipe";

interface ImagePositionSectionProps {
	imagePosition: EditorImagePositionModel;
}

export function ImagePositionSection({
	imagePosition,
}: ImagePositionSectionProps) {
	const recipe = useSlotRecipe({ recipe: imagePositionSectionRecipe });
	const styles = recipe();

	return (
		<Box css={styles.editorRow}>
			<EditorField label="X">
				<ReadonlyFieldValue value={imagePosition.xValue} tone="muted" />
			</EditorField>
			<EditorField label="Y">
				<ReadonlyFieldValue value={imagePosition.yValue} tone="muted" />
			</EditorField>
		</Box>
	);
}
