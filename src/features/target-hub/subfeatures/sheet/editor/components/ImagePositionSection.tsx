import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../../recipes/sheet.recipe";
import type { EditorImagePositionModel } from "../hooks/useEditorFootprintModel";
import { EditorField } from "./EditorField";

interface ImagePositionSectionProps {
	imagePosition: EditorImagePositionModel;
}

export function ImagePositionSection({
	imagePosition,
}: ImagePositionSectionProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
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
