import { Button, HStack, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { EditorExtractionModel } from "../../shared/types";
import { ExtractionDraftField } from "../ExtractionDraftField";
import { extractionSettingsContentRecipe } from "./ExtractionSettingsContent.recipe";

interface ExtractionSettingsContentProps {
	extraction: EditorExtractionModel;
}

export function ExtractionSettingsContent({
	extraction,
}: ExtractionSettingsContentProps) {
	const recipe = useSlotRecipe({ recipe: extractionSettingsContentRecipe });
	const styles = recipe({ canSave: extraction.canSave });

	return (
		<Stack css={styles.content}>
			<Text css={styles.title}>Extraction settings</Text>

			<Stack css={styles.fields}>
				<ExtractionDraftField
					label="Aperture (px)"
					value={extraction.apertureSize}
					step={1}
					min={0}
					onChange={extraction.onApertureSizeChange}
				/>
				<ExtractionDraftField
					label="Wave min (um)"
					value={extraction.waveMinUm}
					step={0.1}
					min={0}
					onChange={extraction.onWaveMinUmChange}
				/>
				<ExtractionDraftField
					label="Wave max (um)"
					value={extraction.waveMaxUm}
					step={0.1}
					min={0}
					onChange={extraction.onWaveMaxUmChange}
				/>
			</Stack>

			<Text css={styles.helperText}>
				{extraction.saveDisabledReason ?? "Changes apply after you save."}
			</Text>

			<HStack css={styles.actions}>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					css={styles.ghostButton}
					onClick={extraction.onReset}
				>
					Reset
				</Button>
				<Button
					type="button"
					size="sm"
					variant="outline"
					css={styles.outlineButton}
					disabled={!extraction.canSave}
					onClick={extraction.onSave}
				>
					Save
				</Button>
			</HStack>
		</Stack>
	);
}
