import { Box, NumberInput, Text, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../../recipes/sheet.recipe";
import type { EditorSkyPositionModel } from "../hooks/useEditorIdentityModel";
import { EditorField } from "./EditorField";

interface SkyPositionSectionProps {
	skyPosition: EditorSkyPositionModel;
}

export function SkyPositionSection({ skyPosition }: SkyPositionSectionProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Box css={styles.editorRow}>
			<EditorField label="RA">
				{skyPosition.isDetail ? (
					<Box css={styles.readonlyField}>
						<Text color="white">{skyPosition.raValue}</Text>
					</Box>
				) : (
					<NumberInput.Root
						size="sm"
						w="full"
						value={skyPosition.draftRa}
						onValueChange={(details) => skyPosition.onRaChange(details.value)}
					>
						<NumberInput.Input
							aria-label="Source RA"
							css={styles.editableField}
						/>
					</NumberInput.Root>
				)}
			</EditorField>
			<EditorField label="Dec">
				{skyPosition.isDetail ? (
					<Box css={styles.readonlyField}>
						<Text color="white">{skyPosition.decValue}</Text>
					</Box>
				) : (
					<NumberInput.Root
						size="sm"
						w="full"
						value={skyPosition.draftDec}
						onValueChange={(details) => skyPosition.onDecChange(details.value)}
					>
						<NumberInput.Input
							aria-label="Source Dec"
							css={styles.editableField}
						/>
					</NumberInput.Root>
				)}
			</EditorField>
		</Box>
	);
}
