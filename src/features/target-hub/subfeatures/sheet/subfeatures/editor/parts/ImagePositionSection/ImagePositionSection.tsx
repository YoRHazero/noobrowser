import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import type { EditorImagePositionModel } from "../../hooks/useEditorFootprintModel";
import { EditorField } from "../EditorField";
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
				<Box css={styles.readonlyField}>
					<Text color="whiteAlpha.820">{imagePosition.xValue}</Text>
				</Box>
			</EditorField>
			<EditorField label="Y">
				<Box css={styles.readonlyField}>
					<Text color="whiteAlpha.820">{imagePosition.yValue}</Text>
				</Box>
			</EditorField>
		</Box>
	);
}
