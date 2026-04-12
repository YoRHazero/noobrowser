import { Box, NumberInput, useSlotRecipe } from "@chakra-ui/react";
import type { EditorSkyPositionModel } from "../../shared/types";
import { EditorField } from "../EditorField";
import { ReadonlyFieldValue } from "../ReadonlyFieldValue";
import { skyPositionSectionRecipe } from "./SkyPositionSection.recipe";

interface SkyPositionSectionProps {
	skyPosition: EditorSkyPositionModel;
}

export function SkyPositionSection({ skyPosition }: SkyPositionSectionProps) {
	const recipe = useSlotRecipe({ recipe: skyPositionSectionRecipe });
	const styles = recipe();

	return (
		<Box css={styles.editorRow}>
			<EditorField label="RA">
				{skyPosition.isDetail ? (
					<ReadonlyFieldValue value={skyPosition.raValue} tone="default" />
				) : (
					<NumberInput.Root
						css={styles.editableFieldRoot}
						size="sm"
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
					<ReadonlyFieldValue value={skyPosition.decValue} tone="default" />
				) : (
					<NumberInput.Root
						css={styles.editableFieldRoot}
						size="sm"
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
